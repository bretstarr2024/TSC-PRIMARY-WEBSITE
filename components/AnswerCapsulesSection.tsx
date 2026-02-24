'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import type { AnswerCapsule } from '@/lib/services-data';

interface AnswerCapsulesSectionProps {
  capsules: AnswerCapsule[];
  accentColor: string;
  label?: string;
  heading: React.ReactNode;
  subheading?: string;
}

export function AnswerCapsulesSection({
  capsules,
  accentColor,
  label = 'Buyer Questions',
  heading,
  subheading = 'Straight answers to the questions B2B marketing leaders ask before choosing a partner.',
}: AnswerCapsulesSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-32">
      <div className="section-wide">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: heading */}
          <div>
            <AnimatedSection>
              <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
                {label}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {heading}
              </h2>
              {subheading && (
                <p className="mt-4 text-shroomy text-sm leading-relaxed">
                  {subheading}
                </p>
              )}
            </AnimatedSection>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              {capsules.map((capsule, i) => (
                <AnimatedSection key={i} delay={i * 0.05}>
                  <div className="glass rounded-xl overflow-hidden">
                    <button
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    >
                      <span className="text-white font-medium text-sm md:text-base">
                        {capsule.question}
                      </span>
                      <motion.svg
                        className="w-5 h-5 shrink-0"
                        style={{ color: accentColor }}
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
                            {capsule.answer}
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
