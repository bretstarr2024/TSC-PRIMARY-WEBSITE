'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/AnimatedText';

const ease: [number, number, number, number] = [0.25, 0.4, 0.25, 1];

export function PricingHero() {
  const line1 = ['We', "don\u2019t", 'sell', 'hours.'];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/6 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #ED0AD2 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 section-wide">
        <div className="max-w-5xl">
          <motion.p
            className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease }}
          >
            How We Work &amp; Pricing
          </motion.p>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] mb-8"
            style={{ perspective: '800px' }}
          >
            <span className="block">
              {line1.map((word, i) => (
                <motion.span
                  key={i}
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
              <motion.span
                initial={{ opacity: 0, y: 40, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, delay: 0.66, ease }}
              >
                <GradientText
                  from="from-atomic-tangerine"
                  via="via-neon-cactus"
                  to="to-tidal-wave"
                >
                  We sell growth.
                </GradientText>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-shroomy leading-relaxed max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease }}
          >
            Twenty-five years of B2B fundamentals. AI-native from day one. Senior talent
            on every engagement. This isn&apos;t an agency with an AI add-on. It&apos;s a
            fundamentally different model — built for this era, not adapted from the last one.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col items-center gap-2 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
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
