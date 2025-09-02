import { NextRequest, NextResponse } from 'next/server';
import YouTubeService from '@/services/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('id');
    const geo = searchParams.get('geo') || undefined;
    const lang = searchParams.get('lang') || undefined;

    if (!videoId) {
      return NextResponse.json({ error: 'Missing video ID parameter' }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return NextResponse.json({ error: 'Invalid video ID format. Must be 11 characters.' }, { status: 400 });
    }

    console.info('[YouTube Download API] Processing', { videoId, geo, lang });
    const svc = new YouTubeService();
    const streams = await svc.getDownloadStreams(videoId, geo, lang);

    const qualityOrder = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
    const sortedVideo = [...streams.videoFormats].sort((a, b) => {
      const ai = qualityOrder.indexOf(a.quality);
      const bi = qualityOrder.indexOf(b.quality);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    const sortedAudio = [...streams.audioFormats].sort((a, b) => {
      const ak = parseInt(a.quality.match(/\d+/)?.[0] || '0', 10);
      const bk = parseInt(b.quality.match(/\d+/)?.[0] || '0', 10);
      return bk - ak;
    });

    const preview =
      sortedVideo.find(v => v.quality === '720p' && v.format === 'mp4') ||
      sortedVideo.find(v => v.format === 'mp4') ||
      sortedVideo[0] ||
      null;

    console.info('[YouTube Download API] ✅', {
      video: sortedVideo.length,
      audio: sortedAudio.length,
      preview: preview ? `${preview.quality}/${preview.format}` : 'none',
    });

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        videoFormats: sortedVideo,
        audioFormats: sortedAudio,
        previewStream: preview,
        summary: {
          totalVideo: sortedVideo.length,
          totalAudio: sortedAudio.length,
          availableQualities: [...new Set(sortedVideo.map(s => s.quality))],
          availableFormats: [...new Set(sortedVideo.map(s => s.format))],
          hasPreview: Boolean(preview),
        },
      },
    });
  } catch (error: any) {
    console.error('[YouTube Download API] Error:', error);
    const msg = String(error?.message || '');
    if (/Invalid YouTube video URL|Invalid video ID/.test(msg)) {
      return NextResponse.json({ error: 'Invalid video ID provided' }, { status: 400 });
    }
    if (/RAPIDAPI_KEY/.test(msg)) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    if (/HTTP 404|not found/i.test(msg)) {
      return NextResponse.json({ error: 'Video not found or private' }, { status: 404 });
    }
    if (/HTTP 429/.test(msg)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try later.' }, { status: 429 });
    }
    if (/HTTP 403/.test(msg)) {
      return NextResponse.json({ error: 'Access forbidden / region-locked' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch download streams.' }, { status: 500 });
  }
}
