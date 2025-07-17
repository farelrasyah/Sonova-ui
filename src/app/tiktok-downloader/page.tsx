'use client';

import { FaDownload, FaPlay, FaMusic, FaHashtag, FaUserClock, FaMobileAlt } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import PageTemplate from '@/components/PageTemplate';

export default function TiktokDownloader() {
  const { t } = useLanguage();
  
  const features = [
    {
      title: t.tiktok.features.noWatermarkTitle,
      description: t.tiktok.features.noWatermarkDesc,
      icon: <FaPlay className="h-6 w-6 text-pink-500" />,
      gradient: 'from-pink-100 to-rose-100'
    },
    {
      title: t.tiktok.features.hdQualityTitle,
      description: t.tiktok.features.hdQualityDesc,
      icon: <FaMusic className="h-6 w-6 text-pink-500" />,
      gradient: 'from-purple-100 to-pink-100'
    },
    {
      title: t.tiktok.features.fastTitle,
      description: t.tiktok.features.fastDesc,
      icon: <FaDownload className="h-6 w-6 text-pink-500" />,
      gradient: 'from-rose-100 to-pink-100'
    },
    {
      title: t.tiktok.features.availabilityTitle,
      description: t.tiktok.features.availabilityDesc,
      icon: <FaUserClock className="h-6 w-6 text-pink-500" />,
      gradient: 'from-blue-100 to-indigo-100'
    },
    {
      title: t.tiktok.features.mobileFriendlyTitle,
      description: t.tiktok.features.mobileFriendlyDesc,
      icon: <FaMobileAlt className="h-6 w-6 text-pink-500" />,
      gradient: 'from-green-100 to-emerald-100'
    },
    {
      title: t.tiktok.features.trendingTitle,
      description: t.tiktok.features.trendingDesc,
      icon: <FaHashtag className="h-6 w-6 text-pink-500" />,
      gradient: 'from-fuchsia-100 to-purple-100'
    }
  ];

  const faqs = [
    {
      question: t.tiktok.faq.q1,
      answer: t.tiktok.faq.a1
    },
    {
      question: t.tiktok.faq.q2,
      answer: t.tiktok.faq.a2
    },
    {
      question: t.tiktok.faq.q3,
      answer: t.tiktok.faq.a3
    },
    {
      question: t.tiktok.faq.q4,
      answer: t.tiktok.faq.a4
    }
  ];

  return (
    <PageTemplate
      title={t.tiktok.title}
      description={t.tiktok.description}
      heroTitle={t.tiktok.heroTitle}
      heroDescription={t.tiktok.heroDescription}
      features={features}
      faqs={faqs}
    />
  );
}
