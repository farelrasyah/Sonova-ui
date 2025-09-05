import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';
import ytdl from 'ytdl-core';

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return Response.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Extract video ID from URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return Response.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    let transcriptText = '';
    let videoInfo = null;

    // Try to get transcript first
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      transcriptText = transcript.map(item => item.text).join(' ');
    } catch (transcriptError) {
      console.log('Transcript not available, trying to get video info instead');
    }

    // If no transcript, get video metadata
    if (!transcriptText.trim()) {
      try {
        // Use different approach to get video info
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        // Try to get basic info first
        if (ytdl.validateURL(videoUrl)) {
          videoInfo = await ytdl.getBasicInfo(videoUrl);
          const { title, description } = videoInfo.videoDetails;
          
          if (description && description.trim()) {
            transcriptText = `Video Title: ${title}\n\nVideo Description: ${description}`;
          } else {
            transcriptText = `Video Title: ${title}\n\nThis video doesn't have a detailed description available, but based on the title, this appears to be about: ${title}`;
          }
        } else {
          throw new Error('Invalid video URL');
        }
      } catch (videoError) {
        console.error('Video info fetch error:', videoError);
        
        // Final fallback - create summary from URL/ID
        transcriptText = `This is a YouTube video with ID: ${videoId}. While we couldn't access the full video details, this appears to be a video that may contain educational, entertainment, or informational content. Please note that we couldn't retrieve specific details about this video's content.`;
      }
    }

    if (!transcriptText.trim()) {
      // This should rarely happen now with our fallbacks
      transcriptText = `Unable to retrieve specific content for this YouTube video. However, this appears to be a valid YouTube video that may contain valuable information.`;
    }

    // Generate summary using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Generate multiple summary formats
    const briefPrompt = `Please provide a BRIEF summary (2-3 sentences) of the following YouTube video content:

Content: ${transcriptText}

Brief Summary:`;

    const detailedPrompt = `Please provide a DETAILED summary of the following YouTube video content. Include main topics, key points, important insights, and actionable takeaways:

Content: ${transcriptText}

Detailed Summary:`;

    const bulletPrompt = `Please extract the KEY POINTS from the following YouTube video content in bullet point format:

Content: ${transcriptText}

Key Points:`;

    // Generate all three summaries in parallel
    const [briefResult, detailedResult, bulletResult] = await Promise.all([
      model.generateContent(briefPrompt),
      model.generateContent(detailedPrompt),
      model.generateContent(bulletPrompt)
    ]);

    const summaries = {
      brief: briefResult.response.text(),
      detailed: detailedResult.response.text(),
      keyPoints: bulletResult.response.text()
    };

    return Response.json({ summaries });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
