import React from 'react';

type SupportPopupProps = {
  open: boolean;
  onClose: () => void;
};

export default function SupportPopup({ open, onClose }: SupportPopupProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 animate-fade-in">
      <div className="relative max-w-md w-full rounded-2xl shadow-xl border border-slate-100 bg-white/95 p-0 overflow-hidden animate-slide-up-soft transition-all duration-500">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white shadow p-1"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="p-0 flex flex-col items-center">
          {/* Avatar */}
          <div className="w-full flex flex-col items-center mt-8">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow mb-2">
              <svg fill="none" viewBox="0 0 24 24" className="w-16 h-16"><circle cx="12" cy="8" r="4" fill="#cbd5e1"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" fill="#cbd5e1"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mt-2">Farel Rasyah</h2>
            <span className="text-slate-500 font-medium text-sm mb-2">About Me</span>
          </div>
          <div className="px-8 pb-8 w-full flex flex-col items-center">
            <p className="text-slate-600 text-center max-w-md mb-6 text-base font-normal">
              I'm a student in software engineering with a strong focus on full-stack development for web and mobile platforms. I also develop Chrome extensions and enjoy creating practical tools that improve user experience and productivity.
            </p>
            <div className="w-full border-t border-slate-100 mb-6"></div>
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-md mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <span className="font-medium text-slate-700">Education</span>
              </div>
              <div className="text-slate-700 font-semibold">SMKN 4 MALANG</div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 12.414A8 8 0 1121 12c0 1.657-.672 3.157-1.757 4.243z"/><circle cx="12" cy="12" r="3"/></svg>
                <span className="font-medium text-slate-700">Location</span>
              </div>
              <div className="text-slate-700 font-semibold">Malang, Jawa Timur, Indonesia</div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 2H8a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z"/><path d="M12 18h.01"/></svg>
                <span className="font-medium text-slate-700">Email</span>
              </div>
              <div className="text-slate-700 font-semibold"><a href="mailto:farelrasyah87@gmail.com" className="text-blue-600 hover:underline">farelrasyah87@gmail.com</a></div>
            </div>
            {/* Buttons */}
            <div className="flex gap-3 mt-2">
              <a href="https://github.com/farelrasyah" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold shadow hover:bg-slate-100 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.422-.012 2.753 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" /></svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
