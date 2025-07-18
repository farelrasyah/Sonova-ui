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
      title: t.features.default[0].title,
      description: t.features.default[0].description,
      icon: <FaVideo className="h-6 w-6 text-blue-400" />,
      gradient: t.features.default[0].gradient
    },
    {
      title: t.features.default[1].title,
      description: t.features.default[1].description,
      icon: <FaImage className="h-6 w-6 text-blue-400" />,
      gradient: t.features.default[1].gradient
    },
    {
      title: t.features.default[2].title,
      description: t.features.default[2].description,
      icon: <FaDownload className="h-6 w-6 text-blue-400" />,
      gradient: t.features.default[2].gradient
    },
    {
      title: t.features.default[3].title,
      description: t.features.default[3].description,
      icon: <FaMobileAlt className="h-6 w-6 text-blue-400" />,
      gradient: t.features.default[3].gradient
    },
    {
      title: t.twitter.features.noAccountTitle,
      description: t.twitter.features.noAccountDesc,
      icon: <FaHashtag className="h-6 w-6 text-blue-400" />,
      gradient: 'from-amber-100 to-yellow-100'
    },
    {
      title: t.twitter.features.hdTitle,
      description: t.twitter.features.hdDesc,
      icon: <FaGlobe className="h-6 w-6 text-blue-400" />,
      gradient: 'from-indigo-100 to-blue-100'
    }
  ];

  // Transform FAQ object into array format expected by FAQSection
  const faqs: FAQ[] = [];
  
  // Add all available FAQ items (q1-a1, q2-a2, etc.)
  const twitterFaq = t.twitter.faq as Record<string, string>;
  let i = 1;
  while (twitterFaq[`q${i}`] && twitterFaq[`a${i}`]) {
    faqs.push({
      question: twitterFaq[`q${i}`],
      answer: twitterFaq[`a${i}`]
    });
    i++;
  }

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
