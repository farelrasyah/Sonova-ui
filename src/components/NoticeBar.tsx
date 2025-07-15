import React from 'react';

export default function NoticeBar() {
  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-8 px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(255, 255, 255) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-4 animate-fade-in-up">
          {/* Elegant Warning Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-soft shadow-soft-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          {/* Notice Content */}
          <div className="text-center">
            <p className="text-white font-medium text-sm md:text-base tracking-wide leading-relaxed">
              We respect copyright laws and do not support downloading copyrighted material
            </p>
            <div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mx-auto opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
