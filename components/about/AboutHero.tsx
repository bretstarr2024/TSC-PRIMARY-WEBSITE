'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/AnimatedText';

const ease: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

export function AboutHero() {
  const line1 = ['The', 'B2B', 'marketing', 'agency'];
  const line2 = ['where', 'fundamentals', 'meet'];
  const line3 = ['AI', 'transformation.'];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 section-wide">
        <div className="max-w-5xl">
          {/* Answer capsule for AEO */}
          <motion.p
            className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease }}
          >
            About The Starr Conspiracy
          </motion.p>

          {/* H1 with word-by-word animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] mb-8"
              style={{ perspective: '800px' }}
          >
            <span className="block">
              {line1.map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {line2.map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.7, delay: 0.62 + i * 0.08, ease }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {line3.map((word, i) => (
                <motion.span
                  key={word}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.7, delay: 0.86 + i * 0.08, ease }}
                >
                  {i === 0 ? <GradientText>{word}</GradientText> : word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* AEO answer capsule */}
          <motion.p
            className="text-lg md:text-xl text-shroomy leading-relaxed max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease }}
          >
            The Starr Conspiracy is a strategic B2B marketing agency founded in 1999,
            combining 25+ years of marketing fundamentals with AI-native capabilities
            to help over 3,000 technology companies grow, differentiate, and win.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-2 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span className="text-xs text-greige uppercase tracking-wider">Explore</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-atomic-tangerine to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
