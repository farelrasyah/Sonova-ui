'use client';

import { FaDownload, FaPlay, FaUserFriends, FaHeart, FaBolt, FaLayerGroup } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

// Map icon names to their corresponding components
const iconComponents: { [key: string]: React.ReactNode } = {
  play: <FaPlay className="h-6 w-6 text-indigo-500" />,
  heart: <FaHeart className="h-6 w-6 text-indigo-500" />,
  download: <FaDownload className="h-6 w-6 text-indigo-500" />,
  bolt: <FaBolt className="h-6 w-6 text-indigo-500" />,
  'layer-group': <FaLayerGroup className="h-6 w-6 text-indigo-500" />,
  'user-friends': <FaUserFriends className="h-6 w-6 text-indigo-500" />
};

// Gradient classes for the feature cards
const gradientClasses = [
  'from-blue-100 to-indigo-100',
  'from-pink-100 to-rose-100',
  'from-purple-100 to-indigo-100',
  'from-yellow-100 to-amber-100',
  'from-green-100 to-emerald-100',
  'from-cyan-100 to-blue-100'
];

export default function InstagramDownloader() {
  const { t } = useLanguage();
  
  // Transform features data to match the expected format
  const features = Array.isArray(t.instagram?.features) 
    ? t.instagram.features.map((feature: any, index: number) => ({
        title: feature.title || '',
        description: feature.description || '',
        icon: iconComponents[feature.icon] || null,
        gradient: gradientClasses[index % gradientClasses.length]
      }))
    : [];

  // Use FAQ data directly as it's already in the correct format
  const faqs = Array.isArray(t.instagram?.faq) ? t.instagram.faq : [];

  return (
    <PageTemplate
      title={`${t.instagram?.title} | Download Instagram Videos & Reels`}
      description={t.instagram?.description || ''}
      heroTitle={t.instagram?.heroTitle || ''}
      heroDescription={t.instagram?.heroDescription || ''}
      features={features}
      faqs={faqs}
    />
  );
}
