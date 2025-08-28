'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroSectionProps {
  title: string;
  description: string;
  platform?: 'tiktok' | 'youtube' | 'youtube-playlist' | 'instagram' | 'twitter' | 'youtube-summary' | 'mindreplay';
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description, platform }) => {
  const { t } = useLanguage();
  const [selectedFormat, setSelectedFormat] = useState('MP4');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Platform config
  const config = {
    tiktok: {
      api: '/api/tiktok',
      placeholder: 'Paste your TikTok URL here...',
      formats: [
        { value: 'MP4', label: 'MP4 Video', icon: '🎥' },
        { value: 'MP3', label: 'MP3 Audio', icon: '🎵' },
      ],
      getDownloadLinks: (data: any, format: string) => ({
        url: format === 'MP4' ? data.videoUrl : data.audioUrl,
        label: format === 'MP4' ? 'Download Video (No Watermark)' : 'Download Audio (MP3)'
      }),
      showMeta: true,
    },
    youtube: {
      api: '/api/youtube',
      placeholder: 'Paste your YouTube URL here...',
      formats: [
        { value: 'MP4', label: 'MP4 Video', icon: '🎥' },
        { value: 'MP3', label: 'MP3 Audio', icon: '🎵' },
      ],
      getDownloadLinks: (data: any, format: string) => ({
        url: format === 'MP4' ? data.videoUrl : data.audioUrl,
        label: format === 'MP4' ? 'Download Video' : 'Download Audio (MP3)'
      }),
      showMeta: true,
    },
    'youtube-playlist': {
      api: '/api/youtube-playlist',
      placeholder: 'Paste your YouTube Playlist URL here...',
      formats: [
        { value: 'MP4', label: 'MP4 Video', icon: '🎥' },
      ],
      getDownloadLinks: (data: any) => ({
        url: data.videoUrl,
        label: 'Download Playlist Video'
      }),
      showMeta: true,
    },
    instagram: {
      api: '/api/instagram',
      placeholder: 'Paste your Instagram URL here...',
      formats: [
        { value: 'MP4', label: 'MP4 Video', icon: '🎥' },
        { value: 'JPG', label: 'Image', icon: '🖼️' },
      ],
      getDownloadLinks: (data: any, format: string) => ({
        url: format === 'MP4' ? data.videoUrl : data.imageUrl,
        label: format === 'MP4' ? 'Download Video' : 'Download Image'
      }),
      showMeta: true,
    },
    twitter: {
      api: '/api/twitter',
      placeholder: 'Paste your Twitter URL here...',
      formats: [
        { value: 'MP4', label: 'MP4 Video', icon: '🎥' },
      ],
      getDownloadLinks: (data: any) => ({
        url: data.videoUrl,
        label: 'Download Video'
      }),
      showMeta: true,
    },
    'youtube-summary': {
      api: '/api/youtube-summary',
      placeholder: 'Paste your YouTube URL here...',
      formats: [],
      getDownloadLinks: () => ({}),
      showMeta: false,
    },
  } as const;

  // ensure platform key is valid and provide safe fallbacks
  const platformKey = (platform || 'youtube') as keyof typeof config;
  const rawPlatformConfig = (config as any)[platformKey];
  const safePlatformConfig = rawPlatformConfig ?? (config as any).youtube ?? { formats: [], placeholder: '', getDownloadLinks: () => ({ url: '#', label: 'Download' }), showMeta: false };
  const formats = Array.isArray(safePlatformConfig.formats) ? safePlatformConfig.formats : [];
  const selectedFormatData = formats.find((f: any) => f.value === selectedFormat) || formats[0] || { value: selectedFormat, label: selectedFormat, icon: '🎥' };
  // currentConfig holds the platform config actually used for the last submit (or default)
  const [currentConfig, setCurrentConfig] = useState<any>(safePlatformConfig);

  // Try to detect platform from a given URL
  function detectPlatformFromUrl(url: string) {
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      if (host.includes('tiktok.com')) return 'tiktok';
      if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
      if (host.includes('instagram.com')) return 'instagram';
      if (host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
      return 'youtube';
    } catch (e) {
      return 'youtube';
    }
  }

  // Format durasi (detik ke mm:ss)
  function formatDuration(sec: number) {
    if (!sec) return '';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Handler submit
  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!inputUrl.trim()) {
      setError('Masukkan URL terlebih dahulu.');
      return;
    }
    setLoading(true);
    try {
      // detect platform from URL
      const detectedKey = detectPlatformFromUrl(inputUrl);

      // If this component/page is tied to a specific platform, enforce it
      if (platform) {
        if (detectedKey !== platform) {
          const names: any = {
            tiktok: 'TikTok',
            youtube: 'YouTube',
            instagram: 'Instagram',
            twitter: 'Twitter',
            'youtube-playlist': 'YouTube Playlist',
            'youtube-summary': 'YouTube'
          };
          setError(`Halaman ini hanya menerima URL ${names[platform] || platform}. Silakan masukkan URL ${names[platform] || platform}.`);
          setLoading(false);
          return;
        }
        const effectiveConfig = (config as any)[platform] ?? (config as any).youtube;
        setCurrentConfig(effectiveConfig);
        const res = await fetch(`${effectiveConfig.api}?url=${encodeURIComponent(inputUrl)}`);
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error || 'Gagal mengambil data.');
          setResult(null);
        } else {
          setResult(data);
        }
        return;
      }

      // No fixed platform: use detected platform
      const effectiveConfig = (config as any)[detectedKey] ?? (config as any).youtube;
      setCurrentConfig(effectiveConfig);

      const res = await fetch(`${effectiveConfig.api}?url=${encodeURIComponent(inputUrl)}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Gagal mengambil data.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="download-section" className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-6 lg:px-8 pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-soft-xl opacity-60 animate-float blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-slate-100/50 to-indigo-100/50 rounded-soft-xl opacity-50 animate-gentle-float blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-soft-xl opacity-40 animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148, 163, 184) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Title */}
        <div className="mb-8 animate-fade-in-up text-center" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 tracking-tight text-slate-900">
            {title ? (
              <>
                <span className="mr-2">{title.split(' ').slice(0, -1).join(' ')}</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-500">{title.split(' ').slice(-1)}</span>
              </>
            ) : (
              <>
                <span className="mr-2">YouTube Playlist</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-500">Downloader</span>
              </>
            )}
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">{description || 'Paste a public Instagram link to preview and download media. Fast, private, and secure.'}</p>
        </div>
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 rounded-full opacity-60"></div>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            {description || 'Download high-quality YouTube videos quickly and easily. Convert to MP4 or MP3 format with just a few clicks. No registration required.'}
          </p>
        {/* Download Form */}
        <form onSubmit={handleDownload} className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-4xl mx-auto transition-all duration-200">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Dropdown */}
        <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-transform duration-150 ease-out min-w-[140px] group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedFormatData?.icon}</span>
                    <span className="font-medium text-slate-700">{selectedFormatData?.label}</span>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-gentle ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-soft-lg shadow-soft-xl border border-white/30 overflow-hidden z-50 animate-fade-in-up">
                    {formats.map((format: any) => (
                      <button
                        key={format.value}
                        type="button"
                        onClick={() => {
                          setSelectedFormat(format.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50/80 transition-gentle ${
                          selectedFormat === format.value ? 'bg-blue-50/60' : ''
                        }`}
                      >
                        <span className="text-base">{format.icon}</span>
                        <span className="font-medium text-slate-700">{format.label}</span>
                        {selectedFormat === format.value && (
                          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="url"
                placeholder={currentConfig?.placeholder || safePlatformConfig.placeholder}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 text-slate-700 placeholder-slate-400 font-medium border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all duration-150"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                required
              />

              {/* Button */}
              <button
                type="submit"
                className="flex-shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-transform duration-150 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
                disabled={loading}
              >
                <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                </svg>
                <span>{loading ? 'Memproses...' : 'Get Media'}</span>
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md mt-4 border border-red-100">{error}</div>
            )}

            {/* Loading skeleton - Ultra Modern */}
            {loading && !result && (
              <div className="mt-10 flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="relative">
                    {/* Animated background glow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 rounded-[1rem] blur-md animate-pulse"></div>

                    <div className="relative bg-gradient-to-br from-white via-gray-50/50 to-white backdrop-blur-2xl rounded-[1rem] overflow-hidden shadow-xl border border-white/40">
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                      }}></div>

                      <div className="relative z-10 p-6 md:p-8">
                        <div className="relative bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 rounded-xl overflow-hidden shadow-inner border border-gray-200/50">
                          <div className="w-full h-[280px] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse relative overflow-hidden">
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          </div>

                          {/* Premium corner accents */}
                          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-gradient-to-br from-violet-400 to-purple-400 rounded-tl-lg"></div>
                          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-gradient-to-bl from-purple-400 to-indigo-400 rounded-tr-lg"></div>
                          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-gradient-to-tr from-indigo-400 to-violet-400 rounded-bl-lg"></div>
                          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-gradient-to-tl from-violet-400 to-purple-400 rounded-br-lg"></div>
                        </div>

                        <div className="mt-6 text-center">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-emerald-200/60 shadow-md backdrop-blur-sm">
                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-24 animate-pulse"></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                          </div>

                          <div className="mt-4 w-44 h-12 bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 rounded-xl animate-pulse mx-auto shadow-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && (currentConfig?.showMeta ?? safePlatformConfig.showMeta) && (
              <div className="mt-10">
                {/* Premium Title Section */}
                {result.normalized?.title && (
                  <div className="text-center mb-6">
                    <div className="inline-block relative">
                      <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 tracking-tight animate-gradient-shift">
                        {result.normalized.title}
                      </h2>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-full animate-scale-elegant"></div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 font-medium">Premium Media Download</p>
                  </div>
                )}

                {/* Instagram preview - Ultra Modern Hero Layout */}
                <div className="flex justify-center px-4">
                  <div className="w-full max-w-3xl">
                    {(result.normalized?.items || []).map((it: any, idx: number) => (
                      <div key={idx} className="group relative">
                        {/* Animated background glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-indigo-600/10 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-700 opacity-0 group-hover:opacity-100 animate-glow-pulse"></div>

                        {/* Main Media Card - Ultra Premium */}
                        <div className="relative bg-gradient-to-br from-white via-gray-50/30 to-white backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-2xl group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-700 border border-white/60 group-hover:border-violet-200/50 animate-fade-in-up-ultra">
                          {/* Subtle pattern overlay */}
                          <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '80px 80px'
                          }}></div>

                          {/* Media container with premium frame */}
                          <div className="relative z-10 p-6 md:p-8">
                            <div className="relative bg-gradient-to-br from-slate-900/5 via-gray-900/10 to-slate-900/5 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/40">
                              {it.type === 'image' ? (
                                <div className="relative group/media">
                                  <img
                                    src={`/api/instagram/proxy?mediaUrl=${encodeURIComponent(it.url)}`}
                                    alt={`Instagram media ${idx + 1}`}
                                    className="w-full h-auto max-h-[350px] object-contain mx-auto group-hover:scale-[1.02] transition-transform duration-[2000ms] ease-out filter group-hover:brightness-105"
                                  />

                                  {/* Premium corner accents */}
                                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gradient-to-br from-violet-400 to-purple-400 rounded-tl-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gradient-to-bl from-purple-400 to-indigo-400 rounded-tr-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gradient-to-tr from-indigo-400 to-violet-400 rounded-bl-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gradient-to-tl from-violet-400 to-purple-400 rounded-br-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                </div>
                              ) : (
                                <div className="relative group/media">
                                  <video
                                    controls
                                    poster={it.thumbnail ? `/api/instagram/proxy?mediaUrl=${encodeURIComponent(it.thumbnail)}` : ''}
                                    src={`/api/instagram/proxy?mediaUrl=${encodeURIComponent(it.url)}`}
                                    className="w-full h-auto max-h-[350px] object-contain mx-auto group-hover:scale-[1.02] transition-transform duration-[2000ms] ease-out rounded-xl"
                                  />

                                  {/* Premium corner accents */}
                                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gradient-to-br from-violet-400 to-purple-400 rounded-tl-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-gradient-to-bl from-purple-400 to-indigo-400 rounded-tr-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-gradient-to-tr from-indigo-400 to-violet-400 rounded-bl-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gradient-to-tl from-violet-400 to-purple-400 rounded-br-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                </div>
                              )}


                              {/* Premium hover play button for videos */}
                              {it.type === 'video' && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                                  <div className="bg-white/95 backdrop-blur-2xl rounded-full p-6 shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500 border border-white/50">
                                    <svg className="w-10 h-10 text-violet-600 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M8 5v10l8-5-8-5z"/>
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Premium download section - separated and spaced */}
                            <div className="mt-8">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                {/* Status removed: keep empty spacer so button stays in place */}
                                <div className="flex-1 sm:flex-none min-w-0" aria-hidden="true"></div>

                                {/* Download button - static, no animations */}
                                <div className="flex-shrink-0">
                                  <a
                                    href={`/api/instagram/download?mediaUrl=${encodeURIComponent(it.url)}&filename=${encodeURIComponent((result.normalized?.title || 'instagram') + (it.type === 'video' ? '.mp4' : '.jpg'))}`}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm border border-white/20"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm">DOWNLOAD {it.type === 'video' ? 'VIDEO' : 'IMAGE'}</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* YouTube Summary */}
            {result && platform === 'youtube-summary' && (
              <div className="bg-white rounded shadow p-4 mt-4 text-left">
                <h2 className="font-bold text-lg mb-2">Ringkasan Video:</h2>
                <div className="whitespace-pre-line text-gray-700">{result.summary}</div>
              </div>
            )}
          </div>
        </form>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          {t.home.features.map((feature, index) => {
            const icons = ['⚡', '🛡️', '🎯'];
            return {
              icon: icons[index % icons.length],
              title: feature.title,
              desc: feature.description
            };
          }).map((feature, index) => (
            <div key={index} className="group text-center animate-fade-in-up" style={{ animationDelay: `${0.9 + index * 0.1}s` }}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-white to-slate-50 rounded-soft-xl shadow-soft mb-4 group-hover:scale-110 transition-gentle">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

