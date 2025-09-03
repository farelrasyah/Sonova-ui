// sonova/src/lib/youtube-utils.ts

import type { YouTubeVideoDetails, DownloadStream } from '@/types/youtube';

export const VIDEO_QUALITY_ORDER: string[] = [
  '144', '240', '360', '480', '720', '1080', '1440', '4k', '8k',
];

export const AUDIO_BITRATES = [128, 192, 320];

function formatNumber(n?: number) {
  if (n === undefined || n === null) return '—';
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n);
}
function formatDuration(totalSec?: number) {
  if (totalSec === undefined || totalSec === null) return '—';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (x: number) => x.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** API util minimal agar kompatibel dengan komponen lama */
export const YouTubeUtils = { formatNumber, formatDuration };

export const YouTubeApiUtils = {
  format: { formatNumber, formatDuration },

  extractVideoId(input: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /^[a-zA-Z0-9_-]{11}$/,
    ];
    for (const re of patterns) {
      const m = input.match(re);
      if (m) return (m[1] || m[0]).substring(0, 11);
    }
    return null;
  },

  toWatchUrl(idOrUrl: string): string {
    const id = this.extractVideoId(idOrUrl);
    return id ? `https://www.youtube.com/watch?v=${id}` : idOrUrl;
  },

  toQualityLabel(code: string) {
    if (code === '4k' || code === '8k') return code.toUpperCase();
    if (/\d+$/.test(code)) return `${code}p`;
    return code;
  },

  /** OEmbed untuk preview cepat (tanpa API key) */
  async fetchOEmbed(urlOrId: string) {
    const url = this.toWatchUrl(urlOrId);
    const api = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`oEmbed error ${res.status}`);
    return res.json() as Promise<{
      title: string;
      author_name: string;
      author_url: string;
      thumbnail_url: string;
    }>;
  },

  normalizeDetails(idOrUrl: string, oembed: any): YouTubeVideoDetails {
    const id = this.extractVideoId(idOrUrl) || '';
    return {
      id,
      title: oembed?.title ?? 'Untitled',
      thumbnail: oembed?.thumbnail_url ?? '',
      channel: {
        name: oembed?.author_name ?? 'Channel',
        verified: undefined,
        thumbnail: undefined,
      },
      stats: { views: undefined, likes: undefined, comments: undefined },
      duration: undefined,
      description: undefined,
    };
  },

  /** Ekstrak semua videoId dari halaman playlist (tanpa API key) */
  async extractPlaylistVideoIds(playlistUrl: string): Promise<string[]> {
    const html = await (await fetch(playlistUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
    const re = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    const ids = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) ids.add(m[1]);
    return Array.from(ids);
  },

  stream: {
    getQualityPriority(quality: string): number {
      const index = VIDEO_QUALITY_ORDER.indexOf(quality);
      return index === -1 ? 999 : index;
    },

    sortStreams(streams: DownloadStream[]): DownloadStream[] {
      return [...streams].sort((a, b) => {
        const aPriority = this.getQualityPriority(a.quality);
        const bPriority = this.getQualityPriority(b.quality);
        return aPriority - bPriority;
      });
    },

    getBestStream(streams: DownloadStream[], type: 'video' | 'audio'): DownloadStream | null {
      const filtered = streams.filter(stream => {
        if (type === 'video') {
          return stream.hasVideo;
        } else {
          return stream.hasAudio && !stream.hasVideo;
        }
      });

      if (filtered.length === 0) return null;

      // Sort by quality priority and return the best one
      const sorted = this.sortStreams(filtered);
      return sorted[0];
    }
  }
};
