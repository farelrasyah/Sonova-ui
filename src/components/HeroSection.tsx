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
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tight">
            {title ? (
              <>
                {title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="gradient-text-soft">{title.split(' ').slice(-1)}</span>
              </>
            ) : (
              <>
                YouTube Playlist <span className="gradient-text-soft">Downloader</span>
              </>
            )}
          </h1>
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 rounded-full opacity-60"></div>
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            {description || 'Download high-quality YouTube videos quickly and easily. Convert to MP4 or MP3 format with just a few clicks. No registration required.'}
          </p>
        </div>

        {/* Download Form */}
        <form onSubmit={handleDownload} className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white/70 backdrop-blur-xl rounded-soft-xl p-8 shadow-soft-xl border border-white/20 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between px-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-soft-lg shadow-soft hover:bg-white hover:shadow-soft-lg transition-gentle min-w-[160px] group"
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
                className="flex-1 px-6 py-4 border-0 rounded-soft-lg bg-slate-50/80 text-slate-700 placeholder-slate-400 font-medium shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-gentle"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                required
              />

              {/* Button */}
              <button
                type="submit"
                className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-soft-lg transition-gentle shadow-soft-lg btn-hover magnetic group"
                disabled={loading}
              >
                <span className="flex items-center space-x-2">
                  <span>{loading ? 'Memproses...' : 'Download'}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-4">{error}</div>
            )}

            {/* Result */}
            {result && (currentConfig?.showMeta ?? safePlatformConfig.showMeta) && (
              <div className="bg-white rounded shadow p-4 mt-4 text-left">
                {/* Title / caption */}
                {result.normalized?.title && <h2 className="font-bold text-lg mb-2">{result.normalized.title}</h2>}

                {/* Instagram preview grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(result.normalized?.items || []).map((it: any, idx: number) => (
                    <div key={idx} className="border rounded p-2">
                      {it.type === 'image' ? (
                        <img src={`/api/instagram/proxy?mediaUrl=${encodeURIComponent(it.url)}`} alt={`image-${idx}`} className="w-full h-48 object-cover rounded" />
                      ) : (
                        <video controls poster={it.thumbnail ? `/api/instagram/proxy?mediaUrl=${encodeURIComponent(it.thumbnail)}` : ''} src={`/api/instagram/proxy?mediaUrl=${encodeURIComponent(it.url)}`} className="w-full h-48 object-cover rounded" />
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-slate-600">{it.type.toUpperCase()}{it.quality ? ` • ${it.quality}` : ''}</div>
                        <a
                          href={`/api/instagram/download?mediaUrl=${encodeURIComponent(it.url)}&filename=${encodeURIComponent((result.normalized?.title || 'instagram') + (it.type === 'video' ? '.mp4' : '.jpg'))}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
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

