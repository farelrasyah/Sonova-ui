'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  const menuItems = [
    { name: 'YouTube Video Downloader', path: '/' },
    { name: 'YouTube Playlist', path: '/youtube-playlist-downloader' },
    { name: 'Instagram', path: '/instagram-downloader' },
    { name: 'TikTok', path: '/tiktok-downloader' },
    { name: 'Twitter', path: '/twitter-downloader' },
    { name: 'MindReplay', path: '/mindreplay-downloader' }
  ];

  // Get active item based on current path
  const activeItem = menuItems.find(item => item.path === pathname)?.name || menuItems[0].name;

  // Handle dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header className="transition-all-300 header-elegant bg-white shadow-sm dark:bg-gray-900 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center animate-fade-in-left mr-8 lg:mr-12">
            <div className="relative">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-2xl font-bold tracking-tight focus:outline-none"
              >
                <span className="gradient-text-soft">Sonova</span>
              </button>
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full opacity-70"></div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-2 animate-fade-in-up">
            {menuItems.map((item, index) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`relative px-4 py-3 text-sm font-medium transition-gentle rounded-soft group nav-item-soft ${
                  activeItem === item.name
                    ? 'text-slate-700 dark:text-white bg-slate-100/80 dark:bg-gray-800 shadow-soft'
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50/60 dark:hover:bg-gray-800/60'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name}
                {activeItem === item.name && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 opacity-0 group-hover:opacity-100 transition-gentle rounded-soft -z-10"></div>
              </button>
            ))}
          </nav>

          {/* Right Side - Dark Mode Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4 animate-fade-in-right">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="relative bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 text-slate-700 dark:text-gray-200 font-medium px-5 py-2.5 rounded-soft transition-gentle text-sm flex items-center space-x-2 shadow-soft btn-hover overflow-hidden"
            >
              <span>{isDarkMode ? 'Light' : 'Dark'}</span>
              <div className="relative">
                <svg className="w-4 h-4 transition-gentle" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-soft text-slate-600 dark:text-gray-300 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50/60 dark:hover:bg-gray-800/60 transition-gentle"
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
          <div className="py-4 border-t border-slate-200/40 dark:border-gray-700/40">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative px-5 py-3 text-sm font-medium transition-gentle rounded-soft text-left ${
                    activeItem === item.name
                      ? 'text-slate-700 dark:text-white bg-slate-100/80 dark:bg-gray-800 shadow-soft'
                      : 'text-slate-600 dark:text-gray-300 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50/60 dark:hover:bg-gray-800/60'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name}
                  {activeItem === item.name && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-400 to-violet-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
