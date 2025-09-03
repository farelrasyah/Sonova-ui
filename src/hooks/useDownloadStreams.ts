// sonova/src/hooks/useDownloadStreams.ts
'use client';

import { useCallback, useState } from 'react';
import type { StreamsResponse } from '@/types/youtube';

export function useDownloadStreams() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [data, setData]       = useState<StreamsResponse | null>(null);

  const getDownloadStreams = useCallback(async (idOrUrl: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/youtube/streams?url=${encodeURIComponent(idOrUrl)}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
      setData(json as StreamsResponse);
      return json as StreamsResponse;
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch streams');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  return { loading, error, data, getDownloadStreams, clearError };
}
