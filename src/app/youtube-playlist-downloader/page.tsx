import { FaDownload, FaList, FaMusic, FaYoutube } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';

export default function YoutubePlaylistDownloader() {
  const features = [
    {
      title: 'Entire Playlist Download',
      description: 'Download complete YouTube playlists with a single click, saving you time and effort.',
      icon: <FaList className="h-6 w-6 text-red-500" />,
      gradient: 'from-red-100 to-pink-100'
    },
    {
      title: 'Multiple Formats',
      description: 'Choose from various formats including MP4, MP3, and more to suit your needs.',
      icon: <FaMusic className="h-6 w-6 text-red-500" />,
      gradient: 'from-orange-100 to-amber-100'
    },
    {
      title: 'High Quality',
      description: 'Download videos in up to 4K quality or extract high-quality audio.',
      icon: <FaYoutube className="h-6 w-6 text-red-500" />,
      gradient: 'from-yellow-100 to-orange-100'
    },
    {
      title: 'Batch Download',
      description: 'Download multiple videos from a playlist simultaneously for faster results.',
      icon: <FaDownload className="h-6 w-6 text-red-500" />,
      gradient: 'from-green-100 to-teal-100'
    }
  ];

  const faqs = [
    {
      question: 'How do I download a YouTube playlist?',
      answer: 'Simply paste the YouTube playlist URL into our downloader, select your preferred format and quality, then click download.'
    },
    {
      question: 'Can I download private or unlisted playlists?',
      answer: 'No, our downloader only works with public YouTube playlists.'
    },
    {
      question: 'What video qualities are available?',
      answer: 'You can download videos in various qualities from 144p up to 4K, depending on the original video quality.'
    },
    {
      question: 'Is there a limit to the playlist size?',
      answer: 'You can download playlists of any size, but very large playlists may take longer to process.'
    }
  ];

  return (
    <PageTemplate
      title="YouTube Playlist Downloader | Download Full Playlists in HD"
      description="Download complete YouTube playlists in high quality. Save entire playlists as MP4 or MP3 with our fast and free downloader."
      heroTitle="YouTube Playlist Downloader"
      heroDescription="Download complete YouTube playlists with ease. Save entire music collections, tutorials, or any playlist in your preferred format and quality."
      features={features}
      faqs={faqs}
    />
  );
}
