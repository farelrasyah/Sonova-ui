// sonova/src/app/api/youtube/streams/route.ts
import { NextResponse } from 'next/server';
import { getVideoPreviewAndStreams } from '@/services/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url') || searchParams.get('id');
    if (!url) return NextResponse.json({ error: 'Missing url or id' }, { status: 400 });

    const data = await getVideoPreviewAndStreams(url);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to build streams' }, { status: 500 });
  }
}
