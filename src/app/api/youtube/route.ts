import { NextRequest, NextResponse } from 'next/server';
import YouTubeService from '@/services/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    const action = searchParams.get('action') || 'details';
    const format = (searchParams.get('format') || 'all') as 'video' | 'audio' | 'all';
    const geo = searchParams.get('geo') || undefined;
    const lang = searchParams.get('lang') || undefined;

    if (!url) {
      return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
    }

    console.info('[YouTube API] Processing request', {
      url: url.length > 120 ? url.slice(0, 120) + '…' : url,
      action,
      format,
    });

    const svc = new YouTubeService();

    if (action === 'details') {
      const video = await svc.getVideoDetails(url);
      console.info('[YouTube API] ✅ details', { id: video.id, title: (video.title || '').slice(0, 60) + '…' });
      return NextResponse.json({ success: true, data: video });
    }

    if (action === 'streams') {
      const streams = await svc.getDownloadStreams(url, geo, lang);

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

      let filtered = [...sortedVideo, ...sortedAudio];
      if (format === 'video') filtered = sortedVideo;
      if (format === 'audio') filtered = sortedAudio;

      console.info('[YouTube API] ✅ streams', {
        video: sortedVideo.length,
        audio: sortedAudio.length,
        filtered: filtered.length,
      });

      return NextResponse.json({
        success: true,
        data: {
          videoFormats: sortedVideo,
          audioFormats: sortedAudio,
          filteredStreams: filtered,
          summary: {
            total: filtered.length,
            video: sortedVideo.length,
            audio: sortedAudio.length,
            qualities: [...new Set(filtered.map(s => s.quality))],
            formats: [...new Set(filtered.map(s => s.format))],
          },
        },
      });
    }

    if (action === 'all') {
      const [video, streams] = await Promise.all([
        svc.getVideoDetails(url),
        svc.getDownloadStreams(url, geo, lang),
      ]);
      const combined = [...streams.videoFormats, ...streams.audioFormats];

      return NextResponse.json({
        success: true,
        data: {
          video,
          videoFormats: streams.videoFormats,
          audioFormats: streams.audioFormats,
          summary: {
            total: combined.length,
            video: streams.videoFormats.length,
            audio: streams.audioFormats.length,
            qualities: [...new Set(combined.map(s => s.quality))],
            formats: [...new Set(combined.map(s => s.format))],
          },
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action. Use: details | streams | all' }, { status: 400 });
  } catch (error: any) {
    console.error('[YouTube API] Error:', error);

    const msg = String(error?.message || '');
    if (/Invalid YouTube video URL/i.test(msg)) {
      return NextResponse.json({ error: 'Invalid YouTube video URL format' }, { status: 400 });
    }
    if (/RAPIDAPI_KEY/i.test(msg)) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    if (/HTTP 429/.test(msg)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    if (/HTTP 403/.test(msg)) {
      return NextResponse.json({ error: 'Access forbidden. Please check API permissions.' }, { status: 403 });
    }
    if (/HTTP 404|not found/i.test(msg)) {
      return NextResponse.json({ error: 'Video not found or unavailable' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to process YouTube request. Please try again.' }, { status: 500 });
  }
}
