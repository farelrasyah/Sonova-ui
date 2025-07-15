import React from 'react';

export default function AboutSection() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Title with Custom Underline */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h2 className="text-5xl font-bold">
              <span className="text-gray-500 text-2xl font-normal">What is </span>
              <span className="text-gray-900">loader.fo</span>
            </h2>
            {/* Custom Purple Underline */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-lg text-gray-600 leading-relaxed">
            loader.fo is one of the most popular downloader tools on the internet. With this tool, 
            you can download and convert videos from almost anywhere on the internet; from YouTube, 
            Twitter, and Facebook to TikTok, OK.ru and everything in between. 
            Functionality-wise, it's very straightforward. The user is required to enter the page 
            URL in the "URL" field, choose the format, and click download.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Card */}
          <div className="bg-purple-600 text-white p-8 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 leading-tight">
                Experience Buffer-Free Entertainment with YouTube Video Downloader
              </h3>
              <p className="text-purple-100 leading-relaxed">
                Our advanced download mechanism ensures zero buffering, letting you enjoy your favorite content 
                seamlessly anytime, anywhere. Say goodbye to lags and interruptions!
              </p>
            </div>
            {/* Decorative circle */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
          </div>

          {/* Right Card */}
          <div className="bg-purple-600 text-white p-8 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 leading-tight">
                Your One-Stop Solution to YouTube Video Downloading
              </h3>
              <p className="text-purple-100 leading-relaxed">
                Tired of buffering? Want instant access to your videos offline? Look no further! 
                With loader.fo, enjoy high-speed downloads and versatile format options at your fingertips.
              </p>
            </div>
            {/* Decorative circle */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
