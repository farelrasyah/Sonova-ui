import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tiktokUrl = searchParams.get('url');

  if (!tiktokUrl) {
    console.error('[TikTok API] Missing TikTok URL parameter');
    return NextResponse.json({ error: 'Missing TikTok URL parameter' }, { status: 400 });
  }

  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`;
    const response = await fetch(apiUrl, {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[TikTok API] TikWM API response not ok:', response.status, response.statusText);
      return NextResponse.json({ error: 'TikWM API request failed' }, { status: response.status });
    }

    const json = await response.json();
    if (json.code !== 0 || !json.data) {
      console.error('[TikTok API] TikWM API error:', json);
      return NextResponse.json({ error: json.msg || 'TikWM API request failed' }, { status: 502 });
    }

    const { hdplay, play, music, title, cover, duration } = json.data;
    return NextResponse.json({
      title: title || '',
      videoUrl: hdplay || play || '',
      audioUrl: music || '',
      cover: cover || '',
      duration: duration || 0,
    });
  } catch (e) {
    console.error('[TikTok API] Exception:', e);
    return NextResponse.json({ error: 'TikWM API request failed' }, { status: 500 });
  }
}
