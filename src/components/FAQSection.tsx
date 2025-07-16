'use client';

import React, { useState } from 'react';
import SupportPopup from './SupportPopup';

interface FAQItem {
  question: string;
  answer: string;
}

// FAQ data is now passed as a prop

function FAQAccordion({ items, title }: { items: FAQItem[], title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-soft-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          {title}
        </h3>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="group">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-soft-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-gentle">
            <button
              className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/50 transition-gentle"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-slate-800 font-medium pr-4 flex-1">{item.question}</span>
              <div className={`w-10 h-10 rounded-soft-lg flex items-center justify-center transition-gentle flex-shrink-0 ${
                openIndex === index ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-slate-100'
              }`}>
                <svg 
                  className={`w-5 h-5 transition-gentle ${
                    openIndex === index ? 'text-white rotate-45' : 'text-slate-600'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </button>
            <div className={`transition-all duration-500 ease-out ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}>
              <div className="px-8 pb-6 border-t border-white/20">
                <div className="pt-6 text-slate-600 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface FAQSectionProps {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export default function FAQSection({ faqs = [] }: FAQSectionProps) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  return (
    <>
      <section className="bg-gradient-to-b from-white via-slate-50/30 to-white py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 left-16 w-24 h-24 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-soft-xl blur-xl animate-gentle-float"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-slate-100/30 to-indigo-100/30 rounded-soft-xl blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block">
            <div className="mb-4">
              <span className="text-slate-500 text-lg font-light tracking-wide">Get Answers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 tracking-tight">
              Frequently Asked <span className="gradient-text-soft">Questions</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 rounded-full mx-auto opacity-60"></div>
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-fade-in-left w-full" style={{ animationDelay: '0.2s' }}>
            {faqs.length > 0 ? (
              <FAQAccordion items={faqs} title="Frequently Asked Questions" />
            ) : (
              <div className="text-center py-8 text-slate-500">
                No FAQs available at the moment.
              </div>
            )}
          </div>
        </div>

        {/* Bottom About Section */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="inline-block bg-white/60 backdrop-blur-xl border border-white/20 rounded-soft-xl p-8 shadow-soft-xl">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Want to know more about me?
            </h3>
            <p className="text-slate-600 mb-6">
              Learn more about the team behind Sonova and our mission.
            </p>
            <button
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-soft-lg transition-gentle shadow-soft-lg btn-hover magnetic"
              onClick={() => setIsSupportOpen(true)}
            >
              About Me
            </button>
          </div>
        </div>
      </div>
    </section>
    <SupportPopup open={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  );
}
