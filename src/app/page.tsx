'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import NoticeBar from '@/components/NoticeBar';
import AboutSection from '@/components/AboutSection';
import FAQSection from '@/components/FAQSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <NoticeBar />
      <AboutSection />
      <FAQSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
