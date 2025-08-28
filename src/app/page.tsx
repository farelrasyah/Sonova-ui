'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import NoticeBar from '@/components/NoticeBar';
import AboutSection from '@/components/AboutSection';
import FAQSection from '@/components/FAQSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection 
          title={t.home.title}
          description={t.home.description}
          platform="youtube"
        />
        <NoticeBar />
        <AboutSection />
        <FeaturesSection features={t.home.features.map((feature, index) => ({
          title: feature.title,
          description: feature.description,
          gradient: [
            "from-blue-100 to-cyan-100",
            "from-purple-100 to-pink-100",
            "from-green-100 to-emerald-100"
          ][index % 3],
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {[
                // First icon - lightning bolt
                <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                // Second icon - shield check
                <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                // Third icon - video camera
                <path key="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              ][index % 3]}
            </svg>
          )
        }))} />
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
          <FAQSection faqs={t.home.faq.map(item => ({
            question: item.question,
            answer: item.answer
          }))} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
