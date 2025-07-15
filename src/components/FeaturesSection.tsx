import React from 'react';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: FeatureCard[] = [
  {
    title: "No Download Limit",
    description: "No restrictions on downloads anytime, anywhere, in any format with fast results.",
    icon: (
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    )
  },
  {
    title: "Downloads At No Cost",
    description: "Uses and will be free forever. No subscriptions, no membership, no hidden cost.",
    icon: (
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      </div>
    )
  },
  {
    title: "The Best Speeds",
    description: "Our high-speed servers ensure the fastest downloads in the shortest time.",
    icon: (
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    )
  },
  {
    title: "Easy to Use",
    description: "Just paste with YouTube URL and select format. Then click download. Done!",
    icon: (
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    )
  },
  {
    title: "No Need For Apps",
    description: "Online tool, no need for any software or app. Use directly from your browser.",
    icon: (
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      </div>
    )
  },
  {
    title: "Well Secured",
    description: "Your information is safe with us. We never gather or misuse any personal data.",
    icon: (
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
    )
  }
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Title with Custom Underline */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h2 className="text-4xl font-bold text-gray-900">
              What Makes Us Special
            </h2>
            {/* Custom Purple Underline */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="mb-6 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
