import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

interface FeaturesSectionProps {
  features?: FeatureCard[];
}

const FeatureIcons = [
  <svg key="0" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>,
  <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="4" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
  </svg>,
  <svg key="5" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
];

const gradientClasses = [
  "from-blue-100 to-cyan-100",
  "from-green-100 to-emerald-100",
  "from-purple-100 to-pink-100",
  "from-indigo-100 to-blue-100",
  "from-orange-100 to-amber-100",
  "from-teal-100 to-cyan-100"
];

export default function FeaturesSection({ features: propFeatures }: FeaturesSectionProps) {
  const { t } = useLanguage();
  const features = propFeatures || t.features.default.map((feature, index) => ({
    ...feature,
    icon: FeatureIcons[index % FeatureIcons.length],
    gradient: gradientClasses[index % gradientClasses.length]
  }));
  return (
    <section className="bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-20 w-28 h-28 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-soft-xl blur-xl animate-gentle-float"></div>
        <div className="absolute bottom-40 right-20 w-36 h-36 bg-gradient-to-br from-slate-100/40 to-indigo-100/40 rounded-soft-xl blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block">
            <div className="mb-4">
              <span className="text-slate-500 text-lg font-light tracking-wide">{t.features?.sectionSubtitle || 'Why Choose Us'}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800 tracking-tight">
              {t.features?.sectionTitle?.replace('{highlight}', '') || 'What Makes Us '}
              <span className="gradient-text-soft">
                {t.features?.sectionTitle?.includes('{highlight}') ? 
                  t.features.sectionTitle.split('{highlight}')[1] : 'Special'}
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-slate-400 rounded-full mx-auto opacity-60"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-soft-xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>
              <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-soft-xl p-8 shadow-soft card-hover">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-soft-lg flex items-center justify-center text-slate-600 group-hover:scale-110 transition-gentle`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {feature.title}
                    </h3>
                    <div className="w-10 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="inline-block bg-white/60 backdrop-blur-xl border border-white/20 rounded-soft-xl p-8 shadow-soft-xl">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {t.features?.ctaTitle || 'Ready to Experience the Difference?'}
            </h3>
            <p className="text-slate-600 mb-6">
              {t.features?.ctaDescription || 'Join millions of users who trust Sonova for their video downloading needs.'}
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('download-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-soft-lg transition-gentle shadow-soft-lg btn-hover magnetic"
            >
              {t.features?.ctaButton || 'Get Started Now'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
