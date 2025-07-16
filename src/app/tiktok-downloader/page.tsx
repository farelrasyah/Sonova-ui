import { FaDownload, FaPlay, FaMusic, FaHashtag } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';

export default function TiktokDownloader() {
  const features = [
    {
      title: 'No Watermark',
      description: 'Download TikTok videos without the annoying watermark, just pure content.',
      icon: <FaPlay className="h-6 w-6 text-pink-500" />,
      gradient: 'from-pink-100 to-rose-100'
    },
    {
      title: 'High Quality',
      description: 'Get your TikTok videos in the highest available quality, up to 1080p HD.',
      icon: <FaMusic className="h-6 w-6 text-pink-500" />,
      gradient: 'from-purple-100 to-pink-100'
    },
    {
      title: 'Fast Downloads',
      description: 'Quickly download TikTok videos with our high-speed servers.',
      icon: <FaDownload className="h-6 w-6 text-pink-500" />,
      gradient: 'from-rose-100 to-pink-100'
    },
    {
      title: 'Trending Hashtags',
      description: 'Discover and download videos from trending hashtags.',
      icon: <FaHashtag className="h-6 w-6 text-pink-500" />,
      gradient: 'from-fuchsia-100 to-purple-100'
    }
  ];

  const faqs = [
    {
      question: 'How to download TikTok videos without watermark?',
      answer: 'Simply paste the TikTok video URL into our downloader and click the download button. We\'ll provide you with a watermark-free version.'
    },
    {
      question: 'Is it legal to download TikTok videos?',
      answer: 'Downloading videos for personal use is generally acceptable, but please respect copyright and the original creator\'s rights.'
    },
    {
      question: 'Can I download private TikTok videos?',
      answer: 'No, we only support downloading public TikTok videos.'
    },
    {
      question: 'What devices are supported?',
      answer: 'Our TikTok downloader works on all devices including smartphones, tablets, and computers.'
    }
  ];

  return (
    <PageTemplate
      title="TikTok Video Downloader | No Watermark HD Videos"
      description="Download TikTok videos without watermark in HD quality. Fast, free, and easy to use TikTok downloader."
      heroTitle="TikTok Video Downloader"
      heroDescription="Download TikTok videos without watermark in high quality. Save your favorite TikTok videos to watch offline anytime, anywhere!"
      features={features}
      faqs={faqs}
    />
  );
}
