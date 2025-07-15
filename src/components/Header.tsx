import React, { useState } from 'react';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold">
              <span className="text-blue-900">loader</span>
              <span className="text-purple-600">.fo</span>
            </span>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
              YouTube Video Downloader
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
              4K Videos Downloader
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
              YouTube to MP3
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
              YouTube Playlist Downloader
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
              YouTube to WAV
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
              YouTube 1080P Downloader
            </a>
          </nav>

          {/* Right Side - Dark Mode Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full transition-all duration-200 text-sm flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <span>Dark</span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden text-gray-700 hover:text-blue-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
                YouTube Video Downloader
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
                4K Videos Downloader
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
                YouTube to MP3
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
                YouTube Playlist Downloader
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
                YouTube to WAV
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50">
                YouTube 1080P Downloader
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
