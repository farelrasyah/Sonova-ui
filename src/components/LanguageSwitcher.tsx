'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-1"
      aria-label={language === 'en' ? 'Switch to Bahasa Indonesia' : 'Ganti ke English'}
    >
      <Globe className="h-5 w-5" />
      <span className="text-sm font-medium">{language === 'en' ? 'ID' : 'EN'}</span>
    </button>
  );
};

export default LanguageSwitcher;
