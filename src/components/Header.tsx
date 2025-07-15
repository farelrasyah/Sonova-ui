
import React, { useState } from 'react';


export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('YouTube Video Downloader');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    'YouTube Video Downloader',
    '4K Videos Downloader', 
    'YouTube to MP3',
    'YouTube Playlist Downloader',
    'YouTube to WAV',
    'YouTube 1080P Downloader'
  ];

  return (
    <>
    <header className="transition-all-300 header-elegant">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
        <div className="flex items-center animate-fade-in-left mr-8 lg:mr-12">
            <div className="relative">
              <span className="text-2xl font-bold tracking-tight">
                <span className="gradient-text-soft">Sonova</span>
              </span>
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full opacity-70"></div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-2 animate-fade-in-up">
            {menuItems.map((item, index) => (
              <a
                key={item}
                href="#"
                onClick={() => handleItemClick(item)}
                className={`relative px-4 py-3 text-sm font-medium transition-gentle rounded-soft group nav-item-soft ${
                  activeItem === item
                    ? 'text-slate-700 bg-slate-100/80 shadow-soft'
                    : 'text-slate-600 hover:text-slate-700 hover:bg-slate-50/60'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item}
                {activeItem === item && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 opacity-0 group-hover:opacity-100 transition-gentle rounded-soft -z-10"></div>
              </a>
            ))}
          </nav>

          {/* Right Side - Dark Mode Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4 animate-fade-in-right">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="relative bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 font-medium px-5 py-2.5 rounded-soft transition-gentle text-sm flex items-center space-x-2 shadow-soft btn-hover overflow-hidden"
            >
              <span>Dark</span>
              <div className="relative">
                <svg className="w-4 h-4 transition-gentle" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-soft text-slate-600 hover:text-slate-700 hover:bg-slate-50/60 transition-gentle"
            >
              <svg className="w-6 h-6 transition-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 border-t border-slate-200/40">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => handleItemClick(item)}
                  className={`relative px-5 py-3 text-sm font-medium transition-gentle rounded-soft ${
                    activeItem === item
                      ? 'text-slate-700 bg-slate-100/80 shadow-soft'
                      : 'text-slate-600 hover:text-slate-700 hover:bg-slate-50/60'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                  {activeItem === item && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-400 to-violet-400 rounded-full"></div>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
    {/* SupportPopup removed from Header, will be handled in FAQSection */}
    </>
  );
}
