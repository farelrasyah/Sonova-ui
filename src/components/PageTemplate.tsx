'use client';

import React from 'react';
import Head from 'next/head';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection, { FeatureCard } from './FeaturesSection';
import FAQSection from './FAQSection';

interface PageTemplateProps {
  title: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  features: FeatureCard[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  heroTitle,
  heroDescription,
  features,
  faqs,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      
      <Header />
      
      <main className="pt-16">
        <HeroSection 
          title={heroTitle}
          description={heroDescription}
        />
        
        <FeaturesSection features={features} />
        
        <FAQSection faqs={faqs} />
      </main>
      
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>© {new Date().getFullYear()} Sonova. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default PageTemplate;
