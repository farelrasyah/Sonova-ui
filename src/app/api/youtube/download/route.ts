// sonova/src/app/api/youtube/download/route.ts
import { NextResponse } from 'next/server';
import { getDirectDownloadUrl } from '@/services/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function toBool(v: string | null): boolean {
  if (!v) return true; // default aktif
  return v === '1' || v === 'true' || v === 'yes';
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idOrUrl = searchParams.get('url') || searchParams.get('id');
    const format  = (searchParams.get('format') || '720').toLowerCase();
    const audioQuality = searchParams.get('audioQuality')
      ? parseInt(searchParams.get('audioQuality') as string, 10)
      : undefined;
    const fallback = toBool(searchParams.get('fallback'));

    if (!idOrUrl) {
      return NextResponse.json({ error: 'Missing url or id' }, { status: 400 });
    }

    const direct = await getDirectDownloadUrl(idOrUrl, format, { audioQuality, fallback });

    // Sukses → redirect ke file langsung
    return NextResponse.redirect(direct, 302);
  } catch (e: any) {
    // Kegagalan format/limit → 400 dengan pesan jelas (bukan 500)
    const msg = e?.message || 'Download failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
