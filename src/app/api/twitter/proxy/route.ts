// sonova/src/app/api/twitter/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = new Set(['video.twimg.com', 'pbs.twimg.com']);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get('mediaUrl');

    if (!mediaUrl) {
      return NextResponse.json({ error: "Parameter 'mediaUrl' wajib" }, { status: 400 });
    }

    let target: URL;
    try {
      target = new URL(mediaUrl);
    } catch {
      return NextResponse.json({ error: 'mediaUrl tidak valid' }, { status: 400 });
    }

    if (!ALLOWED_HOSTS.has(target.hostname)) {
      return NextResponse.json(
        { error: `Host tidak diizinkan: ${target.hostname}` },
        { status: 400 }
      );
    }

    // Teruskan header Range agar video bisa seek
    const range = req.headers.get('range') || undefined;

    const upstream = await fetch(target.toString(), {
      headers: {
        ...(range ? { range } : {}),
        'user-agent': 'Mozilla/5.0',
        // Optional: referer kadang membantu
        'referer': 'https://x.com/',
      },
    });

    // Salin header dari upstream
    const headers = new Headers(upstream.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    // Hindari transfer-encoding tersangka
    headers.delete('transfer-encoding');

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Proxy error', message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
