'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import NoticeBar from '@/components/NoticeBar';
import AboutSection from '@/components/AboutSection';
import FAQSection from '@/components/FAQSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import VideoPreview from '@/components/VideoPreview';
import { Download, Play, User, Eye, ThumbsUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useYouTube, YouTubeUtils } from '@/hooks/useYouTube';
import { useDownloadStreams } from '@/hooks/useDownloadStreams';

export default function Home() {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');

  const {
    loading: videoLoading,
    error: videoError,
    videoDetails,
    getVideoDetails: getVideoDetailsHook,
    clearError: clearVideoError,
  } = useYouTube();

  const {
    loading: streamLoading,
    error: streamError,
    data: streamData,
    getDownloadStreams,
    clearError: clearStreamError,
  } = useDownloadStreams();

  const loading = videoLoading || streamLoading;
  const error = videoError || streamError;

  const clearError = () => {
    clearVideoError();
    clearStreamError();
  };

  const extractVideoId = (input: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /^[a-zA-Z0-9_-]{11}$/,
    ];
    for (const re of patterns) {
      const m = input.match(re);
      if (m) return m[1] || m[0];
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const id = extractVideoId(url);
    if (!id) {
      console.error('[Page] Invalid YouTube URL');
      return;
    }

    clearError();

    try {
      console.log('[Page] 🚀 Fetching details & streams...', { id, url });
      await getVideoDetailsHook(url); // details via /api/youtube?action=details
      await getDownloadStreams(id);   // streams via /api/youtube/download?id=ID
      console.log('[Page] ✅ Done fetching');
    } catch (err) {
      console.error('[Page] Error in handleSubmit:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection title={t.home.title} description={t.home.description} platform="youtube" />
        <NoticeBar />

        {/* YouTube Downloader Section */}
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Download YouTube Videos
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    YouTube URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="youtube-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      disabled={loading}
                    />
                    <Button type="submit" disabled={loading || !url.trim()} className="px-6 bg-blue-500 hover:bg-blue-600 text-white">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (<><Download className="w-4 h-4 mr-2" />Get Media</>)}
                    </Button>
                  </div>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Debug Buttons */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">Debug Controls</h4>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={async () => {
                      const id = extractVideoId(url);
                      if (id) {
                        console.log('[Debug] getDownloadStreams ->', id);
                        await getDownloadStreams(id);
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Test Download Streams
                  </button>
                  <button
                    onClick={async () => {
                      if (url) {
                        console.log('[Debug] getVideoDetails ->', url);
                        await getVideoDetailsHook(url);
                      }
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                  >
                    Test Video Details
                  </button>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  Current URL: {url || 'None'} | Video ID: {extractVideoId(url) || 'None'}
                </p>
              </div>
            </div>

            {/* Video Details */}
            {videoDetails && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img src={videoDetails.thumbnail} alt={videoDetails.title} className="w-full md:w-60 h-auto rounded-lg" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{videoDetails.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                      <div className="flex items-center gap-1"><User className="w-4 h-4" /><span>{videoDetails.channel.name}</span>{videoDetails.channel.verified && (<span className="text-blue-500">✓</span>)}</div>
                      <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{YouTubeUtils.formatNumber(videoDetails.stats.views)} views</span></div>
                      <div className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /><span>{YouTubeUtils.formatNumber(videoDetails.stats.likes)}</span></div>
                      <div className="flex items-center gap-1"><Play className="w-4 h-4" /><span>{YouTubeUtils.formatDuration(videoDetails.duration)}</span></div>
                    </div>
                    {videoDetails.description && (
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                        {videoDetails.description.substring(0, 150)}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Video Preview and Download Options */}
            {streamData ? (
              <VideoPreview
                videoId={streamData.videoId}
                previewStream={streamData.previewStream}
                videoFormats={streamData.videoFormats}
                audioFormats={streamData.audioFormats}
                title={videoDetails?.title}
                thumbnail={videoDetails?.thumbnail}
              />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                <h4 className="font-medium">Debug Info:</h4>
                <p>Video Details: {videoDetails ? '✅ Loaded' : '❌ Not loaded'}</p>
                <p>Stream Data: {streamData ? '✅ Loaded' : '❌ Not loaded'}</p>
                <p>Video Loading: {videoLoading ? '⏳ Loading...' : '✅ Done'}</p>
                <p>Stream Loading: {streamLoading ? '⏳ Loading...' : '✅ Done'}</p>
                <p>Video Error: {videoError || 'None'}</p>
                <p>Stream Error: {streamError || 'None'}</p>
                <p>General Error: {error || 'None'}</p>
              </div>
            )}
          </div>
        </div>

        <AboutSection />
        <FeaturesSection
          features={t.home.features.map((feature, index) => ({
            title: feature.title,
            description: feature.description,
            gradient: ['from-blue-100 to-cyan-100', 'from-purple-100 to-pink-100', 'from-green-100 to-emerald-100'][index % 3],
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {[
                  <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                  <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                  <path key="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
                ][index % 3]}
              </svg>
            ),
          }))}
        />
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
          <FAQSection faqs={t.home.faq.map(item => ({ question: item.question, answer: item.answer }))} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
