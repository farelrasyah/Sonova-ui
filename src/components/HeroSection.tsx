import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-6 lg:px-8 pt-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-soft-xl opacity-60 animate-float blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-slate-100/50 to-indigo-100/50 rounded-soft-xl opacity-50 animate-gentle-float blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-soft-xl opacity-40 animate-blob" style={{ animationDelay: '4s' }}></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148, 163, 184) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Subtle Brand Mark */}
        <div className="mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-soft shadow-soft">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse-slow"></div>
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tight">
            <span className="text-slate-800">YouTube Video </span>
            <span className="block gradient-text-soft">Downloader</span>
          </h1>
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-600 mb-16 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Experience seamless video downloading with our elegant, fast, and secure solution. 
          Transform your favorite content into offline media effortlessly.
        </p>

        {/* Download Form */}
        <div className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white/70 backdrop-blur-xl rounded-soft-xl p-8 shadow-soft-xl border border-white/20 max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="relative flex-shrink-0">
                <select className="appearance-none px-6 py-4 border-0 rounded-soft-lg bg-slate-50/80 text-slate-700 font-medium shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-gentle pr-12 cursor-pointer">
                  <option value="MP4">MP4 Format</option>
                  <option value="MP3">MP3 Audio</option>
                  <option value="WEBM">WEBM Format</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <input
                type="url"
                placeholder="Paste your YouTube URL here..."
                className="flex-1 px-6 py-4 border-0 rounded-soft-lg bg-slate-50/80 text-slate-700 placeholder-slate-400 font-medium shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-gentle"
              />
              
              <button className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-soft-lg transition-gentle shadow-soft-lg btn-hover magnetic group">
                <span className="flex items-center space-x-2">
                  <span>Download</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'High-speed downloads' },
            { icon: '🛡️', title: 'Secure & Safe', desc: 'Your privacy protected' },
            { icon: '🎯', title: 'High Quality', desc: 'Best video resolution' }
          ].map((feature, index) => (
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
