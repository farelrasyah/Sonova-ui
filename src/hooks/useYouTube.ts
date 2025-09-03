// sonova/src/hooks/useYouTube.ts
'use client';

import { useCallback, useState } from 'react';
import type { YouTubeVideoDetails } from '@/types/youtube';

export function useYouTube() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<YouTubeVideoDetails | null>(null);

  const getVideoDetails = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setVideoDetails(null);
    try {
      const res = await fetch(`/api/youtube?url=${encodeURIComponent(url)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
      setVideoDetails(data as YouTubeVideoDetails);
      return data as YouTubeVideoDetails;
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch video details');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return { loading, error, videoDetails, getVideoDetails, clearError };
}
