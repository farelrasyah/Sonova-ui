// sonova/src/app/api/twitter/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_WORKER_BASE = 'https://xmediahub.farelrasyah87.workers.dev';

function getWorkerBase() {
  // Bisa override via env kalau mau
  return process.env.NEXT_PUBLIC_TWITTER_WORKER_BASE?.replace(/\/+$/, '') || DEFAULT_WORKER_BASE;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams, pathname } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: "Parameter 'url' wajib diisi. Contoh: /api/twitter?url=https://x.com/.../status/123" },
        { status: 400 }
      );
    }

    const worker = getWorkerBase();
    // panggil worker JSON (all=1 agar dapat semua varian; best = index 0)
    const workerUrl = `${worker}/twitter/resolve?url=${encodeURIComponent(url)}&all=1`;
    const wres = await fetch(workerUrl, {
      headers: { 'user-agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });

    if (!wres.ok) {
      const msg = await safeText(wres);
      return NextResponse.json(
        { error: 'Gagal memanggil resolver', status: wres.status, message: msg },
        { status: 502 }
      );
    }

    const data = await wres.json();

    // validasi struktur dari worker
    const mediaType: 'video' | 'animated_gif' | 'photo' = data?.media?.type;
    const best: string | null = data?.media?.best || null;
    const thumbnail: string | null = data?.media?.thumbnail || null;
    const variants: any[] = Array.isArray(data?.media?.variants) ? data.media.variants : [];

    // normalized untuk HeroSection preview (re-using generic layout)
    const normalizedItems = [] as Array<{ type: 'video'|'image'; url: string; thumbnail?: string }>;

    if (mediaType === 'photo' && thumbnail) {
      normalizedItems.push({ type: 'image', url: thumbnail, thumbnail });
    } else if ((mediaType === 'video' || mediaType === 'animated_gif') && best) {
      // gunakan PROXY route sendiri agar video <video> bisa stream range via domain kita (aman)
      const proxied = `/api/twitter/proxy?mediaUrl=${encodeURIComponent(best)}`;
      normalizedItems.push({ type: 'video', url: proxied, thumbnail: thumbnail || undefined });
    }

    const titleText: string =
      (data?.tweet?.text as string | undefined)?.trim() || 'Twitter Media';

    // Kembalikan bentuk yang HeroSection-mu harapkan:
    // - videoUrl (untuk tombol download langsung) → gunakan /twitter/download dari worker
    //   ATAU berikan direct best MP4 (di sini, saya berikan link worker download agar stabil)
    const downloadUrl = `${worker}/twitter/download?url=${encodeURIComponent(url)}`;

    return NextResponse.json({
      success: true,
      platform: 'twitter',
      source: 'cloudflare-worker',
      input: url,
      // tombol download utama (best quality)
      videoUrl: downloadUrl,
      // informasi tambahan untuk preview
      type: mediaType === 'photo' ? 'image' : 'video',
      thumbnail,
      tweet: {
        id: data?.tweet?.id,
        author: data?.tweet?.author,
        username: data?.tweet?.author_username,
        profile_image: data?.tweet?.profile_image,
        text: data?.tweet?.text,
      },
      // Normalized block utk komponen preview generic (di HeroSection)
      normalized: {
        title: titleText,
        items: normalizedItems,
      },
      // Jika kamu ingin render manual opsi kualitas, kamu bisa pakai ini
      variants: variants.map(v => ({
        url: `/api/twitter/proxy?mediaUrl=${encodeURIComponent(v.url)}`,
        bitrate: v.bitrate || null,
        width: v.width || null,
        height: v.height || null,
        label: v.label || (v.height ? `${v.height}p` : (v.bitrate ? `${Math.round(v.bitrate/1000)}kbps` : 'mp4')),
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal error', message: err?.message || String(err) },
      { status: 500 }
    );
  }
}

async function safeText(res: Response) {
  try { return await res.text(); } catch { return ''; }
}