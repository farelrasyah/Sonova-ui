import React from 'react';

export default function NoticeBar() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Elegant Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-8 left-20 w-24 h-24 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl animate-gentle-float"></div>
        <div className="absolute bottom-8 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-12 right-32 w-20 h-20 bg-gradient-to-br from-slate-200/25 to-indigo-200/25 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative">
          {/* Soft Container with Subtle Definition */}
          <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-gentle animate-fade-in-up">
            <div className="flex items-center justify-center gap-6 flex-wrap">
           
              
              {/* Content */}
              <div className="text-center flex-1">
                <div className="mb-2">
                  <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase opacity-80">
                    Important Notice
                  </span>
                </div>
                <p className="text-slate-700 font-medium text-base md:text-lg leading-relaxed">
                  We respect copyright laws and do not support downloading copyrighted material
                </p>
                
                {/* Decorative Elements */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full"></div>
                  <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Accent Elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}
