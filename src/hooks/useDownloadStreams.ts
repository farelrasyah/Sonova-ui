'use client';

import { useState, useCallback } from 'react';

interface VideoStream {
  quality: string;
  format: string;
  url: string;
  size?: string;
  fps?: number;
  codec?: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
}

interface DownloadStreamsData {
  videoId: string;
  videoFormats: VideoStream[];
  audioFormats: VideoStream[];
  previewStream: VideoStream | null;
  summary: {
    totalVideo: number;
    totalAudio: number;
    availableQualities: string[];
    availableFormats: string[];
    hasPreview: boolean;
  };
}

interface UseDownloadStreamsReturn {
  loading: boolean;
  error: string | null;
  data: DownloadStreamsData | null;
  getDownloadStreams: (videoId: string, geo?: string, lang?: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useDownloadStreams(): UseDownloadStreamsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DownloadStreamsData | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  const getDownloadStreams = useCallback(async (videoId: string, geo?: string, lang?: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useDownloadStreams] Start:', { videoId, geo, lang });

      if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        throw new Error('Invalid video ID format. Must be 11 characters long.');
      }

      const params = new URLSearchParams({ id: videoId });
      if (geo) params.set('geo', geo);
      if (lang) params.set('lang', lang);

      const res = await fetch(`/api/youtube/download?${params.toString()}`);
      const json = await res.json();

      console.log('[useDownloadStreams] Status:', res.status);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || `HTTP ${res.status} ${res.statusText}`);
      }

      setData(json.data);
      console.log('[useDownloadStreams] ✅ OK', {
        videos: json.data?.videoFormats?.length || 0,
        audios: json.data?.audioFormats?.length || 0,
        preview: json.data?.previewStream ? 'yes' : 'no',
      });
    } catch (e: any) {
      console.error('[useDownloadStreams] ❌', e);
      setError(e?.message || 'Failed to fetch download streams');
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, getDownloadStreams, clearError, reset };
}
