'use client';

import React, { useState, useRef } from 'react';

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

interface VideoPreviewProps {
  videoId: string;
  previewStream?: VideoStream | null;
  videoFormats?: VideoStream[];
  audioFormats?: VideoStream[];
  title?: string;
  thumbnail?: string;
}

export default function VideoPreview({ 
  videoId, 
  previewStream, 
  videoFormats = [], 
  audioFormats = [],
  title,
  thumbnail 
}: VideoPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPreview = () => {
    if (!previewStream) {
      setError('No preview stream available');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowVideo(true);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setError('Failed to load video. The stream may be unavailable.');
  };

  const handleDownload = (stream: VideoStream) => {
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = stream.url;
    link.download = `${title || `youtube-${videoId}`}.${stream.format}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (size?: string) => {
    if (!size) return 'Unknown size';
    const bytes = parseInt(size);
    if (isNaN(bytes)) return size;
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Video Preview Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Video Preview</h3>
        
        {!showVideo && (
          <div className="relative">
            {thumbnail && (
              <img 
                src={thumbnail} 
                alt={title || 'Video thumbnail'} 
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
              <button
                onClick={handlePlayPreview}
                disabled={!previewStream || isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-full font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Play Preview</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {showVideo && previewStream && (
          <div className="relative">
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-64 rounded-lg bg-black"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              poster={thumbnail}
            >
              <source src={previewStream.url} type={`video/${previewStream.format}`} />
              Your browser does not support the video tag.
            </video>
            
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {previewStream && (
          <div className="text-sm text-gray-600">
            Preview Quality: {previewStream.quality} | Format: {previewStream.format?.toUpperCase()}
            {previewStream.size && ` | Size: ${formatFileSize(previewStream.size)}`}
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Download Options</h4>
        
        {/* Video Formats */}
        {videoFormats.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Video Formats</h5>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {videoFormats.map((stream, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-800">
                        {stream.quality} ({stream.format?.toUpperCase()})
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatFileSize(stream.size)}
                        {stream.fps && ` • ${stream.fps}fps`}
                        {stream.hasAudio ? ' • With Audio' : ' • Video Only'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(stream)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Formats */}
        {audioFormats.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Audio Formats</h5>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {audioFormats.map((stream, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-800">
                        {stream.quality} ({stream.format?.toUpperCase()})
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatFileSize(stream.size)} • Audio Only
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(stream)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {videoFormats.length === 0 && audioFormats.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No download streams available for this video.
          </div>
        )}
      </div>
    </div>
  );
}
