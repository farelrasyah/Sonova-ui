import { NextRequest, NextResponse } from 'next/server';
import YouTubeService from '@/services/youtube';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoUrl = searchParams.get('url');
    const format = searchParams.get('format'); // 'video', 'audio', or 'all'
    const quality = searchParams.get('quality'); // specific quality filter
    const geo = searchParams.get('geo') || undefined;
    const lang = searchParams.get('lang') || undefined;

    if (!videoUrl) {
      console.error('[YouTube Streams API] Missing video URL parameter');
      return NextResponse.json(
        { error: 'Missing video URL parameter' },
        { status: 400 }
      );
    }

    console.info('[YouTube Streams API] Processing request', {
      url: videoUrl.length > 100 ? videoUrl.substring(0, 100) + '...' : videoUrl,
      format: format || 'all',
      quality: quality || 'all',
      geo,
      lang,
    });

    const youtubeService = new YouTubeService();
    const downloadStreams = await youtubeService.getDownloadStreams(videoUrl, geo, lang);

    // Filter by format if specified
    let streams = downloadStreams.videoFormats.concat(downloadStreams.audioFormats);
    
    if (format === 'video') {
      streams = downloadStreams.videoFormats;
    } else if (format === 'audio') {
      streams = downloadStreams.audioFormats;
    }

    // Filter by quality if specified
    if (quality) {
      streams = streams.filter(stream => 
        stream.quality && stream.quality.toLowerCase().includes(quality.toLowerCase())
      );
    }

    console.info('[YouTube Streams API] Successfully retrieved streams', {
      totalStreams: streams.length,
      videoStreams: downloadStreams.videoFormats.length,
      audioStreams: downloadStreams.audioFormats.length,
    });

    return NextResponse.json({
      success: true,
      data: {
        videoFormats: downloadStreams.videoFormats,
        audioFormats: downloadStreams.audioFormats,
        filteredStreams: streams,
        summary: {
          total: streams.length,
          video: downloadStreams.videoFormats.length,
          audio: downloadStreams.audioFormats.length,
          qualities: [...new Set(streams.map(s => s.quality).filter(Boolean))],
          formats: [...new Set(streams.map(s => s.format).filter(Boolean))],
        }
      },
    });

  } catch (error: any) {
    console.error('[YouTube Streams API] Error:', error);

    // Handle specific error types
    if (error.message.includes('Invalid YouTube video URL')) {
      return NextResponse.json(
        { error: 'Invalid YouTube video URL format' },
        { status: 400 }
      );
    }

    if (error.message.includes('RAPIDAPI_KEY')) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (error.message.includes('HTTP 404') || error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Video not found. Please check if the video exists and is public.' },
        { status: 404 }
      );
    }

    if (error.message.includes('HTTP 429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.message.includes('HTTP 403')) {
      return NextResponse.json(
        { error: 'Access forbidden. Please check API permissions.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch download streams. Please try again.' },
      { status: 500 }
    );
  }
}
