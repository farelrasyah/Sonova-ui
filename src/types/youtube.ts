// sonova/src/types/youtube.ts

export type QualityCode =
  | '144' | '240' | '360' | '480' | '720' | '1080' | '1440' | '4k' | '8k'
  | 'mp3'; // untuk audio

export interface DownloadStream {
  quality: string;           // "720p" | "4K" | "MP3 128kbps"
  format: 'mp4' | 'mp3';
  url: string;               // endpoint internal /api/youtube/download?... (atau direct URL untuk preview)
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
  id: string;                  // 11-char video id
  title: string;
  description?: string;
  thumbnail: string;
  duration?: number;           // seconds (opsional)
  channel: YouTubeChannelLite;
  stats: YouTubeStatsLite;
}

/** === Actor input (youtubemasters/youtube-downloader-stable) === */
export interface YMInput {
  targetUrl: string;           // YouTube watch URL
  format: string;              // "720" | "4k" | "mp3" | ...
  add_info?: boolean;          // include info {title,image}
  audio_quality?: number;      // 128 | 192 | 320 ... (untuk mp3)
  no_merge?: boolean;
  start_time?: number;
  end_time?: number;
}

/** === Actor item output (dataset) ===
 *  contoh dari README actor:
 *  { "responseData": { "success": true, "id": "abcdef", "info": { "title": "...", "image": "..." } } }
 */
export interface YMStartItem {
  responseData?: {
    success?: boolean;
    id?: string;
    content?: string; // base64 html (diabaikan)
    info?: { image?: string; title?: string };
  };
  // fallback keys (kalau build berubah)
  id?: string;
  success?: boolean;
  info?: { image?: string; title?: string };
}

/** === Progress API response ===
 * GET https://p.oceansaver.in/ajax/progress?id=<ID>
 */
export interface YMProgress {
  success: number;         // 1 sukses, 0 gagal
  progress: number;        // 0..1000 (1000 = selesai)
  download_url?: string;   // muncul saat progress 1000
  text?: string;           // "Processing" | "Finished"
  message?: string;
}
