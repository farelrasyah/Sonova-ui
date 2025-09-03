// sonova/src/app/api/youtube/proxy/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get('fileUrl') || searchParams.get('mediaUrl');
    if (!fileUrl) return NextResponse.json({ error: 'Missing fileUrl' }, { status: 400 });

    const range = (req.headers as any).get?.('range') || undefined;

    const res = await fetch(fileUrl, {
      headers: range ? { Range: range } : undefined,
      cache: 'no-store',
    });

    const headers = new Headers();
    // salin header penting untuk video/audio
    for (const [k, v] of res.headers.entries()) {
      if (['content-type', 'content-length', 'content-range', 'accept-ranges'].includes(k.toLowerCase())) {
        headers.set(k, v);
      }
    }
    return new Response(res.body, { status: res.status, headers });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Proxy failed' }, { status: 500 });
  }
}
