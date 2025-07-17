'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import en from '@/locales/en.json';
import id from '@/locales/id.json';

// Type assertion for the imported JSON files
const enTranslations = en as unknown as Translation;
const idTranslations = id as unknown as Translation;

type Language = 'en' | 'id';
type Translation = typeof en & {
  home: {
    title: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
    }>;
    faq: Array<{
      question: string;
      answer: string;
    }>;
  };

  instagram: {
    title: string;
    description: string;
    heroTitle: string;
    heroDescription: string;
    features: {
      photoTitle: string;
      photoDesc: string;
      videoTitle: string;
      videoDesc: string;
      reelsTitle: string;
      reelsDesc: string;
      storiesTitle: string;
      storiesDesc: string;
      privateTitle: string;
      privateDesc: string;
    };
    faq: {
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      q3: string;
      a3: string;
    };
  };
  tiktok: {
    title: string;
    description: string;
    heroTitle: string;
    heroDescription: string;
    features: {
      noWatermarkTitle: string;
      noWatermarkDesc: string;
      hdQualityTitle: string;
      hdQualityDesc: string;
      fastTitle: string;
      fastDesc: string;
      mobileFriendlyTitle: string;
      mobileFriendlyDesc: string;
      noRegistrationTitle: string;
      noRegistrationDesc: string;
    };
    faq: {
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      q3: string;
      a3: string;
    };
  };
  youtube: {
    title: string;
    description: string;
    heroTitle: string;
    heroDescription: string;
    features: {
      playlistTitle: string;
      playlistDesc: string;
      formatTitle: string;
      formatDesc: string;
      qualityTitle: string;
      qualityDesc: string;
      batchTitle: string;
      batchDesc: string;
      speedTitle: string;
      speedDesc: string;
    };
    faq: {
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      q3: string;
      a3: string;
    };
  };
  mindreplay: {
    title: string;
    description: string;
    heroTitle: string;
    heroDescription: string;
    features: {
      sessionsTitle: string;
      sessionsDesc: string;
      memoriesTitle: string;
      memoriesDesc: string;
      highQualityTitle: string;
      highQualityDesc: string;
      organizedTitle: string;
      organizedDesc: string;
      noInternetTitle: string;
      noInternetDesc: string;
    };
    faq: {
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      q3: string;
      a3: string;
    };
  };
  twitter: {
    title: string;
    description: string;
    heroTitle: string;
    heroDescription: string;
    placeholder: string;
    button: string;
    features: {
      videoTitle: string;
      videoDesc: string;
      imageTitle: string;
      imageDesc: string;
      fastTitle: string;
      fastDesc: string;
      mobileTitle: string;
      mobileDesc: string;
      trendingTitle: string;
      trendingDesc: string;
      noAccountTitle: string;
      noAccountDesc: string;
    };
    faq: {
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      q3: string;
      a3: string;
    };
  };
  common: {
    download: string;
    loading: string;
    error: string;
    success: string;
  };
  nav: {
    home: string;
    twitter: string;
    tiktok: string;
    instagram: string;
    youtube: string;
    mindreplay: string;
  };
  footer: {
    tagline: string;
    freeBadge: string;
    features: string;
    freeDownloads: string;
    noRegistration: string;
    highQuality: string;
    multiplePlatforms: string;
    support: string;
    helpCenter: string;
    contactUs: string;
    reportIssue: string;
    statusPage: string;
    supportedPlatforms: string;
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    systemStatus: string;
    privacy: string;
    terms: string;
    contact: string;
  };
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations] = useState<{ en: Translation; id: Translation }>({ 
    en: enTranslations, 
    id: idTranslations 
  });

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
