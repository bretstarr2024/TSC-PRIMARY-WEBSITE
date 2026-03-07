'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { AnimatedSection } from '@/components/AnimatedSection';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (reducedMotion) {
      setCount(value);
      return;
    }
    const duration = 2000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value, reducedMotion]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const stats = [
  { value: 25, suffix: '+', label: 'Years of B2B expertise' },
  { value: 500, suffix: 'M+', label: 'Defining moments' },
  { value: 3000, suffix: '+', label: 'B2B tech companies served' },
];

export function CredibilitySection() {
  return (
    <section className="relative py-32 md:py-40">
      <div className="section-wide">
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.15} className="text-center">
              <p className="text-6xl md:text-7xl font-extrabold text-white mb-3">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm uppercase tracking-wider">{stat.label}</p>
            </AnimatedSection>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Bret — visionary, bold, declarative */}
          <AnimatedSection>
            <div className="relative">
              <span className="text-8xl text-atomic-tangerine/80 font-serif leading-none">&ldquo;</span>
              <blockquote className="pt-3 pb-3 text-2xl md:text-3xl text-white font-normal leading-snug text-center">
                I wrote the book on brand, marketing, and sales fundamentals.
                Then we built the AI systems that make those fundamentals scale.
                That&apos;s not a pivot — that&apos;s the whole point.
              </blockquote>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-10 h-px bg-atomic-tangerine/60" />
                <p className="text-sm text-white">
                  <span className="font-bold">Bret Starr</span>
                  <span> · Founder</span>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
