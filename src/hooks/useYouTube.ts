/**
 * Custom hook for YouTube API operations
 */

import { useState, useCallback } from 'react';

export interface YouTubeVideoDetails {
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

export interface YouTubeDownloadStream {
  quality: string;
  format: string;
  url: string;
  size?: string;
  fps?: number;
  codec?: string;
  hasAudio: boolean;
  hasVideo: boolean;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channel: {
    name: string;
    id: string;
    thumbnail: string;
  };
  stats: {
    videoCount: number;
    views: number;
  };
  videos: Array<{
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
    channel: string;
    position: number;
  }>;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  banner: string;
  verified: boolean;
  stats: {
    subscribers: number;
    videos: number;
    views: number;
  };
  joinedAt: string;
  country: string;
}

interface UseYouTubeReturn {
  loading: boolean;
  error: string | null;
  videoDetails: YouTubeVideoDetails | null;
  downloadStreams: { videoFormats: YouTubeDownloadStream[]; audioFormats: YouTubeDownloadStream[] };
  getVideoDetails: (url: string) => Promise<void>;
  getDownloadStreams: (url: string, format?: 'video' | 'audio' | 'all') => Promise<void>;
  getVideoInfo: (url: string) => Promise<void>;
  playlist: YouTubePlaylist | null;
  getPlaylist: (url: string) => Promise<void>;
  channel: YouTubeChannel | null;
  getChannelInfo: (url: string) => Promise<void>;
  searchResults: YouTubeVideoDetails[];
  searchVideos: (query: string, limit?: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useYouTube = (): UseYouTubeReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDetails, setVideoDetails] = useState<YouTubeVideoDetails | null>(null);
  const [downloadStreams, setDownloadStreams] = useState<{ videoFormats: YouTubeDownloadStream[]; audioFormats: YouTubeDownloadStream[] }>({ videoFormats: [], audioFormats: [] });
  const [playlist, setPlaylist] = useState<YouTubePlaylist | null>(null);
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [searchResults, setSearchResults] = useState<YouTubeVideoDetails[]>([]);

  const clearError = useCallback(() => setError(null), []);
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setVideoDetails(null);
    setDownloadStreams({ videoFormats: [], audioFormats: [] });
    setPlaylist(null);
    setChannel(null);
    setSearchResults([]);
  }, []);

  const handleApiCall = useCallback(async <T>(apiCall: () => Promise<Response>, onSuccess: (data: T) => void, errorMessage = 'Operation failed') => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.error || errorMessage);
      onSuccess(data.data);
    } catch (err: any) {
      console.error('YouTube API Error:', err);
      setError(err?.message || errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getVideoDetails = useCallback(async (url: string) => {
    await handleApiCall(
      () => fetch(`/api/youtube?url=${encodeURIComponent(url)}&action=details`),
      (data: YouTubeVideoDetails) => setVideoDetails(data),
      'Failed to fetch video details'
    );
  }, [handleApiCall]);

  const getDownloadStreams = useCallback(async (url: string, format: 'video' | 'audio' | 'all' = 'all') => {
    await handleApiCall(
      () => fetch(`/api/youtube?url=${encodeURIComponent(url)}&action=streams&format=${format}`),
      (data: { videoFormats: YouTubeDownloadStream[]; audioFormats: YouTubeDownloadStream[] }) => {
        setDownloadStreams(data);
      },
      'Failed to fetch download streams'
    );
  }, [handleApiCall]);

  const getPlaylist = useCallback(async (url: string) => {
    await handleApiCall(
      () => fetch(`/api/youtube?url=${encodeURIComponent(url)}&action=details`),
      () => {},
      'Failed to fetch playlist information'
    );
  }, [handleApiCall]);

  const getChannelInfo = useCallback(async (url: string) => {
    await handleApiCall(
      () => fetch(`/api/youtube?url=${encodeURIComponent(url)}&action=details`),
      () => {},
      'Failed to fetch channel information'
    );
  }, [handleApiCall]);

  const searchVideos = useCallback(async (query: string, limit = 20) => {
    await handleApiCall(
      () => fetch(`/api/youtube?url=${encodeURIComponent(query)}&action=details`),
      (data: { results: YouTubeVideoDetails[] }) => setSearchResults(data.results),
      'Failed to search videos'
    );
  }, [handleApiCall]);

  const getVideoInfo = useCallback(async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const [dRes, sRes] = await Promise.all([
        fetch(`/api/youtube?url=${encodeURIComponent(url)}&action=details`),
        fetch(`/api/youtube?url=${encodeURIComponent(url)}&action=streams`),
      ]);
      const dJson = await dRes.json();
      const sJson = await sRes.json();
      if (!dRes.ok || !dJson?.success) throw new Error(dJson?.error || 'Failed to fetch details');
      if (!sRes.ok || !sJson?.success) throw new Error(sJson?.error || 'Failed to fetch streams');
      setVideoDetails(dJson.data);
      setDownloadStreams(sJson.data);
    } catch (err: any) {
      console.error('Error getting video info:', err);
      setError(err?.message || 'Failed to fetch video information');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    videoDetails,
    downloadStreams,
    getVideoDetails,
    getDownloadStreams,
    getVideoInfo,
    playlist,
    getPlaylist,
    channel,
    getChannelInfo,
    searchResults,
    searchVideos,
    clearError,
    reset,
  };
};

export const YouTubeUtils = {
  formatNumber: (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return String(num);
  },
  formatDuration: (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
  },
  extractVideoId: (url: string): string | null => {
    const re = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const id = url.match(re)?.[1];
    return id || (/^[a-zA-Z0-9_-]{11}$/.test(url) ? url : null);
  },
  isValidYouTubeUrl: (url: string) => !!YouTubeUtils.extractVideoId(url),
  getThumbnailUrl: (videoId: string, q: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high') =>
    `https://img.youtube.com/vi/${videoId}/${q === 'default' ? 'default' : q === 'medium' ? 'mqdefault' : q === 'high' ? 'hqdefault' : q === 'standard' ? 'sddefault' : 'maxresdefault'}.jpg`,
  getQualityPriority: (q: string) => ({ '2160p': 1, '1440p': 2, '1080p': 3, '720p': 4, '480p': 5, '360p': 6, '240p': 7, '144p': 8 } as Record<string, number>)[q] || 999,
  sortStreams: (streams: YouTubeDownloadStream[]) => [...streams].sort((a, b) => {
    if (a.hasVideo && !b.hasVideo) return -1;
    if (!a.hasVideo && b.hasVideo) return 1;
    return YouTubeUtils.getQualityPriority(a.quality) - YouTubeUtils.getQualityPriority(b.quality);
  }),
  filterStreams: (s: YouTubeDownloadStream[], type: 'video' | 'audio' | 'all' = 'all') =>
    type === 'video' ? s.filter(x => x.hasVideo) : type === 'audio' ? s.filter(x => x.hasAudio && !x.hasVideo) : s,
  getBestStream: (s: YouTubeDownloadStream[], type: 'video' | 'audio' = 'video') => {
    const filtered = YouTubeUtils.filterStreams(s, type);
    const sorted = YouTubeUtils.sortStreams(filtered);
    return sorted[0] || null;
  },
};
