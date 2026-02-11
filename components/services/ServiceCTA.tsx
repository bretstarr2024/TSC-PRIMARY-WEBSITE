'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { MagneticButton } from '@/components/MagneticButton';

export function ServiceCTA() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#1a0e08] to-heart-of-darkness" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 section-wide text-center">
        <AnimatedSection>
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-white leading-[1] mb-8">
            Ready to build your<br />
            <span className="text-atomic-tangerine">marketing engine?</span>
          </h2>
          <p className="text-xl text-shroomy max-w-xl mx-auto mb-12 leading-relaxed">
            Whether you need strategic fundamentals, AI transformation, or both —
            let&apos;s figure out what moves the needle.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton href="https://cal.com/team/tsc/25-50" variant="primary" isExternal>
            Let&apos;s Talk!
          </MagneticButton>
        </AnimatedSection>
      </div>
    </section>
  );
}
