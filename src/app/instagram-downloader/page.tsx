import { FaDownload, FaPlay, FaUserFriends, FaHeart } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';

export default function InstagramDownloader() {
  const features = [
    {
      title: 'High-Quality Downloads',
      description: 'Download Instagram videos in the highest available quality, including HD and 4K where available.',
      icon: <FaPlay className="h-6 w-6 text-indigo-500" />,
      gradient: 'from-blue-100 to-indigo-100'
    },
    {
      title: 'No Watermarks',
      description: 'Get clean, watermark-free videos from Instagram with just one click.',
      icon: <FaHeart className="h-6 w-6 text-indigo-500" />,
      gradient: 'from-pink-100 to-rose-100'
    },
    {
      title: 'Multiple Format Support',
      description: 'Download in various formats including MP4, AVI, and more to suit your needs.',
      icon: <FaDownload className="h-6 w-6 text-indigo-500" />,
      gradient: 'from-purple-100 to-indigo-100'
    },
    {
      title: 'Private Accounts',
      description: 'Download from public profiles with ease. Note: We respect privacy and only support downloads from public accounts.',
      icon: <FaUserFriends className="h-6 w-6 text-indigo-500" />,
      gradient: 'from-cyan-100 to-blue-100'
    }
  ];

  const faqs = [
    {
      question: 'How do I download Instagram videos?',
      answer: 'Simply paste the Instagram video URL into our downloader and click the download button. The video will be processed and ready to save to your device.'
    },
    {
      question: 'Is it free to download Instagram videos?',
      answer: 'Yes, our Instagram video downloader is completely free to use with no hidden charges.'
    },
    {
      question: 'Can I download videos from private Instagram accounts?',
      answer: 'No, we respect user privacy and only support downloads from public Instagram accounts.'
    },
    {
      question: 'What video qualities are available for download?',
      answer: 'You can download videos in various qualities, including the original quality posted on Instagram.'
    }
  ];

  return (
    <PageTemplate
      title="Instagram Video Downloader | Download Instagram Videos & Reels"
      description="Download Instagram videos, reels, and IGTV in high quality. Fast, free, and easy to use Instagram video downloader."
      heroTitle="Instagram Video Downloader"
      heroDescription="Download Instagram videos, reels, and IGTV in the highest quality. No registration required - save your favorite Instagram content with just one click!"
      features={features}
      faqs={faqs}
    />
  );
}
