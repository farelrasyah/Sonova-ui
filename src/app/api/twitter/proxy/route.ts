// sonova/src/app/api/twitter/proxy/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Allow-Headers': 'Range, Content-Type, User-Agent, Referer',
};

function normalizeUrl(u?: string | null) {
  if (!u) return undefined;
  if (u.startsWith('//')) return 'https:' + u;
  if (u.startsWith('http://')) return u.replace(/^http:/, 'https:');
  if (!/^https?:\/\//i.test(u)) return 'https://' + u;
  return u;
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUrl = searchParams.get('mediaUrl') || searchParams.get('url');
    const mediaUrl = normalizeUrl(rawUrl);

    if (!mediaUrl || !mediaUrl.startsWith('https://')) {
      return json({ error: 'mediaUrl must be https' }, 400);
    }

    const wantDownload = searchParams.get('download') === '1' || searchParams.get('download') === 'true';
    const fileName = (searchParams.get('filename') || 'twitter-video.mp4').replace(/[^\w.\-()\[\] ]+/g, '_');

    // Forward Range for seeking
    const range = req.headers.get('range') || undefined;

    const upstream = await fetch(mediaUrl, {
      method: 'GET',
      headers: {
        ...(range ? { Range: range } : {}),
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://x.com/',
      },
      redirect: 'follow',
    });

    if (!upstream.ok && upstream.status !== 206) {
      const bodyText = await safeText(upstream);
      return json({ error: 'Upstream fetch failed', status: upstream.status, message: bodyText }, 502);
    }

    // Build response headers
    const h = new Headers(CORS);
    const ct = upstream.headers.get('content-type') || 'application/octet-stream';
    const cl = upstream.headers.get('content-length');
    const cr = upstream.headers.get('content-range');
    const ar = upstream.headers.get('accept-ranges') || 'bytes';
    const cc = upstream.headers.get('cache-control') || 'public, max-age=31536000, immutable';

    h.set('Content-Type', ct);
    if (cl) h.set('Content-Length', cl);
    if (cr) h.set('Content-Range', cr);
    if (ar) h.set('Accept-Ranges', ar);
    if (cc) h.set('Cache-Control', cc);

    if (wantDownload) {
      h.set('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: h,
    });
  } catch (e: any) {
    return json({ error: 'Proxy error', message: e?.message || String(e) }, 500);
  }
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

async function safeText(res: Response) {
  try { return await res.text(); } catch { return ''; }
}
