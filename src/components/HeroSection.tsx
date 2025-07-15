import React from 'react';

export default function HeroSection() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Small star icon */}
        <div className="mb-8">
          <svg className="w-6 h-6 text-purple-600 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>

        {/* Main Title with Custom Underline */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            <span className="text-gray-900">YouTube Video </span>
            <span className="text-gray-900 relative inline-block">
              Downloader
              {/* Custom Purple Underline - Thick marker stroke style */}
              <svg 
                className="absolute -bottom-1 left-0 w-full h-6" 
                viewBox="0 0 240 24" 
                fill="none"
                style={{ left: '-4px', width: 'calc(100% + 8px)' }}
              >
                <path 
                  d="M8 18 C12 16, 25 17, 45 18 C65 19, 85 17, 105 18 C125 19, 145 17, 165 18 C185 19, 205 17, 225 18 C230 18, 232 18, 232 18" 
                  stroke="#6366F1" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  fill="none"
                  opacity="0.9"
                />
                <path 
                  d="M8 18 C12 16.5, 25 17.2, 45 18.1 C65 18.8, 85 17.3, 105 18.2 C125 18.9, 145 17.1, 165 18.1 C185 18.7, 205 17.4, 225 18.1 C230 18.1, 232 18.1, 232 18.1" 
                  stroke="#4338CA" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none"
                  opacity="0.6"
                />
              </svg>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Try this unique tool for quick, hassle-free downloads from YouTube. 
          Transform your online video content into offline media via efficient downloading.
        </p>

        {/* Download Form */}
        <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto mb-16">
          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-gray-700 font-medium">
            <option value="MP4">MP4</option>
            <option value="MP3">MP3</option>
            <option value="WEBM">WEBM</option>
          </select>
          
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=K3Qzzggn--U"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-700 placeholder-gray-400"
          />
          
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
            Download
          </button>
        </div>

        {/* Floating Icons */}
        <div className="flex justify-center items-center gap-12">
          {/* Music Note Icon */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          </div>

          {/* Play Icon */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          {/* Cloud Download Icon */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.61 5.64 5.36 8.04 2.35 8.36 0 10.9 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
