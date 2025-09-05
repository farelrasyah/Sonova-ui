import { FaDownload, FaHistory, FaClock, FaUserShield, FaMobileAlt, FaSearch, FaCloudDownloadAlt } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';

export default function MindReplayDownloader() {
  const features = [
    {
      title: 'AI-Powered Summarization',
      description: 'Get intelligent summaries of YouTube videos using advanced AI technology.',
      icon: <FaHistory className="h-6 w-6 text-purple-500" />,
      gradient: 'from-purple-100 to-indigo-100'
    },
    {
      title: 'Instant Processing',
      description: 'Paste a YouTube URL and get a comprehensive summary in seconds.',
      icon: <FaClock className="h-6 w-6 text-purple-500" />,
      gradient: 'from-violet-100 to-purple-100'
    },
    {
      title: 'Smart Analysis',
      description: 'AI analyzes video transcripts to extract key points, themes, and insights.',
      icon: <FaSearch className="h-6 w-6 text-purple-500" />,
      gradient: 'from-pink-100 to-rose-100'
    },
    {
      title: 'Cloud-Based AI',
      description: 'Powered by Google Gemini 1.5 Flash for fast and accurate summarization.',
      icon: <FaCloudDownloadAlt className="h-6 w-6 text-purple-500" />,
      gradient: 'from-indigo-100 to-blue-100'
    },
    {
      title: 'Multi-Language Support',
      description: 'Summarize videos in multiple languages with AI translation capabilities.',
      icon: <FaMobileAlt className="h-6 w-6 text-purple-500" />,
      gradient: 'from-blue-100 to-cyan-100'
    },
    {
      title: 'Privacy First',
      description: 'Your video URLs and summaries are processed securely with no data retention.',
      icon: <FaUserShield className="h-6 w-6 text-purple-500" />,
      gradient: 'from-cyan-100 to-teal-100'
    }
  ];

  const faqs = [
    {
      question: 'What is MindReplay AI Summarizer?',
      answer: 'MindReplay AI Summarizer uses Google Gemini 1.5 Flash to create intelligent summaries of YouTube videos from their transcripts.'
    },
    {
      question: 'How do I use the YouTube summarizer?',
      answer: 'Simply paste any YouTube video URL into the input field and click "Get Summary" to receive an AI-generated summary.'
    },
    {
      question: 'What languages are supported?',
      answer: 'The AI can summarize videos in multiple languages and provides summaries in English by default.'
    },
    {
      question: 'Is there a limit to video length?',
      answer: 'Videos of any length are supported, but very long videos may take slightly longer to process.'
    }
  ];

  return (
    <PageTemplate
      title="MindReplay AI YouTube Summarizer | Get Video Summaries with AI"
      description="Summarize YouTube videos instantly using AI. Paste a YouTube URL and get comprehensive summaries powered by Google Gemini."
      heroTitle="YouTube AI Summarizer"
      heroDescription="Get intelligent summaries of any YouTube video using advanced AI technology. Paste a URL and receive detailed insights in seconds."
      heroPlatform="mindreplay"
      features={features}
      faqs={faqs}
    />
  );
}
