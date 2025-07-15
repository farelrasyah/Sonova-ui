import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50/30 to-white py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-soft-xl blur-xl animate-gentle-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-slate-100/30 to-indigo-100/30 rounded-soft-xl blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block">
            <div className="mb-4">
              <span className="text-slate-500 text-lg font-light tracking-wide">Introducing</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="gradient-text-soft">Sonova</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 rounded-full mx-auto opacity-60"></div>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto text-center mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
            The most sophisticated and user-friendly video downloader on the internet. 
            Supporting multiple platforms including YouTube, Twitter, Facebook, TikTok, and more.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Card */}
          <div className="group relative animate-fade-in-left" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-soft-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/20 rounded-soft-xl p-8 shadow-soft-xl card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-soft-lg flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">
                    Buffer-Free Entertainment
                  </h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Experience seamless offline entertainment with our advanced download technology. 
                No more buffering, no more interruptions - just pure, uninterrupted content enjoyment.
              </p>
            </div>
          </div>

          {/* Right Card */}
          <div className="group relative animate-fade-in-right" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-soft-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/20 rounded-soft-xl p-8 shadow-soft-xl card-hover">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-soft-lg flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-1">
                    Complete Solution
                  </h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Your all-in-one platform for video downloading. High-speed processing, 
                multiple format support, and instant access to your favorite content, all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '10M+', label: 'Downloads' },
              { number: '99.9%', label: 'Uptime' },
              { number: '50+', label: 'Platforms' },
              { number: '24/7', label: 'Available' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl md:text-3xl font-bold gradient-text-soft mb-2 group-hover:scale-110 transition-gentle">
                  {stat.number}
                </div>
                <div className="text-slate-500 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
