'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

const FroggerGame = dynamic(() => import('./FroggerGame').then(m => ({ default: m.FroggerGame })), { ssr: false });

const clientsRow1 = [
  'ADP', 'Oracle', 'SAP', 'ServiceNow', 'Thomson Reuters',
  'Bank of America', 'Equifax', 'Korn Ferry', 'Willis Towers Watson',
  'Aon', 'Randstad', 'Lyft', 'Zendesk', 'John Wiley & Sons',
  'Infor', 'Ceridian', 'Kronos', 'Ultimate Software', 'Paychex',
  'Insperity', 'Alight Solutions', 'Workhuman', 'O.C. Tanner',
  'PlanSource', 'Indeed', 'SeatGeek',
];

const clientsRow2 = [
  'ZipRecruiter', 'CareerBuilder', 'iCIMS', 'Jobvite', 'HireVue',
  'SmartRecruiters', 'Greenhouse', 'Checkr', 'HireRight', 'Coursera',
  'Udemy', 'MasterClass', 'Degreed', 'Instructure', 'Gusto',
  'SoFi', 'Fitbit', 'Headspace', 'Medallia', 'Culture Amp',
  'Virgin Pulse', 'Bright Horizons', 'Multiverse', 'DailyPay',
  'Cornerstone OnDemand', 'Bitwarden',
];

function MarqueeRow({
  clients,
  direction = 'left',
  duration = 60,
}: {
  clients: string[];
  direction?: 'left' | 'right';
  duration?: number;
}) {
  // Double the array for seamless loop
  const doubled = [...clients, ...clients];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-heart-of-darkness to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-heart-of-darkness to-transparent z-10" />

      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{
          x: direction === 'left'
            ? ['0%', '-50%']
            : ['-50%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration,
            ease: 'linear',
          },
        }}
      >
        {doubled.map((client, i) => (
          <span
            key={`${client}-${i}`}
            className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/10 text-sm text-shroomy whitespace-nowrap hover:border-atomic-tangerine/30 hover:text-white transition-colors duration-300"
          >
            {client}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ClientMarquee() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="section-wide mb-12">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            Clients
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            3,000+ B2B tech companies since 1999{' '}
            <span className="text-atomic-tangerine">(and counting)</span>
          </h2>
        </AnimatedSection>
      </div>

      <div className="relative" style={{ minHeight: playing ? 420 : undefined }}>
        {/* Normal marquee rows */}
        {!playing && (
          <div className="space-y-4">
            <MarqueeRow clients={clientsRow1} direction="left" duration={55} />
            <MarqueeRow clients={clientsRow2} direction="right" duration={65} />
          </div>
        )}

        {/* Frogger game overlay */}
        <AnimatePresence>
          {playing && (
            <motion.div
              className="relative w-full rounded-xl overflow-hidden border border-white/10"
              style={{ height: 420 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <FroggerGame onClose={() => setPlaying(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ocho play trigger */}
        {!playing && (
          <motion.button
            className="absolute -bottom-2 right-8 z-20 group"
            onClick={() => setPlaying(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            title="Play Frogger"
          >
            <motion.img
              src="/images/ocho-color.png"
              alt=""
              className="w-10 h-10 opacity-40 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 0 8px #ED0AD2)' }}
            />
          </motion.button>
        )}
      </div>
    </section>
  );
}
