'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { OchoTrigger } from '@/components/OchoTrigger';

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

// Lane colors matching Frogger lanes
const LANE_COLORS: Record<string, { border: string; fill: string; hood: string }> = {
  tangerine: { border: 'rgba(255,89,16,0.45)', fill: 'rgba(255,89,16,0.10)', hood: 'rgba(255,89,16,0.25)' },
  tidal:     { border: 'rgba(115,245,255,0.45)', fill: 'rgba(115,245,255,0.10)', hood: 'rgba(115,245,255,0.25)' },
};

function CarBadge({ name, color, facingRight }: { name: string; color: 'tangerine' | 'tidal'; facingRight: boolean }) {
  const c = LANE_COLORS[color];
  return (
    <span
      className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-bold text-shroomy hover:text-white transition-colors duration-300 group"
      style={{
        padding: '10px 28px',
        borderRadius: 6,
        border: `1.5px solid ${c.border}`,
        background: c.fill,
      }}
    >
      {/* Hood / bumper */}
      <span
        className="absolute top-0 bottom-0"
        style={{
          width: 10,
          background: c.hood,
          borderRadius: facingRight ? '0 5px 5px 0' : '5px 0 0 5px',
          ...(facingRight ? { right: 0 } : { left: 0 }),
        }}
      />
      {/* Windshield */}
      <span
        className="absolute"
        style={{
          width: 12,
          height: '42%',
          top: '29%',
          background: 'rgba(115,245,255,0.06)',
          border: '0.5px solid rgba(255,255,255,0.05)',
          ...(facingRight ? { right: 16 } : { left: 16 }),
        }}
      />
      {/* Headlights (front) */}
      <span
        className="absolute flex flex-col gap-1.5"
        style={{ ...(facingRight ? { right: -1 } : { left: -1 }), top: '50%', transform: 'translateY(-50%)' }}
      >
        <span className="block w-[3px] h-[3px] rounded-full bg-[#FFE066]" />
        <span className="block w-[3px] h-[3px] rounded-full bg-[#FFE066]" />
      </span>
      {/* Taillights (rear) */}
      <span
        className="absolute flex flex-col gap-1.5"
        style={{ ...(facingRight ? { left: 2 } : { right: 2 }), top: '50%', transform: 'translateY(-50%)' }}
      >
        <span className="block w-[2.5px] h-[2.5px] rounded-full bg-[#FF4444]" />
        <span className="block w-[2.5px] h-[2.5px] rounded-full bg-[#FF4444]" />
      </span>
      {/* Wheels */}
      <span
        className="absolute bottom-0 translate-y-1/2"
        style={{ left: '22%' }}
      >
        <span className="block w-[8px] h-[4px] rounded-t-full bg-[#1a1a1a]" />
      </span>
      <span
        className="absolute bottom-0 translate-y-1/2"
        style={{ right: '22%' }}
      >
        <span className="block w-[8px] h-[4px] rounded-t-full bg-[#1a1a1a]" />
      </span>
      {/* Client name */}
      <span className="relative z-10">{name}</span>
    </span>
  );
}

function MarqueeRow({
  clients,
  direction = 'left',
  duration = 60,
  color = 'tangerine',
}: {
  clients: string[];
  direction?: 'left' | 'right';
  duration?: number;
  color?: 'tangerine' | 'tidal';
}) {
  // Double the array for seamless loop
  const doubled = [...clients, ...clients];
  const facingRight = direction === 'right';

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
          <CarBadge
            key={`${client}-${i}`}
            name={client}
            color={color}
            facingRight={facingRight}
          />
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
            <MarqueeRow clients={clientsRow1} direction="left" duration={55} color="tangerine" />
            <MarqueeRow clients={clientsRow2} direction="right" duration={65} color="tidal" />
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

      </div>

      {/* Ocho play trigger — below client list, centered */}
      {!playing && (
        <OchoTrigger onClick={() => setPlaying(true)} delay={1.5} className="mt-8 mx-auto" />
      )}
    </section>
  );
}
