// sonova/src/app/api/youtube/route.ts
import { NextResponse } from 'next/server';
import { getVideoDetails } from '@/services/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    const details = await getVideoDetails(url);
    return NextResponse.json(details, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch details' }, { status: 500 });
  }
}
