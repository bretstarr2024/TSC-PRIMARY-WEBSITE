'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Brand color rings — reused from 404 page
const rings = [
  { color: '#FF5910', size: 580, delay: 0 },
  { color: '#E1FF00', size: 660, delay: 0.1 },
  { color: '#73F5FF', size: 740, delay: 0.2 },
  { color: '#ED0AD2', size: 820, delay: 0.3 },
];

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-32 pb-20 overflow-hidden">
        {/* Background glow — slow rotating radial */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF5910 0%, #ED0AD2 25%, #73F5FF 50%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.12, 0.2, 0.12],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Glow rings — large, centered behind calendar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 820, height: 820 }}>
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
                border: `1.5px solid ${ring.color}`,
                boxShadow: `0 0 40px ${ring.color}30, inset 0 0 40px ${ring.color}15, 0 0 80px ${ring.color}15`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.99, 1.01, 0.99],
                rotate: [0, i % 2 === 0 ? 360 : -360],
              }}
              transition={{
                opacity: { duration: 4, repeat: Infinity, delay: ring.delay, ease: 'easeInOut' },
                scale: { duration: 5, repeat: Infinity, delay: ring.delay, ease: 'easeInOut' },
                rotate: { duration: 40 + i * 12, repeat: Infinity, ease: 'linear' },
              }}
            />
          ))}

          {/* Sparkles */}
          {[
            { x: 100, y: 150, color: '#E1FF00', delay: 0.5 },
            { x: 700, y: 200, color: '#73F5FF', delay: 0.8 },
            { x: 80, y: 600, color: '#ED0AD2', delay: 1.1 },
            { x: 720, y: 580, color: '#FF5910', delay: 0.7 },
            { x: 400, y: 50, color: '#FF5910', delay: 1.3 },
            { x: 380, y: 770, color: '#E1FF00', delay: 0.3 },
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
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: spark.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 section-wide">
          {/* Heading */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
              Let&apos;s Talk!
            </h1>
            <p className="text-lg text-shroomy max-w-lg mx-auto">
              Pick a time that works. We&apos;ll bring the strategy.
            </p>
          </motion.div>

          {/* Calendar + Melissa layout */}
          <motion.div
            className="relative max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Melissa floating photo — top right of calendar */}
            <motion.div
              className="absolute -top-8 -right-4 md:-right-20 z-20"
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div
                className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden"
                style={{
                  boxShadow: `
                    0 0 20px #FF591060,
                    0 0 40px #ED0AD230,
                    0 0 60px #73F5FF20
                  `,
                }}
              >
                <Image
                  src="/images/melissa.jpeg"
                  alt="Melissa"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                  style={{
                    filter: 'contrast(1.15) saturate(1.2) brightness(1.1)',
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #FF591015 0%, #ED0AD210 50%, #73F5FF10 100%)',
                    mixBlendMode: 'overlay',
                  }}
                />
              </div>
              {/* Glow ring around Melissa */}
              <motion.div
                className="absolute -inset-2 rounded-full pointer-events-none"
                style={{
                  border: '1.5px solid #FF5910',
                  boxShadow: '0 0 15px #FF591040',
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.98, 1.04, 0.98],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Name label */}
              <motion.p
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-atomic-tangerine whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Melissa
              </motion.p>
            </motion.div>

            {/* Calendar embed */}
            <div className="relative rounded-2xl overflow-hidden glass border border-white/10">
              {/* Glow behind the iframe */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, #FF591008 0%, transparent 60%)',
                }}
              />
              <iframe
                src="https://cal.com/team/tsc/25-50?embed=true&theme=dark"
                className="w-full border-0"
                style={{ height: 600, minHeight: 500 }}
                title="Book a meeting with The Starr Conspiracy"
                allow="payment"
              />
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
