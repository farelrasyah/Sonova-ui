// sonova/src/types/youtube.ts

export type QualityCode =
  | '144' | '240' | '360' | '480' | '720' | '1080' | '1440' | '4k' | '8k'
  | 'mp3';

export interface DownloadStream {
  quality: string;
  format: 'mp4' | 'mp3';
  url: string;
  size?: string;
  fps?: number;
  codec?: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
}

export interface StreamsResponse {
  videoId: string;
  previewStream?: DownloadStream | null;
  videoFormats: DownloadStream[];
  audioFormats: DownloadStream[];
  title?: string;
  thumbnail?: string;
}

export interface YouTubeChannelLite {
  name: string;
  thumbnail?: string;
  verified?: boolean;
}
export interface YouTubeStatsLite {
  views?: number;
  likes?: number;
  comments?: number;
}

export interface YouTubeVideoDetails {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration?: number;
  channel: YouTubeChannelLite;
  stats: YouTubeStatsLite;
}

/** Input actor youtubemasters/youtube-downloader-stable */
export interface YMInput {
  targetUrl: string;
  format: string;
  add_info?: boolean;
  audio_quality?: number;
  no_merge?: boolean;
  start_time?: number;
  end_time?: number;
}

/** Item awal dari actor (berisi id job), beberapa build menaruhnya di responseData */
export interface YMStartItem {
  responseData?: {
    success?: boolean;
    id?: string;
    content?: string;
    info?: { image?: string; title?: string };
    message?: string;
  };
  id?: string;
  success?: boolean;
  info?: { image?: string; title?: string };
  message?: string;
  error?: string;
}

/** Respons progress API */
export interface YMProgress {
  success: number;
  progress: number;           // 0..1000
  download_url?: string;
  text?: string;
  message?: string;
}
