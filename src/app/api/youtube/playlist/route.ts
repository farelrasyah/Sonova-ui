// sonova/src/app/api/youtube/playlist/route.ts
import { NextResponse } from 'next/server';
import { buildPlaylistPlan } from '@/services/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) return NextResponse.json({ error: 'Missing playlist url' }, { status: 400 });

    const plan = await buildPlaylistPlan(url);
    return NextResponse.json(plan, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Playlist build failed' }, { status: 500 });
  }
}
