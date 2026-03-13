'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CoinIcon } from './PixelArtIcons';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-greige focus:border-atomic-tangerine/40 focus:ring-1 focus:ring-atomic-tangerine/20 outline-none transition-colors text-sm';

const selectClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-atomic-tangerine/40 focus:ring-1 focus:ring-atomic-tangerine/20 outline-none transition-colors text-sm appearance-none';

export function GameOverForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    const fd = new FormData(e.currentTarget);
    const data = {
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      email: fd.get('email') as string,
      company: fd.get('company') as string,
      title: fd.get('title') as string,
      competitors: fd.get('competitors') as string,
      aiEngine: fd.get('aiEngine') as string,
      seedTopic: fd.get('seedTopic') as string,
    };

    try {
      const res = await fetch('/api/gameover-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to submit');
      }

      setFormState('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setFormState('error');
    }
  };

  return (
    <section id="enter-form" className="relative py-32 md:py-40 overflow-hidden">
      {/* Warm glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#120e0a] to-heart-of-darkness" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px]"
        style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
        animate={{ opacity: [0.06, 0.1, 0.06], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 section-wide max-w-2xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          {/* Pixel art controls flanking the label */}
          <div className="flex items-center justify-center gap-5 mb-6">
            <div style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }}>
              <CoinIcon size={7} />
            </div>
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px]">
              INSERT COIN
            </p>
            <div style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }}>
              <CoinIcon size={7} />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1] mb-6">
            Enter the <span className="font-extrabold">new game.</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="relative min-h-[400px]">
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {formState === 'success' && 'Entry submitted successfully.'}
              {formState === 'error' && `Error: ${errorMessage}`}
            </div>

            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
                    style={{
                      background: 'rgba(225, 255, 0, 0.1)',
                      boxShadow: '0 0 40px rgba(225, 255, 0, 0.2), 0 0 80px rgba(225, 255, 0, 0.1)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <svg className="w-10 h-10 text-neon-cactus" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <div className="flex items-center gap-4 mb-4">
                    <CoinIcon size={6} />
                    <p
                      className="font-arcade text-sm"
                      style={{ color: '#E1FF00', filter: 'drop-shadow(0 0 8px rgba(225,255,0,0.5))' }}
                    >
                      PLAYER 1 READY
                    </p>
                    <CoinIcon size={6} />
                  </div>
                  <p className="text-2xl font-bold text-white mb-3 tracking-tight">
                    You&apos;re in. Game on.
                  </p>
                  <p className="text-shroomy max-w-md leading-relaxed">
                    We&apos;ll follow up within 48 hours to schedule your 30-minute walkthrough. No strings. No bait-and-switch.
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="go-firstName" className="sr-only">First name</label>
                      <input id="go-firstName" type="text" name="firstName" required autoComplete="given-name" placeholder="First name" className={inputClass} disabled={formState === 'loading'} />
                    </div>
                    <div>
                      <label htmlFor="go-lastName" className="sr-only">Last name</label>
                      <input id="go-lastName" type="text" name="lastName" required autoComplete="family-name" placeholder="Last name" className={inputClass} disabled={formState === 'loading'} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="go-email" className="sr-only">Work email</label>
                    <input id="go-email" type="email" name="email" required autoComplete="email" placeholder="Work email" className={inputClass} disabled={formState === 'loading'} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="go-company" className="sr-only">Company name</label>
                      <input id="go-company" type="text" name="company" required autoComplete="organization" placeholder="Company name" className={inputClass} disabled={formState === 'loading'} />
                    </div>
                    <div>
                      <label htmlFor="go-title" className="sr-only">Title / Role</label>
                      <input id="go-title" type="text" name="title" required autoComplete="organization-title" placeholder="Title / Role" className={inputClass} disabled={formState === 'loading'} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="go-competitors" className="sr-only">Your top 3 competitors</label>
                    <input id="go-competitors" type="text" name="competitors" required placeholder="Your top 3 competitors (company names or URLs)" className={inputClass} disabled={formState === 'loading'} />
                  </div>

                  <div>
                    <label htmlFor="go-aiEngine" className="sr-only">Pick your AI engine</label>
                    <select id="go-aiEngine" name="aiEngine" required className={selectClass} disabled={formState === 'loading'} defaultValue="">
                      <option value="" disabled>Pick your preferred AI engine</option>
                      <option value="ChatGPT">ChatGPT</option>
                      <option value="Claude">Claude</option>
                      <option value="Perplexity">Perplexity</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="go-seedTopic" className="sr-only">Core buyer problem</label>
                    <textarea id="go-seedTopic" name="seedTopic" rows={3} required placeholder="What's the core problem your buyers are trying to solve that you want your solution known for?" className={`${inputClass} resize-none`} disabled={formState === 'loading'} />
                  </div>

                  {formState === 'error' && <p className="text-red-400 text-sm">{errorMessage}</p>}

                  <button
                    type="submit"
                    disabled={formState === 'loading'}
                    className="w-full px-6 py-4 bg-atomic-tangerine text-white font-bold rounded-lg hover:bg-hot-sauce transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    style={{ boxShadow: '0 0 30px rgba(255, 89, 16, 0.25), 0 0 60px rgba(255, 89, 16, 0.1)' }}
                    data-track-cta="gameover-form"
                    data-track-component="GameOverForm"
                    data-track-label="I'm in. Game on."
                  >
                    {formState === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        Submitting...
                      </span>
                    ) : (
                      "I'm in. Game on."
                    )}
                  </button>

                  <p className="text-xs text-greige text-center leading-relaxed pt-3">
                    We&apos;ll follow up within 48 hours to schedule your 30-minute walkthrough. No strings. No bait-and-switch. We built the systems to produce this in a day. Now we want to show you what that looks like with your data.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
