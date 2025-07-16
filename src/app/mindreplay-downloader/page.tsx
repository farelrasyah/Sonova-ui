import { FaDownload, FaHistory, FaClock, FaUserShield } from 'react-icons/fa';
import PageTemplate from '@/components/PageTemplate';

export default function MindReplayDownloader() {
  const features = [
    {
      title: 'Session Recording',
      description: 'Record and save your MindReplay sessions for future reference or sharing.',
      icon: <FaHistory className="h-6 w-6 text-purple-500" />,
      gradient: 'from-purple-100 to-indigo-100'
    },
    {
      title: 'Time-Stamped Notes',
      description: 'Access your time-stamped notes and highlights from any MindReplay session.',
      icon: <FaClock className="h-6 w-6 text-purple-500" />,
      gradient: 'from-violet-100 to-purple-100'
    },
    {
      title: 'Easy Export',
      description: 'Export your MindReplay sessions in various formats for easy sharing and archiving.',
      icon: <FaDownload className="h-6 w-6 text-purple-500" />,
      gradient: 'from-indigo-100 to-blue-100'
    },
    {
      title: 'Privacy First',
      description: 'Your MindReplay sessions are private and only accessible to you.',
      icon: <FaUserShield className="h-6 w-6 text-purple-500" />,
      gradient: 'from-blue-100 to-cyan-100'
    }
  ];

  const faqs = [
    {
      question: 'What is MindReplay?',
      answer: 'MindReplay is a powerful tool that helps you record, review, and relive your digital experiences with perfect recall.'
    },
    {
      question: 'How do I download my MindReplay sessions?',
      answer: 'Navigate to your MindReplay dashboard, select the session you want to download, and choose your preferred format for export.'
    },
    {
      question: 'What formats can I export my sessions in?',
      answer: 'MindReplay supports various formats including MP4 for video, PDF for notes, and JSON for data analysis.'
    },
    {
      question: 'Is there a limit to session length?',
      answer: 'You can record sessions of any length, but longer sessions will require more storage space.'
    }
  ];

  return (
    <PageTemplate
      title="MindReplay Downloader | Save & Export Your Sessions"
      description="Download and export your MindReplay sessions in various formats. Save your digital experiences for future reference."
      heroTitle="MindReplay Downloader"
      heroDescription="Capture, save, and relive your digital experiences with MindReplay. Download your sessions for offline access or sharing with others."
      features={features}
      faqs={faqs}
    />
  );
}
