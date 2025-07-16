import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SupportPopupProps = {
  open: boolean;
  onClose: () => void;
};

export default function SupportPopup({ open, onClose }: SupportPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  // Animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { 
        duration: 0.2,
        ease: [0.4, 0, 1, 1] as const
      } 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1.0] as const
      } 
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1] as const
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            ref={popupRef}
            className="relative w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] my-4 mx-2 sm:mx-4 flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
            
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            
            <div className="relative p-4 sm:p-6 flex flex-col items-center w-full">
              {/* Avatar */}
              <motion.div 
                className="w-full flex flex-col items-center mt-6 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative mb-4 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                    <svg className="w-20 h-20 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  </div>
                </div>
                <motion.h2 
                  className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Farel Rasyah
                </motion.h2>
                <motion.span 
                  className="text-indigo-500 font-semibold text-base mb-3 tracking-wider"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  Full-Stack Developer
                </motion.span>
              </motion.div>
              
              <motion.div 
                className="px-4 pb-4 w-full flex flex-col items-center"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative w-full px-6 max-w-3xl mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-inner">
                    <p className="text-slate-800 text-center text-base leading-relaxed">
                      I&apos;m a passionate software engineering student specializing in full-stack development for web and mobile platforms. I love crafting elegant solutions and building practical tools that enhance user experience and productivity.
                    </p>
                  </div>
                </div>
                <div className="w-full border-t border-white/20 my-4 sm:my-6"></div>
                
                {/* Info Grid */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full px-4 sm:px-6 mb-4 max-w-4xl mx-auto"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <div className="flex items-start gap-3 p-4 bg-white/50 rounded-xl backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Education</p>
                      <p className="text-slate-800 font-semibold">SMKN 4 MALANG</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white/50 rounded-xl backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a7.999 7.999 0 01-11.314 0L6.343 7.757M17 12H7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Location</p>
                      <p className="text-slate-800 font-semibold">Malang, Indonesia</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-white/50 rounded-xl backdrop-blur-sm shadow-sm hover:shadow transition-all duration-300 md:col-span-2">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-500">Email</p>
                      <a 
                        href="mailto:farelrasyah87@gmail.com" 
                        className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200"
                      >
                        farelrasyah87@gmail.com
                      </a>
                    </div>
                  </div>
                </motion.div>
                
                {/* Buttons */}
                <motion.div 
                  className="flex flex-wrap justify-center gap-3 px-4 sm:px-6 mt-2 w-full max-w-3xl mx-auto"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.a 
                    href="https://github.com/farelrasyah" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
                    whileHover={{ 
                      y: -2,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.422-.012 2.753 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                    </svg>
                    <span>View GitHub</span>
                  </motion.a>
                  
                  <motion.a 
                    href="mailto:farelrasyah87@gmail.com" 
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 font-semibold shadow-lg hover:shadow-xl hover:bg-slate-50 hover:border-indigo-300 transition-all duration-300 group"
                    whileHover={{ 
                      y: -2,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Contact Me</span>
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Footer */}
            <motion.div 
              className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 py-3 px-4 sm:px-6 text-center rounded-b-2xl"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-sm text-slate-500">
                Ready to build something amazing together? Let&apos;s connect!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}