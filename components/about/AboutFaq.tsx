'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { aboutFaqs } from '@/lib/schema/about-faq';

export function AboutFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-32">
      <div className="section-wide">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: heading */}
          <div>
            <AnimatedSection>
              <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
                FAQ
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Questions we get asked.{' '}
                <span className="text-atomic-tangerine">Straight answers.</span>
              </h2>
            </AnimatedSection>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              {aboutFaqs.map((faq, i) => (
                <AnimatedSection key={i} delay={i * 0.05}>
                  <div className="glass rounded-xl overflow-hidden">
                    <button
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      aria-expanded={openIndex === i}
                    >
                      <span className="text-white font-medium text-sm md:text-base">
                        {faq.question}
                      </span>
                      <motion.svg
                        className="w-5 h-5 text-greige shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: openIndex === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {openIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-5 text-shroomy text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
