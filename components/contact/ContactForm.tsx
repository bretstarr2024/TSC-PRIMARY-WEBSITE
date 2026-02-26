'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormState = 'idle' | 'loading' | 'success' | 'error';

interface ContactFormProps {
  source?: string;
  ctaId?: string;
}

export function ContactForm({ source, ctaId }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string || undefined,
      source,
      ctaId,
    };

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to submit');
      }

      setFormState('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setFormState('error');
    }
  };

  return (
    <div className="relative min-h-[280px]">
      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <motion.div
            key="success"
            className="flex flex-col items-center justify-center text-center py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Checkmark */}
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{
                background: 'rgba(225, 255, 0, 0.1)',
                boxShadow: '0 0 30px rgba(225, 255, 0, 0.2), 0 0 60px rgba(225, 255, 0, 0.1)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <svg className="w-8 h-8 text-neon-cactus" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <p className="text-xl font-semibold text-white mb-2">Got it. We&apos;ll be in touch.</p>
            <p className="text-sm text-greige">
              In the meantime, explore our{' '}
              <a href="/insights" className="text-tidal-wave hover:text-white transition-colors">
                insights
              </a>.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label htmlFor="contact-name" className="sr-only">Your name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-greige focus:border-atomic-tangerine focus:ring-1 focus:ring-atomic-tangerine outline-none transition-colors text-sm"
                disabled={formState === 'loading'}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="sr-only">Email address</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-greige focus:border-atomic-tangerine focus:ring-1 focus:ring-atomic-tangerine outline-none transition-colors text-sm"
                disabled={formState === 'loading'}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={3}
                placeholder="What are you working on?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-greige focus:border-atomic-tangerine focus:ring-1 focus:ring-atomic-tangerine outline-none transition-colors text-sm resize-none"
                disabled={formState === 'loading'}
              />
            </div>

            {formState === 'error' && (
              <p className="text-red-400 text-sm">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={formState === 'loading'}
              className="w-full px-6 py-3 bg-atomic-tangerine text-white font-medium rounded-lg hover:bg-hot-sauce transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              data-track-cta="contact-form"
              data-track-component="ContactForm"
              data-track-label="Send it"
              data-track-destination="/api/lead"
            >
              {formState === 'loading' ? 'Sending...' : 'Send it'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
