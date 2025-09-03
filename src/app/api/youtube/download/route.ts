// sonova/src/app/api/youtube/download/route.ts
import { NextResponse } from 'next/server';
import { getDirectDownloadUrl } from '@/services/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idOrUrl = searchParams.get('url') || searchParams.get('id');
    const format  = (searchParams.get('format') || '720').toLowerCase();
    const audioQuality = searchParams.get('audioQuality')
      ? parseInt(searchParams.get('audioQuality') as string, 10)
      : undefined;

    if (!idOrUrl) return NextResponse.json({ error: 'Missing url or id' }, { status: 400 });

    const direct = await getDirectDownloadUrl(idOrUrl, format, { audioQuality });

    // Redirect 302 ke URL file sehingga browser langsung mengunduh
    return NextResponse.redirect(direct, 302);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Download failed' }, { status: 500 });
  }
}
