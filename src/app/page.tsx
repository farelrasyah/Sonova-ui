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
      <main>
        <HeroSection 
          title="Download YouTube Videos"
          description="Fast, secure, and free YouTube downloader. Save your favorite videos in MP4 or extract audio in MP3 format with just a few clicks."
        />
        <NoticeBar />
        <AboutSection />
        <FeaturesSection features={[
          {
            title: "No Download Limit",
            description: "Unlimited downloads anytime, anywhere. No restrictions, just pure freedom.",
            gradient: "from-blue-100 to-cyan-100",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )
          },
          {
            title: "Always Free",
            description: "Completely free forever. No subscriptions, no hidden costs, just pure value.",
            gradient: "from-green-100 to-emerald-100",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )
          },
          {
            title: "High Quality",
            description: "Download videos in HD quality or extract high-fidelity audio. Your choice, your quality.",
            gradient: "from-purple-100 to-violet-100",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            )
          },
          {
            title: "Fast & Easy",
            description: "Lightning-fast downloads with a simple interface. Just paste the link and download.",
            gradient: "from-amber-100 to-yellow-100",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )
          },
          {
            title: "No Watermark",
            description: "Get clean, watermark-free videos. Your downloads, your way.",
            gradient: "from-rose-100 to-pink-100",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )
          },
          {
            title: "24/7 Support",
            description: "Our team is always here to help you with any questions or issues.",
            gradient: "from-indigo-100 to-blue-100",
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          }
        ]} />
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">YouTube Video Downloader FAQs</h2>
          <FAQSection faqs={[
            {
              question: 'How to download YouTube videos?',
              answer: 'Simply paste the YouTube video URL in the input field above and click the download button. Select your preferred format (MP4 or MP3) and quality, then the download will start automatically.'
            },
            {
              question: 'Is it free to download videos?',
              answer: 'Yes, our YouTube video downloader is completely free to use with no hidden charges. You can download as many videos as you want without any limitations.'
            },
            {
              question: 'What video qualities are available?',
              answer: 'Our downloader supports various video qualities including 144p, 240p, 360p, 480p, 720p (HD), 1080p (Full HD), and 4K (when available from the source).'
            },
            {
              question: 'Can I download YouTube playlists?',
              answer: 'Yes, you can download entire YouTube playlists. Just paste the playlist URL and our system will process all the videos in the playlist.'
            },
            {
              question: 'Is it legal to download YouTube videos?',
              answer: 'Downloading videos from YouTube is against their Terms of Service. However, you can download videos for personal use or if you have the necessary rights or permissions from the content owner.'
            },
            {
              question: 'How to download YouTube videos on mobile?',
              answer: 'Our website is fully responsive and works on mobile devices. Just open our site in your mobile browser, paste the YouTube URL, and download the video as you would on a desktop.'
            }
          ]} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
