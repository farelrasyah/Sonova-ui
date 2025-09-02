/* src/services/youtube.ts */

type RapidVideoDetailsRaw = any;
type RapidDownloadRaw = any;

export interface NormalizedVideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  channel: {
    name: string;
    id: string;
    thumbnail: string;
    verified: boolean;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  publishedAt: string;
  category: string;
  tags: string[];
}

export interface NormalizedStream {
  quality: string;
  format: string;
  url: string;
  size?: string;
  fps?: number;
  codec?: string;
  hasAudio: boolean;
  hasVideo: boolean;
}

export default class YouTubeService {
  private readonly base = `https://${process.env.RAPIDAPI_HOST || 'youtube-video-and-shorts-downloader.p.rapidapi.com'}`;
  private readonly key = process.env.RAPIDAPI_KEY;
  private readonly host = process.env.RAPIDAPI_HOST || 'youtube-video-and-shorts-downloader.p.rapidapi.com';

  constructor() {
    if (!this.key) {
      throw new Error('Missing RAPIDAPI_KEY in environment');
    }
  }

  private extractVideoId(input: string): string {
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const re = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const m = input.match(re);
    if (m?.[1]) return m[1];
    throw new Error('Invalid YouTube video URL');
  }

  private async makeRequest<T = any>(endpoint: string, params: Record<string, string | undefined> = {}): Promise<T> {
    const url = new URL(`${this.base}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });

    const compact = url.toString().replace(/(\?id=.{5}).+/, '$1...');
    console.log('Making request to:', compact);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-key': this.key!,
        'x-rapidapi-host': this.host,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} – ${text.slice(0, 300)}`);
    }
    return res.json() as Promise<T>;
  }

  // ============== DETAILS ==============
  public async getVideoDetails(input: string): Promise<NormalizedVideoDetails> {
    const id = this.extractVideoId(input);
    console.info('[YouTubeService] Getting video details for ID:', id);

    const raw: RapidVideoDetailsRaw = await this.makeRequest('/video.php', { id });

    const firstThumb =
      raw?.thumbnails?.[0]?.url ||
      raw?.videoThumbnails?.[0]?.url ||
      raw?.thumbnail?.url ||
      `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    const duration =
      Number(raw?.duration) ||
      Number(raw?.lengthSeconds) ||
      Number(raw?.stats?.duration) ||
      0;

    const channelName = raw?.author || raw?.channel?.name || raw?.uploader || '';
    const channelId = raw?.authorId || raw?.channel?.id || '';
    const channelThumb =
      raw?.authorThumbnails?.[0]?.url ||
      raw?.channel?.thumbnail ||
      '';
    const verified = Boolean(raw?.authorVerified || raw?.channel?.verified);

    const views = Number(raw?.viewCount || raw?.stats?.views || 0);
    const likes = Number(raw?.likeCount || raw?.stats?.likes || 0);
    const comments = Number(raw?.commentCount || raw?.stats?.comments || 0);

    const publishedAt = (() => {
      if (raw?.publishDate) return new Date(raw.publishDate).toISOString();
      if (raw?.published) {
        const ts = Number(raw.published);
        if (!Number.isNaN(ts)) return new Date(ts * (ts > 1e12 ? 1 : 1000)).toISOString();
      }
      return '';
    })();

    return {
      id: raw?.id || raw?.videoId || id,
      title: String(raw?.title || ''),
      description: String(raw?.description || ''),
      thumbnail: firstThumb,
      duration,
      channel: {
        name: channelName,
        id: channelId,
        thumbnail: channelThumb,
        verified,
      },
      stats: { views, likes, comments },
      publishedAt,
      category: String(raw?.genre || raw?.category || ''),
      tags: Array.isArray(raw?.keywords) ? raw.keywords : Array.isArray(raw?.tags) ? raw.tags : [],
    };
  }

  // ============== DOWNLOAD STREAMS ==============
  public async getDownloadStreams(input: string, geo?: string, lang?: string): Promise<{
    videoFormats: NormalizedStream[];
    audioFormats: NormalizedStream[];
  }> {
    const id = this.extractVideoId(input);
    console.info('[YouTubeService] Getting download streams for ID:', id);

    // Provider ini mengembalikan { status:'ok', results:[ ... ] }
    const raw: RapidDownloadRaw = await this.makeRequest('/download.php', { id, geo, lang });

    // Safety checks
    if (!raw || raw.status !== 'ok') {
      // Beberapa provider tetap return 200 meski kosong → anggap tidak ada stream.
      return { videoFormats: [], audioFormats: [] };
    }

    const results: any[] = Array.isArray(raw.results) ? raw.results : [];

    // Normalizer untuk item "results"
    const toNorm = (item: any): NormalizedStream | null => {
      const url = item?.url;
      if (!url) return null;

      const mime: string = item?.mime || item?.mimetype || '';
      const format = (() => {
        if (!mime) return 'mp4';
        const m = mime.split('/')[1];
        return (m || 'mp4').toLowerCase();
      })();

      const quality = String(item?.quality || '').trim() || (mime.includes('audio') ? (item?.bitrate ? `${item.bitrate}kbps` : 'audio') : 'unknown');

      const hasAudio = Boolean(item?.has_audio ?? /audio/i.test(mime));
      // Banyak response tidak punya has_video → infer dari mime/quality
      const hasVideo = Boolean(item?.has_video ?? (!/audio/i.test(mime) || /\d{3,4}p/i.test(quality)));

      return {
        quality,
        format,
        url,
        size: item?.size ? String(item.size) : undefined,
        fps: typeof item?.fps === 'number' ? item.fps : undefined,
        codec: item?.codec || item?.encoding || undefined,
        hasAudio,
        hasVideo,
      };
    };

    const normalized = results.map(toNorm).filter(Boolean) as NormalizedStream[];

    // Pisahkan video-only vs audio-only
    const videoFormats = normalized.filter(s => s.hasVideo);
    const audioFormats = normalized.filter(s => s.hasAudio && !s.hasVideo);

    return { videoFormats, audioFormats };
  }
}
