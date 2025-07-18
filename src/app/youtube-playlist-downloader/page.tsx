'use client';

import { FaList, FaMusic, FaYoutube, FaMobileAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import PageTemplate from "@/components/PageTemplate";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export default function YoutubePlaylistDownloader() {
  const { t } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading state
  }
  
  // Icons and gradients that don't need translation
  const featureIcons = [
    <FaList key="list" className="h-6 w-6 text-red-500" />,
    <FaMusic key="music" className="h-6 w-6 text-red-500" />,
    <FaYoutube key="youtube" className="h-6 w-6 text-red-500" />,
    <FaMobileAlt key="mobile" className="h-6 w-6 text-red-500" />,
    <FaClock key="clock" className="h-6 w-6 text-red-500" />,
    <FaCheckCircle key="check" className="h-6 w-6 text-red-500" />
  ];
  
  const gradients = [
    'from-red-100 to-pink-100',
    'from-orange-100 to-amber-100',
    'from-yellow-100 to-orange-100',
    'from-blue-100 to-indigo-100',
    'from-purple-100 to-violet-100',
    'from-green-100 to-teal-100'
  ];

  // Map translated features with icons and gradients
  const features = (t.youtube?.features || []).map((feature: any, index: number) => ({
    title: feature.title,
    description: feature.description,
    icon: featureIcons[index % featureIcons.length],
    gradient: gradients[index % gradients.length]
  }));
  
  // Ensure we have all 6 features
  while (features.length < 6 && t.features?.default?.length > 0) {
    const defaultFeature = t.features.default[features.length % t.features.default.length];
    features.push({
      ...defaultFeature,
      icon: featureIcons[features.length % featureIcons.length],
      gradient: gradients[features.length % gradients.length]
    });
  }

  // Transform FAQ data to match the expected format
  const faqItems = t.youtube?.faq?.map((item: any) => ({
    question: item.question,
    answer: item.answer
  })) || [];

  return (
    <PageTemplate
      title={`${t.youtube?.title || 'YouTube Playlist Downloader'} | Download Full Playlists in HD`}
      description={t.youtube?.description || ''}
      heroTitle={t.youtube?.heroTitle || ''}
      heroDescription={t.youtube?.heroDescription || ''}
      features={features}
      faqs={faqItems}
    />
  );
}
