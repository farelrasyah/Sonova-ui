/**
 * YouTube API Utility Functions
 * Helper functions for YouTube operations and data processing
 */

// URL validation and extraction utilities
export const urlUtils = {
  /**
   * Extract video ID from various YouTube URL formats
   */
  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /^[a-zA-Z0-9_-]{11}$/ // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return null;
  },

  /**
   * Extract playlist ID from YouTube URL
   */
  extractPlaylistId(url: string): string | null {
    const patterns = [
      /[&?]list=([a-zA-Z0-9_-]+)/,
      /^[a-zA-Z0-9_-]+$/ // Direct playlist ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return null;
  },

  /**
   * Extract channel information from YouTube URL
   */
  extractChannelInfo(url: string): { type: 'id' | 'handle' | 'custom'; value: string } | null {
    const patterns = [
      { regex: /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/, type: 'id' as const },
      { regex: /youtube\.com\/@([a-zA-Z0-9_.-]+)/, type: 'handle' as const },
      { regex: /youtube\.com\/c\/([a-zA-Z0-9_-]+)/, type: 'custom' as const },
      { regex: /youtube\.com\/user\/([a-zA-Z0-9_-]+)/, type: 'custom' as const },
    ];

    for (const { regex, type } of patterns) {
      const match = url.match(regex);
      if (match) {
        return { type, value: match[1] };
      }
    }

    // Check if it's a direct ID or handle
    if (/^UC[a-zA-Z0-9_-]{22}$/.test(url)) {
      return { type: 'id', value: url };
    }
    if (/^@[a-zA-Z0-9_.-]+$/.test(url)) {
      return { type: 'handle', value: url.substring(1) };
    }

    return null;
  },

  /**
   * Validate if URL is a valid YouTube URL
   */
  isValidYouTubeUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return /(\.|^)youtube\.com$|(\.|^)youtu\.be$/i.test(parsed.hostname);
    } catch {
      return false;
    }
  },

  /**
   * Clean and normalize YouTube URL
   */
  normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      
      // Remove tracking parameters
      const paramsToKeep = ['v', 'list', 't'];
      const newParams = new URLSearchParams();
      
      paramsToKeep.forEach(param => {
        const value = parsed.searchParams.get(param);
        if (value) {
          newParams.set(param, value);
        }
      });

      parsed.search = newParams.toString();
      parsed.hash = '';
      
      return parsed.toString();
    } catch {
      return url;
    }
  }
};

// Formatting utilities
export const formatUtils = {
  /**
   * Format numbers with K/M/B suffixes
   */
  formatNumber(num: number): string {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  },

  /**
   * Format duration from seconds to readable format
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Format file size from bytes
   */
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  },

  /**
   * Format date to relative time
   */
  formatRelativeTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
      ];
      
      for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count > 0) {
          return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
      }
      
      return 'Just now';
    } catch {
      return dateString;
    }
  }
};

// Quality and stream utilities
export const streamUtils = {
  /**
   * Get quality priority for sorting (lower number = higher priority)
   */
  getQualityPriority(quality: string): number {
    const priorities: Record<string, number> = {
      '2160p': 1, '4K': 1,
      '1440p': 2, '2K': 2,
      '1080p': 3, 'Full HD': 3,
      '720p': 4, 'HD': 4,
      '480p': 5,
      '360p': 6,
      '240p': 7,
      '144p': 8,
      'Audio': 10,
      '320kbps': 11,
      '256kbps': 12,
      '192kbps': 13,
      '128kbps': 14,
      '96kbps': 15,
      '64kbps': 16
    };
    
    return priorities[quality] || 999;
  },

  /**
   * Sort streams by quality and type
   */
  sortStreams<T extends { quality: string; hasVideo?: boolean; hasAudio?: boolean }>(streams: T[]): T[] {
    return [...streams].sort((a, b) => {
      // Video streams first
      if (a.hasVideo && !b.hasVideo) return -1;
      if (!a.hasVideo && b.hasVideo) return 1;
      
      // Then by quality priority
      const aPriority = streamUtils.getQualityPriority(a.quality);
      const bPriority = streamUtils.getQualityPriority(b.quality);
      
      return aPriority - bPriority;
    });
  },

  /**
   * Filter streams by type
   */
  filterStreamsByType<T extends { hasVideo?: boolean; hasAudio?: boolean }>(
    streams: T[], 
    type: 'video' | 'audio' | 'all' = 'all'
  ): T[] {
    if (type === 'video') {
      return streams.filter(stream => stream.hasVideo);
    }
    if (type === 'audio') {
      return streams.filter(stream => stream.hasAudio && !stream.hasVideo);
    }
    return streams;
  },

  /**
   * Get best quality stream for type
   */
  getBestStream<T extends { quality: string; hasVideo?: boolean; hasAudio?: boolean }>(
    streams: T[], 
    type: 'video' | 'audio' = 'video'
  ): T | null {
    const filtered = streamUtils.filterStreamsByType(streams, type);
    const sorted = streamUtils.sortStreams(filtered);
    return sorted[0] || null;
  },

  /**
   * Group streams by format
   */
  groupStreamsByFormat<T extends { format: string }>(streams: T[]): Record<string, T[]> {
    return streams.reduce((groups, stream) => {
      const format = stream.format.toLowerCase();
      if (!groups[format]) {
        groups[format] = [];
      }
      groups[format].push(stream);
      return groups;
    }, {} as Record<string, T[]>);
  }
};

// Error handling utilities
export const errorUtils = {
  /**
   * Parse and categorize API errors
   */
  parseApiError(error: any): { type: string; message: string; retryable: boolean } {
    const message = error?.message || error?.error || 'Unknown error';
    
    if (message.includes('Invalid YouTube') || message.includes('Invalid URL')) {
      return {
        type: 'validation',
        message: 'Invalid YouTube URL format',
        retryable: false
      };
    }
    
    if (message.includes('429') || message.includes('Rate limit')) {
      return {
        type: 'rate_limit',
        message: 'Rate limit exceeded. Please try again later.',
        retryable: true
      };
    }
    
    if (message.includes('403') || message.includes('forbidden')) {
      return {
        type: 'permission',
        message: 'Access forbidden. Please check API permissions.',
        retryable: false
      };
    }
    
    if (message.includes('404') || message.includes('not found')) {
      return {
        type: 'not_found',
        message: 'Content not found or is private.',
        retryable: false
      };
    }
    
    if (message.includes('RAPIDAPI_KEY') || message.includes('configuration')) {
      return {
        type: 'config',
        message: 'Server configuration error.',
        retryable: false
      };
    }
    
    return {
      type: 'unknown',
      message: 'An unexpected error occurred. Please try again.',
      retryable: true
    };
  },

  /**
   * Check if error is retryable
   */
  isRetryableError(error: any): boolean {
    const parsed = errorUtils.parseApiError(error);
    return parsed.retryable;
  }
};

// Validation utilities
export const validationUtils = {
  /**
   * Validate YouTube video URL
   */
  validateVideoUrl(url: string): { valid: boolean; error?: string } {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' };
    }
    
    if (!urlUtils.isValidYouTubeUrl(url)) {
      return { valid: false, error: 'Must be a valid YouTube URL' };
    }
    
    if (!urlUtils.extractVideoId(url)) {
      return { valid: false, error: 'No video ID found in URL' };
    }
    
    return { valid: true };
  },

  /**
   * Validate YouTube playlist URL
   */
  validatePlaylistUrl(url: string): { valid: boolean; error?: string } {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' };
    }
    
    if (!urlUtils.isValidYouTubeUrl(url)) {
      return { valid: false, error: 'Must be a valid YouTube URL' };
    }
    
    if (!urlUtils.extractPlaylistId(url)) {
      return { valid: false, error: 'No playlist ID found in URL' };
    }
    
    return { valid: true };
  },

  /**
   * Validate YouTube channel URL
   */
  validateChannelUrl(url: string): { valid: boolean; error?: string } {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' };
    }
    
    if (!urlUtils.isValidYouTubeUrl(url)) {
      return { valid: false, error: 'Must be a valid YouTube URL' };
    }
    
    if (!urlUtils.extractChannelInfo(url)) {
      return { valid: false, error: 'No channel information found in URL' };
    }
    
    return { valid: true };
  },

  /**
   * Validate search query
   */
  validateSearchQuery(query: string, minLength: number = 2, maxLength: number = 100): { valid: boolean; error?: string } {
    if (!query || typeof query !== 'string') {
      return { valid: false, error: 'Search query is required' };
    }
    
    const trimmed = query.trim();
    
    if (trimmed.length < minLength) {
      return { valid: false, error: `Search query must be at least ${minLength} characters` };
    }
    
    if (trimmed.length > maxLength) {
      return { valid: false, error: `Search query must be less than ${maxLength} characters` };
    }
    
    return { valid: true };
  }
};

// Browser utilities
export const browserUtils = {
  /**
   * Download file by opening in new tab/window
   */
  downloadFile(url: string, filename?: string): void {
    try {
      const link = document.createElement('a');
      link.href = url;
      if (filename) {
        link.download = filename;
      }
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to window.open
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  },

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      }
    } catch {
      return false;
    }
  },

  /**
   * Check if user is on mobile device
   */
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * Get user's preferred language
   */
  getUserLanguage(): string {
    return navigator.language || navigator.languages?.[0] || 'en';
  }
};

// Combine all utilities
export const YouTubeApiUtils = {
  url: urlUtils,
  format: formatUtils,
  stream: streamUtils,
  error: errorUtils,
  validation: validationUtils,
  browser: browserUtils
};

export default YouTubeApiUtils;
