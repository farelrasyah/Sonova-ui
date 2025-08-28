import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function sanitizeFilename(name: string) {
  return name.replace(/[^a-z0-9_.-]/gi, '_').slice(0, 200);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get('mediaUrl');
    const filenameRaw = searchParams.get('filename') || 'download';

    if (!mediaUrl) {
      return NextResponse.json({ error: 'Missing mediaUrl' }, { status: 400 });
    }

    // basic validation
    if (!mediaUrl.startsWith('https://')) {
      return NextResponse.json({ error: 'mediaUrl must be https' }, { status: 400 });
    }

    const filename = sanitizeFilename(filenameRaw);

    const upstream = await fetch(mediaUrl, { method: 'GET', cache: 'no-store' });
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '');
      return NextResponse.json({ error: 'Upstream fetch failed', status: upstream.status, body: text }, { status: 502 });
    }

    // copy content-type if present
    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    // security: prevent caching of proxied media
    headers.set('Cache-Control', 'no-store');

    // stream upstream body directly
    const body = upstream.body;
    return new NextResponse(body, { status: 200, headers });
  } catch (err) {
    console.error('[api/instagram/download] Unexpected error', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
