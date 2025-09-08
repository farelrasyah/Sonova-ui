// sonova/src/app/api/twitter/download/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_WORKER_BASE = 'https://xmediahub.farelrasyah87.workers.dev';
const ALLOWED_HOSTS = new Set(['video.twimg.com', 'pbs.twimg.com']);

function getWorkerBase() {
  return process.env.NEXT_PUBLIC_TWITTER_WORKER_BASE?.replace(/\/+$/, '') || DEFAULT_WORKER_BASE;
}

function sanitizeFilename(filename: string): string {
  // Decode URL encoded string
  let decoded = '';
  try {
    decoded = decodeURIComponent(filename);
  } catch {
    decoded = filename;
  }
  
  // Remove or replace problematic characters
  return decoded
    .replace(/[<>:"/\\|?*]/g, '') // Remove Windows forbidden chars
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, '') // Remove control chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, 200) // Limit length
    || 'twitter_media'; // Fallback if empty
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get('mediaUrl');
    const filename = searchParams.get('filename');

    if (!mediaUrl) {
      return NextResponse.json({ error: "Parameter 'mediaUrl' wajib" }, { status: 400 });
    }

    let targetUrl: string;
    
    // Check if mediaUrl is already a proxied URL from our own API
    if (mediaUrl.startsWith('/api/twitter/proxy')) {
      // Extract the actual mediaUrl from the proxy URL
      const proxyUrl = new URL(mediaUrl, req.url);
      const actualMediaUrl = proxyUrl.searchParams.get('mediaUrl');
      if (!actualMediaUrl) {
        return NextResponse.json({ error: 'Invalid proxy URL' }, { status: 400 });
      }
      targetUrl = decodeURIComponent(actualMediaUrl);
    } else {
      targetUrl = decodeURIComponent(mediaUrl);
    }

    let target: URL;
    try {
      target = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: 'mediaUrl tidak valid' }, { status: 400 });
    }

    // Validasi host yang diizinkan
    if (!ALLOWED_HOSTS.has(target.hostname)) {
      return NextResponse.json(
        { error: `Host tidak diizinkan: ${target.hostname}` },
        { status: 400 }
      );
    }

    // Fetch media dari Twitter
    const upstream = await fetch(target.toString(), {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'referer': 'https://x.com/',
        'accept': '*/*',
      },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Gagal mengunduh media', status: upstream.status },
        { status: upstream.status }
      );
    }

    // Tentukan nama file dan content type
  let finalFilename = 'twitter_media';
  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    
    if (filename) {
      finalFilename = sanitizeFilename(filename);
    } else {
      // Ekstrak dari URL jika tidak ada filename
      const urlPath = target.pathname;
      const match = urlPath.match(/([^\/]+)$/);
      if (match) {
        finalFilename = sanitizeFilename(match[1]);
      }
    }

    // Tambahkan ekstensi berdasarkan content type jika belum ada
    if (!finalFilename.includes('.')) {
      if (contentType.includes('image/jpeg')) finalFilename += '.jpg';
      else if (contentType.includes('image/png')) finalFilename += '.png';
      else if (contentType.includes('video/mp4')) finalFilename += '.mp4';
      else if (contentType.includes('image/gif')) finalFilename += '.gif';
    }

    // Buat response dengan header download
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${finalFilename}"`);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=3600');
    
    // Copy content-length jika ada
    const contentLength = upstream.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });

  } catch (err: any) {
    console.error('Twitter download error:', err);
    return NextResponse.json(
      { error: 'Internal error', message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
