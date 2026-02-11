'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GradientText } from '@/components/AnimatedText';

const headlineWords = ['Everything', 'your', 'marketing'];
const headlineWords2 = ['needs.', 'Nothing', 'it', "doesn't."];

export function ServicesHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const forkProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fork SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-w-4xl opacity-[0.07]"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main stem */}
          <motion.path
            d="M 400 50 L 400 300"
            stroke="#FF5910"
            strokeWidth="2"
            style={{ pathLength: forkProgress }}
          />
          {/* Left branch - Strategic */}
          <motion.path
            d="M 400 300 Q 350 350 200 450"
            stroke="#FF5910"
            strokeWidth="2"
            style={{ pathLength: forkProgress }}
          />
          {/* Right branch - AI */}
          <motion.path
            d="M 400 300 Q 450 350 600 450"
            stroke="#088BA0"
            strokeWidth="2"
            style={{ pathLength: forkProgress }}
          />
        </svg>
      </div>

      <motion.div style={{ opacity }} className="relative z-10 section-wide text-center py-32 md:py-40">
        <motion.p
          className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          What We Do
        </motion.p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-white leading-[1] mb-6">
          {headlineWords.map((word, i) => (
            <motion.span
              key={word}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 40, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4 + i * 0.08,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          {headlineWords2.map((word, i) => (
            <motion.span
              key={word}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 40, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.7 + i * 0.08,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              {word === 'needs.' ? (
                <GradientText>{word}</GradientText>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-lg md:text-xl text-shroomy max-w-2xl mx-auto mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Strategic B2B marketing fundamentals and AI-native solutions —
          from a team that refuses to choose between proven and pioneering.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-2"
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
      </motion.div>
    </section>
  );
}
