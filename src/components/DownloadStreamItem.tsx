'use client';

import React from 'react';
import { Download, Video, Music, FileVideo, FileAudio, Zap, Star } from 'lucide-react';
import { YouTubeDownloadStream } from '@/types/youtube';
import { YouTubeApiUtils } from '@/lib/youtube-utils';
import { Button } from '@/components/ui/button';

interface DownloadStreamItemProps {
  stream: YouTubeDownloadStream;
  onDownload: (stream: YouTubeDownloadStream) => void;
  isRecommended?: boolean;
  showDetails?: boolean;
  className?: string;
}

const DownloadStreamItem: React.FC<DownloadStreamItemProps> = ({
  stream,
  onDownload,
  isRecommended = false,
  showDetails = true,
  className = '',
}) => {
  const handleDownload = () => {
    onDownload(stream);
  };

  const getStreamIcon = () => {
    if (stream.hasVideo && stream.hasAudio) {
      return <FileVideo className="w-5 h-5 text-blue-500" />;
    } else if (stream.hasVideo) {
      return <Video className="w-5 h-5 text-purple-500" />;
    } else {
      return <FileAudio className="w-5 h-5 text-green-500" />;
    }
  };

  const getStreamType = () => {
    if (stream.hasVideo && stream.hasAudio) {
      return 'Video + Audio';
    } else if (stream.hasVideo) {
      return 'Video Only';
    } else {
      return 'Audio Only';
    }
  };

  const getQualityColor = () => {
    const priority = YouTubeApiUtils.stream.getQualityPriority(stream.quality);
    if (priority <= 2) return 'text-green-600 dark:text-green-400'; // 4K, 2K
    if (priority <= 4) return 'text-blue-600 dark:text-blue-400'; // 1080p, 720p
    if (priority <= 6) return 'text-yellow-600 dark:text-yellow-400'; // 480p, 360p
    return 'text-gray-600 dark:text-gray-400'; // Lower qualities
  };

  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-lg border ${isRecommended ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'} hover:shadow-md transition-all ${className}`}>
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          Recommended
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStreamIcon()}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold text-lg ${getQualityColor()}`}>
                  {stream.quality}
                </span>
                <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  {stream.format.toUpperCase()}
                </span>
                {stream.fps && stream.fps > 30 && (
                  <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                    {stream.fps}fps
                  </span>
                )}
                {isRecommended && (
                  <span className="text-sm px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                    Best
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {getStreamType()}
                {stream.size && (
                  <span className="ml-2">• Size: {stream.size}</span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleDownload}
            className={`px-4 py-2 ${isRecommended ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center gap-2`}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {stream.codec && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Codec:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {stream.codec}
                  </span>
                </div>
              )}
              
              {stream.bitrate && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Bitrate:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {stream.bitrate}kbps
                  </span>
                </div>
              )}
              
              {stream.container && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Container:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {stream.container}
                  </span>
                </div>
              )}
              
              {stream.adaptive !== undefined && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                    {stream.adaptive ? 'Adaptive' : 'Progressive'}
                  </span>
                </div>
              )}
            </div>
            
            {(stream.audioCodec || stream.videoCodec) && (
              <div className="mt-2 flex gap-4 text-sm">
                {stream.videoCodec && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Video:</span>
                    <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                      {stream.videoCodec}
                    </span>
                  </div>
                )}
                
                {stream.audioCodec && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Audio:</span>
                    <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                      {stream.audioCodec}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface DownloadStreamsListProps {
  streams: YouTubeDownloadStream[];
  onDownload: (stream: YouTubeDownloadStream) => void;
  showRecommendations?: boolean;
  groupByType?: boolean;
  className?: string;
}

export const DownloadStreamsList: React.FC<DownloadStreamsListProps> = ({
  streams,
  onDownload,
  showRecommendations = true,
  groupByType = true,
  className = '',
}) => {
  if (streams.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No download streams available
      </div>
    );
  }

  const sortedStreams = YouTubeApiUtils.stream.sortStreams(streams);
  
  const bestVideoStream = showRecommendations 
    ? YouTubeApiUtils.stream.getBestStream(streams, 'video')
    : null;
  
  const bestAudioStream = showRecommendations 
    ? YouTubeApiUtils.stream.getBestStream(streams, 'audio')
    : null;

  if (!groupByType) {
    return (
      <div className={`space-y-3 ${className}`}>
        {sortedStreams.map((stream, index) => (
          <DownloadStreamItem
            key={index}
            stream={stream}
            onDownload={onDownload}
            isRecommended={showRecommendations && (stream === bestVideoStream || stream === bestAudioStream)}
          />
        ))}
      </div>
    );
  }

  const videoStreams = sortedStreams.filter(s => s.hasVideo);
  const audioStreams = sortedStreams.filter(s => s.hasAudio && !s.hasVideo);

  return (
    <div className={`space-y-6 ${className}`}>
      {videoStreams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Downloads ({videoStreams.length})
          </h3>
          <div className="space-y-3">
            {videoStreams.map((stream, index) => (
              <DownloadStreamItem
                key={`video-${index}`}
                stream={stream}
                onDownload={onDownload}
                isRecommended={showRecommendations && stream === bestVideoStream}
              />
            ))}
          </div>
        </div>
      )}

      {audioStreams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Music className="w-5 h-5" />
            Audio Downloads ({audioStreams.length})
          </h3>
          <div className="space-y-3">
            {audioStreams.map((stream, index) => (
              <DownloadStreamItem
                key={`audio-${index}`}
                stream={stream}
                onDownload={onDownload}
                isRecommended={showRecommendations && stream === bestAudioStream}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadStreamItem;
