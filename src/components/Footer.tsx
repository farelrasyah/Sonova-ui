import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-50 to-white py-16 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-32 w-20 h-20 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-soft-xl blur-xl animate-gentle-float"></div>
        <div className="absolute bottom-16 right-32 w-24 h-24 bg-gradient-to-br from-slate-100/30 to-indigo-100/30 rounded-soft-xl blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-soft-xl flex items-center justify-center shadow-soft">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold gradient-text-soft">Sonal</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 max-w-md">
              Fast, secure, and completely free video downloader. Download from YouTube, Facebook, TikTok, and more without any limitations.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-soft-xl p-4 shadow-soft">
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">100% Free Forever</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-slate-800 font-semibold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              Features
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-gentle flex items-center gap-2 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Free Downloads
              </a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-gentle flex items-center gap-2 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                No Registration
              </a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-gentle flex items-center gap-2 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                High Quality
              </a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-gentle flex items-center gap-2 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Multiple Platforms
              </a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h4 className="text-slate-800 font-semibold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              Support
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-gentle flex items-center gap-2 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Help Center
              </a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-gentle flex items-center gap-2 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Contact Us
              </a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-gentle flex items-center gap-2 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Report Issue
              </a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-gentle flex items-center gap-2 group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Status Page
              </a></li>
            </ul>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-center mb-8">
            <h4 className="text-slate-800 font-semibold mb-4">Supported Platforms</h4>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto opacity-60"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
              { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { name: 'TikTok', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
              { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' }
            ].map((platform, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-soft-xl p-4 hover:shadow-soft-lg transition-gentle group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-soft-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-500 transition-gentle">
                    <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-gentle" fill="currentColor" viewBox="0 0 24 24">
                      <path d={platform.icon} />
                    </svg>
                  </div>
                  <span className="text-slate-700 font-medium">{platform.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <p className="text-slate-600 text-sm">
                © 2024 Sonova. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-slate-500 hover:text-blue-600 transition-gentle text-sm">Privacy Policy</a>
                <a href="#" className="text-slate-500 hover:text-blue-600 transition-gentle text-sm">Terms of Service</a>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
