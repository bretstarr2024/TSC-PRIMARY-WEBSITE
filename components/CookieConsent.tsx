'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONSENT_KEY = 'tsc-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already consented
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on initial load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[9990] glass rounded-xl p-5 border border-white/10"
          role="dialog"
          aria-label="Cookie consent"
        >
          <p className="text-sm text-shroomy mb-4 leading-relaxed">
            We track clicks to make this site better. Nothing creepy.{' '}
            <a href="/privacy" className="text-tidal-wave hover:text-white transition-colors underline">
              Privacy policy
            </a>
          </p>
          <div className="flex gap-3">
            <button
              onClick={accept}
              className="flex-1 px-4 py-2 bg-atomic-tangerine text-white text-sm font-medium rounded-lg hover:bg-hot-sauce transition-colors"
            >
              Cool
            </button>
            <button
              onClick={decline}
              className="flex-1 px-4 py-2 border border-white/20 text-white text-sm font-medium rounded-lg hover:border-white/40 transition-colors"
            >
              Nope
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
