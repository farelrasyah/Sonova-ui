'use client';

import { FaDownload, FaTwitter, FaVideo, FaImage, FaMobileAlt, FaHashtag, FaGlobe } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function TwitterDownloader() {
  const { t } = useLanguage();

  const features: Feature[] = [
    {
      title: t.twitter.features.videoTitle,
      description: t.twitter.features.videoDesc,
      icon: <FaVideo className="h-6 w-6 text-blue-400" />,
      gradient: 'from-blue-100 to-cyan-100'
    },
    {
      title: t.twitter.features.imageTitle,
      description: t.twitter.features.imageDesc,
      icon: <FaImage className="h-6 w-6 text-blue-400" />,
      gradient: 'from-green-100 to-emerald-100'
    },
    {
      title: t.twitter.features.fastTitle,
      description: t.twitter.features.fastDesc,
      icon: <FaDownload className="h-6 w-6 text-blue-400" />,
      gradient: 'from-purple-100 to-violet-100'
    },
    {
      title: t.twitter.features.mobileTitle,
      description: t.twitter.features.mobileDesc,
      icon: <FaMobileAlt className="h-6 w-6 text-blue-400" />,
      gradient: 'from-pink-100 to-rose-100'
    },
    {
      title: t.twitter.features.trendingTitle,
      description: t.twitter.features.trendingDesc,
      icon: <FaHashtag className="h-6 w-6 text-blue-400" />,
      gradient: 'from-amber-100 to-yellow-100'
    },
    {
      title: t.twitter.features.noAccountTitle,
      description: t.twitter.features.noAccountDesc,
      icon: <FaGlobe className="h-6 w-6 text-blue-400" />,
      gradient: 'from-indigo-100 to-blue-100'
    }
  ];

  const faqs: FAQ[] = [
    {
      question: t.twitter.faq.q1,
      answer: t.twitter.faq.a1
    },
    {
      question: t.twitter.faq.q2,
      answer: t.twitter.faq.a2
    },
    {
      question: t.twitter.faq.q3,
      answer: t.twitter.faq.a3
    },
    {
      question: t.twitter.faq.q4,
      answer: t.twitter.faq.a4
    }
  ];

  return (
    <PageTemplate
      title={t.twitter.title}
      description={t.twitter.description}
      heroTitle={t.twitter.heroTitle}
      heroDescription={t.twitter.heroDescription}
      features={features}
      faqs={faqs}
    />
  );
}
