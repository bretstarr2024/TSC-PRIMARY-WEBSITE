'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Same Three.js star particles as the homepage
const HeroParticles = dynamic(
  () => import('@/components/home/HeroParticles').then((mod) => ({ default: mod.HeroParticles })),
  { ssr: false }
);

// Brand color rings — concentric behind calendar
const rings = [
  { color: '#FF5910', size: 580, delay: 0 },
  { color: '#E1FF00', size: 660, delay: 0.1 },
  { color: '#73F5FF', size: 740, delay: 0.2 },
  { color: '#ED0AD2', size: 820, delay: 0.3 },
];

// Team members for the rotating photo carousel
const teamMembers = [
  { name: 'Bret', image: '/images/Bret Headshot.jpg', initials: 'BS', color: '#FF5910' },
  { name: 'Melissa', image: '/images/melissa.jpeg', initials: 'M', color: '#E1FF00' },
  { name: 'JJ', image: '/images/JJ La Pata.jpeg', initials: 'JJ', color: '#73F5FF' },
  { name: 'Ocho', image: '/images/ocho-color.png', initials: 'O', color: '#ED0AD2' },
  { name: 'Dan', image: '/images/Dan McCarron.jpeg', initials: 'D', color: '#FFBDAE' },
  { name: 'Racheal', image: '/images/Racheal Bates.jpeg', initials: 'RB', color: '#088BA0' },
];

// Sparkle constellation around the photo
const photoSparkles = [
  { x: -12, y: -10, size: 3, color: '#E1FF00', delay: 0 },
  { x: 105, y: -8, size: 2.5, color: '#73F5FF', delay: 0.3 },
  { x: -8, y: 100, size: 2, color: '#ED0AD2', delay: 0.6 },
  { x: 108, y: 95, size: 2.5, color: '#FF5910', delay: 0.2 },
  { x: 50, y: -18, size: 2, color: '#FF5910', delay: 0.8 },
  { x: -16, y: 50, size: 3, color: '#73F5FF', delay: 0.5 },
  { x: 112, y: 50, size: 2, color: '#E1FF00', delay: 0.4 },
  { x: 50, y: 115, size: 2.5, color: '#ED0AD2', delay: 0.7 },
  { x: -5, y: 20, size: 1.5, color: '#FF5910', delay: 1.0 },
  { x: 100, y: 75, size: 1.5, color: '#E1FF00', delay: 0.9 },
];

function BookPageInner() {
  const reducedMotion = useReducedMotion();
  const calContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchParams = useSearchParams();
  const service = searchParams.get('service');

  // Build Cal.com URL with optional service context in notes (no internal tracking metadata)
  const calBaseUrl = 'https://cal.com/team/tsc/25-50?embed=true&theme=dark&layout=month_view';
  const calUrl = service
    ? `${calBaseUrl}&notes=${encodeURIComponent(`Interested in: ${service}`)}`
    : calBaseUrl;

  // Auto-rotate team members every 4 seconds
  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % teamMembers.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(advance, 4000);
    return () => clearInterval(interval);
  }, [advance]);

  const activeMember = teamMembers[activeIndex];

  // Listen for Cal.com embed resize messages — smooth CSS transition handles the animation
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (calContainerRef.current) {
        const data = e.data;
        if (data && typeof data === 'object') {
          const height =
            data.iframeHeight ||
            data?.data?.iframeHeight ||
            (data.type === 'CAL:iframe:resize' && data.data?.height);
          if (height && typeof height === 'number' && height > 300) {
            calContainerRef.current.style.height = `${height}px`;
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24 pb-20">
        {/* Three.js star particles — same as homepage */}
        <HeroParticles />

        {/* Background glow — slow rotating radial */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #FF5910 0%, #ED0AD2 25%, #73F5FF 50%, transparent 70%)',
          }}
          animate={reducedMotion ? {} : {
            scale: [1, 1.08, 1],
            opacity: [0.12, 0.2, 0.12],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: reducedMotion ? 0 : Infinity, ease: 'linear' }}
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
              animate={reducedMotion ? {} : {
                opacity: [0.3, 0.6, 0.3],
                scale: [0.99, 1.01, 0.99],
                rotate: [0, i % 2 === 0 ? 360 : -360],
              }}
              transition={{
                opacity: { duration: 4, repeat: reducedMotion ? 0 : Infinity, delay: ring.delay, ease: 'easeInOut' },
                scale: { duration: 5, repeat: reducedMotion ? 0 : Infinity, delay: ring.delay, ease: 'easeInOut' },
                rotate: { duration: 40 + i * 12, repeat: reducedMotion ? 0 : Infinity, ease: 'linear' },
              }}
            />
          ))}

          {/* Ambient sparkles around the rings */}
          {!reducedMotion && [
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
          {/* Calendar + Team Photo layout */}
          <motion.div
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Rotating team photo — top right of calendar */}
            <motion.div
              className="absolute -top-8 -right-4 md:-right-24 z-20"
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              {/* Sparkle constellation around photo */}
              <div className="relative w-24 h-24 md:w-28 md:h-28">
                {!reducedMotion && photoSparkles.map((spark, i) => (
                  <motion.div
                    key={`m-spark-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${spark.x}%`,
                      top: `${spark.y}%`,
                      width: spark.size,
                      height: spark.size,
                      backgroundColor: spark.color,
                      boxShadow: `0 0 8px ${spark.color}, 0 0 16px ${spark.color}90, 0 0 24px ${spark.color}40`,
                    }}
                    animate={{
                      opacity: [0, 1, 0.3, 1, 0],
                      scale: [0.3, 1.8, 0.8, 1.5, 0.3],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: spark.delay,
                      ease: 'easeInOut',
                    }}
                  />
                ))}

                {/* Photo / Placeholder */}
                <div
                  className="relative w-full h-full rounded-full overflow-hidden"
                  style={{
                    boxShadow: `
                      0 0 25px ${activeMember.color}70,
                      0 0 50px ${activeMember.color}40,
                      0 0 75px ${activeMember.color}25,
                      0 0 100px ${activeMember.color}15
                    `,
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      {activeMember.image ? (
                        <Image
                          src={activeMember.image}
                          alt={activeMember.name}
                          width={112}
                          height={112}
                          className="object-cover w-full h-full"
                          style={{
                            filter: 'contrast(1.15) saturate(1.2) brightness(1.1)',
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${activeMember.color}40, ${activeMember.color}15)`,
                          }}
                        >
                          {activeMember.initials}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${activeMember.color}15 0%, transparent 50%)`,
                      mixBlendMode: 'overlay',
                    }}
                  />
                </div>

                {/* Inner glow ring */}
                <motion.div
                  className="absolute -inset-1.5 rounded-full pointer-events-none"
                  style={{
                    border: `1.5px solid ${activeMember.color}`,
                    boxShadow: `0 0 20px ${activeMember.color}50, 0 0 40px ${activeMember.color}20`,
                  }}
                  animate={reducedMotion ? {} : {
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1.03, 0.98],
                  }}
                  transition={{ duration: 2, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                />

                {/* Outer glow ring */}
                <motion.div
                  className="absolute -inset-3.5 rounded-full pointer-events-none"
                  style={{
                    border: `1px solid ${activeMember.color}`,
                    boxShadow: `0 0 15px ${activeMember.color}30, 0 0 30px ${activeMember.color}15`,
                  }}
                  animate={reducedMotion ? {} : {
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1.02, 0.97, 1.02],
                    rotate: [0, 360],
                  }}
                  transition={{
                    opacity: { duration: 3, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut', delay: 0.5 },
                    scale: { duration: 4, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut', delay: 0.5 },
                    rotate: { duration: 20, repeat: reducedMotion ? 0 : Infinity, ease: 'linear' },
                  }}
                />

                {/* Name label */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeMember.name}
                    className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap"
                    style={{
                      color: activeMember.color,
                      textShadow: `0 0 10px ${activeMember.color}60`,
                    }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeMember.name}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Service context — shown when arriving from a service CTA */}
            {service && (
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-sm text-greige uppercase tracking-wider mb-1">You&apos;re interested in</p>
                <p className="text-lg font-semibold text-atomic-tangerine">{service}</p>
              </motion.div>
            )}

            {/* Calendar embed */}
            <div className="relative rounded-2xl glass border border-white/10" style={{ overflow: 'visible' }}>
              {/* Glow behind the iframe */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'radial-gradient(ellipse at center, #FF591008 0%, transparent 60%)',
                }}
              />
              <div
                ref={calContainerRef}
                className="rounded-2xl overflow-hidden"
                style={{ height: 700, transition: 'height 0.3s ease' }}
              >
                <iframe
                  src={calUrl}
                  className="w-full h-full border-0"
                  title="Book a meeting with The Starr Conspiracy"
                  allow="payment"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookPageContent() {
  return (
    <Suspense>
      <BookPageInner />
    </Suspense>
  );
}
