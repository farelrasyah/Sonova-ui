'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: { [key: string]: FAQItem[] } = {
  youtubeDownloader: [
    {
      question: "Are there any subscription plans, or is it free to use this product?",
      answer: "Our service is completely free to use. There are no subscription plans or hidden costs."
    },
    {
      question: "Can this downloader be used without providing personal information?",
      answer: "Yes, you can use our downloader without providing any personal information or creating an account."
    },
    {
      question: "Can this downloader be used without providing personal information?",
      answer: "Yes, you can use our downloader without providing any personal information or creating an account."
    },
    {
      question: "Can this downloader be used without providing personal information?",
      answer: "Yes, you can use our downloader without providing any personal information or creating an account."
    }
  ],
  loaderFo: [
    {
      question: "Are there any subscription plans, or is it free to use this product?",
      answer: "Our service is completely free to use. There are no subscription plans or hidden costs."
    },
    {
      question: "Can this downloader be used without providing personal information?",
      answer: "Yes, you can use our downloader without providing any personal information or creating an account."
    },
    {
      question: "Can this downloader be used without providing personal information?",
      answer: "Yes, you can use our downloader without providing any personal information or creating an account."
    },
    {
      question: "Can this downloader be used without providing personal information?",
      answer: "Yes, you can use our downloader without providing any personal information or creating an account."
    }
  ]
};

function FAQAccordion({ items, category }: { items: FAQItem[], category: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          {category === 'youtubeDownloader' ? 'YouTubeDownloader: FAQs' : 'loader.fo: FAQs'}
        </h3>
        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-xs font-bold">?</span>
        </div>
      </div>
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="text-gray-900 font-medium pr-4 text-sm">{item.question}</span>
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 text-xs font-bold">
                {openIndex === index ? '−' : '+'}
              </span>
            </div>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-3 text-gray-600 border-t border-gray-100 text-sm">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Title with Custom Underline */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h2 className="text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            {/* Custom Purple Underline */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          <FAQAccordion items={faqData.youtubeDownloader} category="youtubeDownloader" />
          <FAQAccordion items={faqData.loaderFo} category="loaderFo" />
        </div>
      </div>
    </section>
  );
}
