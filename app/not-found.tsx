'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  // Brand color rings — stacked outward like Charlie's Angels poster glow
  const rings = [
    { color: '#FF5910', size: 280, delay: 0 },    // Atomic Tangerine (inner)
    { color: '#E1FF00', size: 340, delay: 0.1 },   // Neon Cactus
    { color: '#73F5FF', size: 400, delay: 0.2 },   // Tidal Wave
    { color: '#ED0AD2', size: 460, delay: 0.3 },   // Sprinkles (outer)
  ];

  const reducedMotion = useReducedMotion();

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center overflow-hidden">
        {/* Radial background glow */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #FF5910 0%, #ED0AD2 30%, #73F5FF 60%, transparent 70%)',
          }}
          animate={reducedMotion ? {} : {
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: reducedMotion ? 0 : Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 text-center px-4">
          {/* Photo with glow rings */}
          <div className="relative mx-auto mb-12" style={{ width: 460, height: 460 }}>
            {/* Animated glow rings */}
            {rings.map((ring, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: ring.size,
                  height: ring.size,
                  top: '50%',
                  left: '50%',
                  marginTop: -ring.size / 2,
                  marginLeft: -ring.size / 2,
                  border: `2px solid ${ring.color}`,
                  boxShadow: `0 0 30px ${ring.color}40, inset 0 0 30px ${ring.color}20, 0 0 60px ${ring.color}20`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={reducedMotion ? {} : {
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.98, 1.02, 0.98],
                  rotate: [0, i % 2 === 0 ? 360 : -360],
                }}
                transition={{
                  opacity: { duration: 3, repeat: reducedMotion ? 0 : Infinity, delay: ring.delay, ease: 'easeInOut' },
                  scale: { duration: 4, repeat: reducedMotion ? 0 : Infinity, delay: ring.delay, ease: 'easeInOut' },
                  rotate: { duration: 30 + i * 10, repeat: reducedMotion ? 0 : Infinity, ease: 'linear' },
                }}
              />
            ))}

            {/* Inner glow disc behind photo */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 240,
                height: 240,
                top: '50%',
                left: '50%',
                marginTop: -120,
                marginLeft: -120,
                background: 'radial-gradient(circle, #FF5910 0%, #ED0AD2 50%, transparent 70%)',
                filter: 'blur(40px)',
              }}
              animate={reducedMotion ? {} : {
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.15, 1],
              }}
              transition={{ duration: 4, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
            />

            {/* The photo — circular, 70s treatment */}
            <motion.div
              className="absolute rounded-full overflow-hidden"
              style={{
                width: 220,
                height: 220,
                top: '50%',
                left: '50%',
                marginTop: -110,
                marginLeft: -110,
                boxShadow: `
                  0 0 40px #FF591080,
                  0 0 80px #ED0AD240,
                  0 0 120px #73F5FF30
                `,
              }}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Image
                src="/images/melissa.jpeg"
                alt="Hi, Melissa!"
                width={220}
                height={220}
                className="object-cover w-full h-full"
                style={{
                  filter: 'contrast(1.2) saturate(1.3) brightness(1.1)',
                  mixBlendMode: 'screen',
                }}
                priority
              />
              {/* Warm overlay for 70s vibe */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #FF591020 0%, #ED0AD215 50%, #73F5FF10 100%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </motion.div>

            {/* Sparkle accents */}
            {[
              { x: 60, y: 80, color: '#E1FF00', delay: 0.5 },
              { x: 380, y: 120, color: '#73F5FF', delay: 0.8 },
              { x: 100, y: 360, color: '#ED0AD2', delay: 1.1 },
              { x: 350, y: 340, color: '#FF5910', delay: 0.7 },
            ].map((spark, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: spark.x,
                  top: spark.y,
                  backgroundColor: spark.color,
                  boxShadow: `0 0 10px ${spark.color}, 0 0 20px ${spark.color}80`,
                }}
                animate={reducedMotion ? {} : {
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: reducedMotion ? 0 : Infinity,
                  delay: spark.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Text */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4"
            style={{
              background: 'linear-gradient(135deg, #FF5910, #E1FF00, #73F5FF, #ED0AD2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Hi, Melissa!
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-shroomy mb-10 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            This page doesn&apos;t exist yet. But we&apos;re building fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 text-base font-medium text-white bg-atomic-tangerine rounded-lg hover:bg-hot-sauce transition-colors hover:no-underline"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
