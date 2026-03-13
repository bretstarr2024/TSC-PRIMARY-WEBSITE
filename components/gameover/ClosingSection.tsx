'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CoinIcon } from './PixelArtIcons';

export function ClosingSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#110d0e] to-heart-of-darkness" />

      {/* Subtle glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px]"
        style={{ background: 'radial-gradient(circle, #FF3333 0%, transparent 70%)' }}
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* CRT scanlines callback to hero */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 3px)',
        }}
      />

      <div className="relative z-10 section-wide text-center">
        <AnimatedSection>
          <div className="flex items-center justify-center gap-3 mb-8" style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }}>
            <CoinIcon size={6} />
            <CoinIcon size={6} />
            <CoinIcon size={6} />
            <CoinIcon size={6} />
            <CoinIcon size={6} />
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1] mb-8 max-w-4xl mx-auto">
            The old game is over.{' '}
            <span className="font-extrabold">The new one already started.</span>
          </h2>
          <p className="text-xl text-shroomy leading-relaxed max-w-2xl mx-auto mb-4">
            You can keep feeding quarters into a machine that was never going to pay out. Or you can see where you actually stand in the game that matters now.
          </p>
          <p className="text-lg text-white font-medium mb-12">
            30 seconds. Real prizes. No quarters required.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
