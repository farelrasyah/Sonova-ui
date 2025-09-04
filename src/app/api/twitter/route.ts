// sonova/src/app/api/twitter/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_WORKER_BASE = 'https://xmediahub.farelrasyah87.workers.dev';

function getWorkerBase() {
  // Bisa override via env kalau mau
  return process.env.NEXT_PUBLIC_TWITTER_WORKER_BASE?.replace(/\/+$/, '') || DEFAULT_WORKER_BASE;
}

// Normalisasi URL → pastikan https://
function normalizeUrl(u?: string | null) {
  if (!u) return u || undefined;
  if (u.startsWith('//')) return ('https:' + u) as string;
  if (u.startsWith('http://')) return (u.replace(/^http:/, 'https:')) as string;
  if (!/^https?:\/\//i.test(u)) return ('https://' + u) as string;
  return u;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
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

    // validasi + normalisasi struktur dari worker
    const mediaType: 'video' | 'animated_gif' | 'photo' = data?.media?.type;
    const bestRaw: string | null = data?.media?.best || null;
    const thumbRaw: string | null = data?.media?.thumbnail || null;
    const variantsRaw: any[] = Array.isArray(data?.media?.variants) ? data.media.variants : [];

    const best = normalizeUrl(bestRaw) || undefined;
    const thumbnail = normalizeUrl(thumbRaw) || undefined;
    const variants = variantsRaw
      .filter((v) => v?.url)
      .map((v) => ({
        ...v,
        url: normalizeUrl(v.url),
      }));

    // normalized untuk HeroSection preview
    const normalizedItems: Array<{ type: 'video'|'image'; url: string; thumbnail?: string }> = [];

    if (mediaType === 'photo' && thumbnail) {
      // image → tampilkan langsung (tanpa proxy) karena pbs.twimg.com sudah CORS-friendly
      normalizedItems.push({ type: 'image', url: thumbnail, thumbnail });
    } else if ((mediaType === 'video' || mediaType === 'animated_gif') && best) {
      // video → gunakan PROXY route agar dapat Range streaming & CORS aman
      const proxied = `/api/twitter/proxy?mediaUrl=${encodeURIComponent(best)}`;
      normalizedItems.push({ type: 'video', url: proxied, thumbnail: thumbnail || undefined });
    }

    const titleText: string =
      (data?.tweet?.text as string | undefined)?.trim() || 'Twitter Media';

    // tombol download utama (best quality) → Worker download endpoint
    const downloadUrl = `${worker}/twitter/download?url=${encodeURIComponent(url)}`;

    return NextResponse.json({
      success: true,
      platform: 'twitter',
      source: 'cloudflare-worker',
      input: url,

      // tombol download langsung
      videoUrl: downloadUrl,

      // info untuk UI
      type: mediaType === 'photo' ? 'image' : 'video',
      thumbnail,

      tweet: {
        id: data?.tweet?.id,
        author: data?.tweet?.author,
        username: data?.tweet?.author_username,
        profile_image: normalizeUrl(data?.tweet?.profile_image) || undefined,
        text: data?.tweet?.text,
      },

      // blok normalized untuk preview generic
      normalized: {
        title: titleText,
        items: normalizedItems,
      },

      // opsional: render list kualitas
      variants: variants.map((v) => ({
        url: `/api/twitter/proxy?mediaUrl=${encodeURIComponent(v.url)}`,
        bitrate: v.bitrate || null,
        width: v.width || null,
        height: v.height || null,
        label:
          v.label ||
          (v.height ? `${v.height}p` : v.bitrate ? `${Math.round(v.bitrate / 1000)}kbps` : 'mp4'),
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
