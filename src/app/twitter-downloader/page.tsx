import { FaDownload, FaTwitter, FaVideo, FaImage } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';

export default function TwitterDownloader() {
  const features = [
    {
      title: 'Video Downloader',
      description: 'Download videos from Twitter in high quality with just one click.',
      icon: <FaVideo className="h-6 w-6 text-blue-400" />
    },
    {
      title: 'Image Downloader',
      description: 'Save images from tweets in their original quality.',
      icon: <FaImage className="h-6 w-6 text-blue-400" />
    },
    {
      title: 'Fast & Easy',
      description: 'Quickly download Twitter media without any complicated steps.',
      icon: <FaDownload className="h-6 w-6 text-blue-400" />
    },
    {
      title: 'No Registration',
      description: 'Download Twitter content without needing to create an account or log in.',
      icon: <FaTwitter className="h-6 w-6 text-blue-400" />
    }
  ];

  const faqs = [
    {
      question: 'How do I download videos from Twitter?',
      answer: 'Copy the URL of the tweet containing the video and paste it into our downloader. Click download and save the video to your device.'
    },
    {
      question: 'Can I download videos from private Twitter accounts?',
      answer: 'No, you can only download videos from public Twitter accounts.'
    },
    {
      question: 'What video formats are supported?',
      answer: 'Our downloader supports MP4 format, which is compatible with most devices and media players.'
    },
    {
      question: 'Is there a limit to the video length I can download?',
      answer: 'You can download videos of any length, but longer videos may take more time to process.'
    }
  ];

  return (
    <PageTemplate
      title="Twitter Video Downloader | Download Twitter Videos & GIFs"
      description="Download videos, GIFs, and images from Twitter in high quality. Fast, free, and easy to use Twitter downloader."
      heroTitle="Twitter Video Downloader"
      heroDescription="Download videos, GIFs, and images from Twitter with ease. Save your favorite Twitter content to watch or share offline."
      features={features}
      faqs={faqs}
    />
  );
}
