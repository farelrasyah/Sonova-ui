import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get('mediaUrl');

    if (!mediaUrl) {
      return NextResponse.json({ error: 'Missing mediaUrl' }, { status: 400 });
    }

    // basic validation
    if (!/^https?:\/\//i.test(mediaUrl)) {
      return NextResponse.json({ error: 'Invalid mediaUrl' }, { status: 400 });
    }

    // Stream upstream media; providers may block some headers so we fetch server-side
    const upstream = await fetch(mediaUrl, { method: 'GET', cache: 'no-store' });
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return NextResponse.json({ error: 'Upstream fetch failed', status: upstream.status, body: text }, { status: 502 });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'no-store');

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (err) {
    console.error('[api/instagram/proxy] Unexpected error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
