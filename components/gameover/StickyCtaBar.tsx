'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero, hide when near the form
      const formEl = document.getElementById('enter-form');
      const formTop = formEl?.getBoundingClientRect().top ?? Infinity;
      const formBottom = formEl?.getBoundingClientRect().bottom ?? Infinity;
      const pastHero = window.scrollY > window.innerHeight * 0.8;
      const nearForm = formTop < window.innerHeight && formBottom > 0;
      setVisible(pastHero && !nearForm);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
          style={{ background: 'rgba(20, 18, 19, 0.92)', backdropFilter: 'blur(16px)' }}
        >
          <div className="section-wide flex items-center justify-between gap-4 py-3 px-6">
            <p className="text-xs sm:text-sm text-shroomy hidden sm:block">
              <span
                className="font-arcade text-[10px] mr-2"
                style={{ color: '#FF5910', filter: 'drop-shadow(0 0 4px rgba(255,89,16,0.4))' }}
              >
                GAME OVER.
              </span>
              Enter to win a free AI-Era Competitive Intelligence Assessment + 15 days of tool access.
            </p>
            <p className="text-xs text-shroomy sm:hidden">
              <span
                className="font-arcade text-[9px]"
                style={{ color: '#FF5910', filter: 'drop-shadow(0 0 4px rgba(255,89,16,0.4))' }}
              >
                GAME OVER.
              </span>{' '}
              Free CI assessment + tool access.
            </p>
            <a
              href="#enter-form"
              className="shrink-0 px-6 py-2.5 bg-atomic-tangerine text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-hot-sauce transition-all duration-300 whitespace-nowrap"
              style={{
                boxShadow: '0 0 20px rgba(255, 89, 16, 0.2)',
              }}
              data-track-cta="gameover-sticky"
              data-track-component="StickyCtaBar"
              data-track-label="I'm In"
            >
              I&apos;m In
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
