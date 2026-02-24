'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

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

      <div className="space-y-4">
        <MarqueeRow clients={clientsRow1} direction="left" duration={55} />
        <MarqueeRow clients={clientsRow2} direction="right" duration={65} />
      </div>
    </section>
  );
}
