// sonova/src/services/youtube.ts

import { YouTubeApiUtils, VIDEO_QUALITY_ORDER, AUDIO_BITRATES } from '@/lib/youtube-utils';
import type {
  YMInput, YMStartItem, YMProgress,
  StreamsResponse, DownloadStream, YouTubeVideoDetails
} from '@/types/youtube';

const ACTOR_ID = 'youtubemasters~youtube-downloader-stable';
const APIFY_TOKEN = process.env.APIFY_TOKEN;
const RUN_URL = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
const PROGRESS_BASE = 'https://p.oceansaver.in/ajax/progress?id=';

function assertToken() {
  if (!APIFY_TOKEN) throw new Error('APIFY_TOKEN is missing in environment.');
}

/** Memanggil actor dan mengambil item pertama (yang berisi job id). */
async function startActor(input: YMInput): Promise<YMStartItem> {
  assertToken();

  // Kirim hanya field yang perlu sesuai dok
  const payload: YMInput = {
    targetUrl: input.targetUrl,
    format: input.format,
    add_info: input.add_info ?? true,
    audio_quality: input.audio_quality,
    no_merge: input.no_merge,
    start_time: input.start_time,
    end_time: input.end_time,
  };

  const res = await fetch(RUN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    // biarkan serverless mengelola timeout; bisa tambah AbortController jika mau
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify run failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  const item: YMStartItem = Array.isArray(json) ? json[0] : json;
  return item;
}

/** Polling progress API hingga dapat download_url atau timeout. */
async function pollProgress(jobId: string, timeoutMs = 60_000, intervalMs = 1200): Promise<YMProgress> {
  const deadline = Date.now() + timeoutMs;

  let last: YMProgress | null = null;
  while (Date.now() < deadline) {
    const res = await fetch(`${PROGRESS_BASE}${encodeURIComponent(jobId)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = (await res.json()) as YMProgress;
      last = data;
      if (data.download_url && data.progress >= 1000) return data;
      // beberapa server mengembalikan 1000 lebih dulu baru siap; beri 1 iterasi ekstra
      if (data.progress >= 1000 && data.download_url) return data;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  if (last) throw new Error(`Timeout waiting download_url (progress=${last.progress}, text=${last.text})`);
  throw new Error('Timeout waiting download_url');
}

/** High-level: minta satu file (video/audio) → download_url */
export async function getDirectDownloadUrl(
  urlOrId: string,
  format: string,            // '720' | '4k' | 'mp3' | ...
  opts?: { audioQuality?: number; startTime?: number; endTime?: number; }
): Promise<string> {
  const targetUrl = YouTubeApiUtils.toWatchUrl(urlOrId);
  const start = await startActor({
    targetUrl,
    format,
    add_info: true,
    audio_quality: opts?.audioQuality,
    start_time: opts?.startTime,
    end_time: opts?.endTime,
  });

  const jobId =
    start?.responseData?.id ||
    (typeof (start as any).id === 'string' ? (start as any).id : undefined);

  if (!jobId) {
    throw new Error('Actor did not return job id');
  }

  const progress = await pollProgress(jobId);
  if (!progress.download_url) throw new Error('No download_url in progress response');
  return progress.download_url;
}

/** Ambil detail video via oEmbed */
export async function getVideoDetails(urlOrId: string): Promise<YouTubeVideoDetails> {
  const oembed = await YouTubeApiUtils.fetchOEmbed(urlOrId);
  return YouTubeApiUtils.normalizeDetails(urlOrId, oembed);
}

/** Build preview + daftar opsi download */
export async function getVideoPreviewAndStreams(urlOrId: string): Promise<StreamsResponse> {
  const details = await getVideoDetails(urlOrId);
  const watchUrl = YouTubeApiUtils.toWatchUrl(urlOrId);

  // Preview: coba ambil 360p agar cepat
  let preview: DownloadStream | null = null;
  try {
    const direct = await getDirectDownloadUrl(watchUrl, '360');
    preview = {
      quality: '360p',
      format: 'mp4',
      url: direct, // direct URL dari oceansaver
      hasAudio: true,
      hasVideo: true,
    };
  } catch {
    preview = null; // preview opsional, jika gagal tetap lanjut
  }

  const videoFormats: DownloadStream[] = VIDEO_QUALITY_ORDER
    .filter((q) => q !== 'mp3')
    .map((q) => ({
      quality: YouTubeApiUtils.toQualityLabel(q),
      format: 'mp4',
      url: `/api/youtube/download?url=${encodeURIComponent(watchUrl)}&format=${encodeURIComponent(q)}`,
      hasAudio: true,
      hasVideo: true,
    }));

  const audioFormats: DownloadStream[] = AUDIO_BITRATES.map((br) => ({
    quality: `MP3 ${br}kbps`,
    format: 'mp3',
    url: `/api/youtube/download?url=${encodeURIComponent(watchUrl)}&format=mp3&audioQuality=${br}`,
    hasAudio: true,
    hasVideo: false,
  }));

  return {
    videoId: details.id,
    previewStream: preview,
    videoFormats,
    audioFormats,
    title: details.title,
    thumbnail: details.thumbnail,
  };
}

/** Playlist: expand ke list video + siapkan opsi endpoint download per item */
export async function buildPlaylistPlan(playlistUrl: string) {
  const ids = await YouTubeApiUtils.extractPlaylistVideoIds(playlistUrl);
  if (!ids.length) throw new Error('Tidak menemukan video di playlist');

  // Batasi concurrency supaya aman (3)
  const results: Array<{
    id: string;
    watchUrl: string;
    title: string;
    thumbnail: string;
    videoFormats: DownloadStream[];
    audioFormats: DownloadStream[];
  }> = [];

  for (const id of ids) {
    const watchUrl = YouTubeApiUtils.toWatchUrl(id);
    // metadata minimal via oembed (biar tidak start job)
    let title = `Video ${id}`;
    let thumbnail = '';
    try {
      const o = await YouTubeApiUtils.fetchOEmbed(watchUrl);
      title = o.title || title;
      thumbnail = o.thumbnail_url || '';
    } catch {
      // abaikan
    }

    const videoFormats: DownloadStream[] = VIDEO_QUALITY_ORDER
      .filter((q) => q !== 'mp3')
      .map((q) => ({
        quality: YouTubeApiUtils.toQualityLabel(q),
        format: 'mp4',
        url: `/api/youtube/download?url=${encodeURIComponent(watchUrl)}&format=${encodeURIComponent(q)}`,
        hasAudio: true,
        hasVideo: true,
      }));
    const audioFormats: DownloadStream[] = AUDIO_BITRATES.map((br) => ({
      quality: `MP3 ${br}kbps`,
      format: 'mp3',
      url: `/api/youtube/download?url=${encodeURIComponent(watchUrl)}&format=mp3&audioQuality=${br}`,
      hasAudio: true,
      hasVideo: false,
    }));

    results.push({ id, watchUrl, title, thumbnail, videoFormats, audioFormats });
  }

  return { count: results.length, items: results };
}
