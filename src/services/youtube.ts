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

// fallback berurutan dari kualitas diminta ke yang lebih rendah
const FALLBACK_MAP: Record<string, string[]> = {
  '8k':   ['4k', '1440', '1080', '720', '480', '360', '240', '144'],
  '4k':   ['1440', '1080', '720', '480', '360', '240', '144'],
  '1440': ['1080', '720', '480', '360', '240', '144'],
  '1080': ['720', '480', '360', '240', '144'],
  '720':  ['480', '360', '240', '144'],
  '480':  ['360', '240', '144'],
  '360':  ['240', '144'],
  '240':  ['144'],
};

async function startActor(input: YMInput): Promise<YMStartItem> {
  assertToken();

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
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify run failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const item: YMStartItem = Array.isArray(json) ? json[0] : json;
  return item;
}

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
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  if (last) throw new Error(`Timeout waiting download_url (progress=${last.progress}, text=${last.text || ''})`);
  throw new Error('Timeout waiting download_url');
}

/**
 * Minta direct download URL untuk format tertentu.
 * Jika fallback=true, coba kualitas lebih rendah saat format tidak tersedia.
 */
export async function getDirectDownloadUrl(
  urlOrId: string,
  format: string,                                   // '720' | '4k' | 'mp3' | ...
  opts?: { audioQuality?: number; startTime?: number; endTime?: number; fallback?: boolean }
): Promise<string> {
  const targetUrl = YouTubeApiUtils.toWatchUrl(urlOrId);

  const candidates: string[] =
    format === 'mp3'
      ? ['mp3'] // audio tidak butuh fallback kualitas video
      : [format, ...(FALLBACK_MAP[format] ?? [])];

  const useFallback = opts?.fallback !== false; // default true

  for (const fmt of candidates) {
    // jika tidak fallback dan ini bukan format pertama → break
    if (!useFallback && fmt !== format) break;

    const start = await startActor({
      targetUrl,
      format: fmt,
      add_info: true,
      audio_quality: opts?.audioQuality,
      start_time: opts?.startTime,
      end_time: opts?.endTime as any, // guard TS when not provided
    }).catch((e) => {
      // Jika gagal start (bad request karena format tak tersedia), coba next candidate
      return null as any;
    });

    const jobId =
      start?.responseData?.id ||
      (typeof start?.id === 'string' ? start.id : undefined);

    // Kalau actor bilang gagal/format tidak didukung, lanjut ke kandidat berikut
    const successFlag = start?.responseData?.success ?? start?.success;
    if (!jobId || successFlag === false) {
      if (!useFallback) break;
      continue;
    }

    try {
      const progress = await pollProgress(jobId);
      if (progress.download_url) return progress.download_url;
    } catch {
      if (!useFallback) break;
      continue;
    }
  }

  // Tidak ada kandidat yang berhasil
  const label = YouTubeApiUtils.toQualityLabel(format);
  throw new Error(`Format '${label}' tidak tersedia untuk video ini atau melampaui batas durasi/kapasitas. Coba kualitas lebih rendah.`);
}

export async function getVideoDetails(urlOrId: string): Promise<YouTubeVideoDetails> {
  const oembed = await YouTubeApiUtils.fetchOEmbed(urlOrId);
  return YouTubeApiUtils.normalizeDetails(urlOrId, oembed);
}

export async function getVideoPreviewAndStreams(urlOrId: string): Promise<StreamsResponse> {
  const details = await getVideoDetails(urlOrId);
  const watchUrl = YouTubeApiUtils.toWatchUrl(urlOrId);

  // Preview cepat (360p) — opsional, bila gagal tetap lanjut
  let preview: DownloadStream | null = null;
  try {
    const direct = await getDirectDownloadUrl(watchUrl, '360', { fallback: true });
    preview = { quality: '360p', format: 'mp4', url: direct, hasAudio: true, hasVideo: true };
  } catch { preview = null; }

  const videoFormats: DownloadStream[] = VIDEO_QUALITY_ORDER
    .filter((q) => q !== 'mp3')
    .map((q) => ({
      quality: YouTubeApiUtils.toQualityLabel(q),
      format: 'mp4',
      url: `/api/youtube/download?url=${encodeURIComponent(watchUrl)}&format=${encodeURIComponent(q)}&fallback=1`,
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

export async function buildPlaylistPlan(playlistUrl: string) {
  const ids = await YouTubeApiUtils.extractPlaylistVideoIds(playlistUrl);
  if (!ids.length) throw new Error('Tidak menemukan video di playlist');

  const items: Array<{
    id: string;
    watchUrl: string;
    title: string;
    thumbnail: string;
    videoFormats: DownloadStream[];
    audioFormats: DownloadStream[];
  }> = [];

  for (const id of ids) {
    const watchUrl = YouTubeApiUtils.toWatchUrl(id);
    let title = `Video ${id}`, thumbnail = '';
    try {
      const o = await YouTubeApiUtils.fetchOEmbed(watchUrl);
      title = o.title || title; thumbnail = o.thumbnail_url || '';
    } catch {}

    const videoFormats: DownloadStream[] = VIDEO_QUALITY_ORDER
      .filter((q) => q !== 'mp3')
      .map((q) => ({
        quality: YouTubeApiUtils.toQualityLabel(q),
        format: 'mp4',
        url: `/api/youtube/download?url=${encodeURIComponent(watchUrl)}&format=${encodeURIComponent(q)}&fallback=1`,
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

    items.push({ id, watchUrl, title, thumbnail, videoFormats, audioFormats });
  }

  return { count: items.length, items };
}
