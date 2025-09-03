'use client';

import React from 'react';
import { Download, Video, Music, User, Eye, ThumbsUp, MessageSquare, Clock, ExternalLink } from 'lucide-react';
import { YouTubeVideoDetails } from '@/types/youtube';
import { YouTubeApiUtils } from '@/lib/youtube-utils';
import { Button } from '@/components/ui/button';


interface VideoCardProps {
  video: YouTubeVideoDetails;
  onDownload?: (video: YouTubeVideoDetails) => void;
  onViewDetails?: (video: YouTubeVideoDetails) => void;
  showStats?: boolean;
  compact?: boolean;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDownload,
  onViewDetails,
  showStats = true,
  compact = false,
  className = '',
}) => {
  const handleDownload = () => {
    onDownload?.(video);
  };

  const handleViewDetails = () => {
    onViewDetails?.(video);
  };

  const openYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex gap-3 p-4">
          <div className="flex-shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-24 h-16 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
              {video.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span>{video.channel.name}</span>
              {video.channel.verified && <span className="text-blue-500">✓</span>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                {showStats && (
                  <>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {YouTubeApiUtils.format.formatNumber(video.stats.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {YouTubeApiUtils.format.formatDuration(video.duration)}
                    </span>
                  </>
                )}
              </div>
              <div className="flex gap-1">
                {onDownload && (
                  <Button
                    onClick={handleDownload}
                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover rounded-t-lg"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {YouTubeApiUtils.format.formatDuration(video.duration)}
        </div>
        <button
          onClick={openYouTube}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
          title="Open on YouTube"
        >
          <ExternalLink className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-2">
          <img
            src={video.channel.thumbnail}
            alt={video.channel.name}
            className="w-8 h-8 rounded-full"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {video.channel.name}
              </span>
              {video.channel.verified && (
                <span className="text-blue-500" title="Verified">✓</span>
              )}
            </div>
          </div>
        </div>

        {showStats && (
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{YouTubeApiUtils.format.formatNumber(video.stats.views)} views</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{YouTubeApiUtils.format.formatNumber(video.stats.likes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{YouTubeApiUtils.format.formatNumber(video.stats.comments)}</span>
            </div>
          </div>
        )}

        {video.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {video.description}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          {onDownload && (
            <Button
              onClick={handleDownload}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
          {onViewDetails && (
            <Button
              onClick={handleViewDetails}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
