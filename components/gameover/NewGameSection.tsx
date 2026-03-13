'use client';

import { motion } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { TrophyIcon, StarIcon, DiamondIcon, DpadIcon } from './PixelArtIcons';
import { ReactNode } from 'react';

const capabilities: { accent: string; label: string; title: string; body: string; footnote: string; icon: ReactNode }[] = [
  {
    accent: '#E1FF00',
    label: 'STRATEGIC GTM KERNEL',
    title: 'Machine-readable strategy.',
    body: 'Your entire GTM foundation, structured as machine-readable data. Brand, messaging, ICP, competitive positioning, offerings, demand triggers. One source of truth that both humans and AI can query directly. No interpretation. No drift. No telephone game.',
    footnote: '',
    icon: <DpadIcon size={10} />,
  },
  {
    accent: '#FF5910',
    label: 'AI GTM ENGINE',
    title: 'Execution that builds on itself.',
    body: "An execution engine connected directly to your strategy. Identifies opportunities. Produces aligned content. Drives visibility. Every cycle feeds the next. You don't reset every quarter. You level up.",
    footnote: '',
    icon: <StarIcon size={10} />,
  },
  {
    accent: '#73F5FF',
    label: 'ANSWER ENGINE OPTIMIZATION',
    title: 'Visibility where buyers actually look.',
    body: 'AI search presence and structured authority signals that make your company the one AI systems trust, cite, and recommend. Not SEO with a new label. A fundamentally different infrastructure for being found.',
    footnote: '',
    icon: <DiamondIcon size={10} />,
  },
  {
    accent: '#ED0AD2',
    label: 'COMPETITIVE INTELLIGENCE',
    title: 'The scoreboard for the new game.',
    body: 'Who does AI recommend in your category? Where is your positioning visible and where is it a ghost? Where are competitors beating you in channels you\'re not even monitoring? The scoreboard for the new game. Most companies have never seen it.',
    footnote: '',
    icon: <TrophyIcon size={10} />,
  },
];

export function NewGameSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#110e0f] to-heart-of-darkness" />

      {/* Animated glows */}
      <motion.div
        className="absolute top-1/3 left-0 w-[600px] h-[600px] rounded-full blur-[160px]"
        style={{ background: 'radial-gradient(circle, #73F5FF 0%, transparent 70%)' }}
        animate={{ opacity: [0.04, 0.08, 0.04], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, #E1FF00 0%, transparent 70%)' }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
            LEVEL 3
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1] mb-4 max-w-4xl">
            The new game has different rules.{' '}
            <span className="font-extrabold">And the prizes are real.</span>
          </h2>
          <p className="text-xl text-shroomy leading-relaxed max-w-2xl mt-8 mb-20">
            The old game gave you activity reports. The new game gives you a marketing system that gets smarter every month.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6" staggerDelay={0.12}>
          {capabilities.map((cap, i) => (
            <StaggerItem key={i} journey>
              <div
                className="group h-full p-8 md:p-10 rounded-2xl glass border transition-all duration-300"
                style={{ borderColor: `${cap.accent}18` }}
              >
                {/* Corner glow on hover */}
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: cap.accent }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <p
                      className="font-arcade text-[9px] sm:text-[10px] tracking-widest"
                      style={{ color: cap.accent, filter: `drop-shadow(0 0 6px ${cap.accent}50)` }}
                    >
                      {cap.label}
                    </p>
                    <div style={{ filter: `drop-shadow(0 0 10px ${cap.accent}70)` }}>
                      {cap.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 leading-snug tracking-tight">
                    {cap.title}
                  </h3>
                  <p className="text-shroomy leading-relaxed">{cap.body}</p>
                  {cap.footnote && (
                    <p
                      className="text-sm leading-relaxed italic border-t pt-4 mt-5"
                      style={{ color: cap.accent, opacity: 0.6, borderColor: `${cap.accent}15` }}
                    >
                      {cap.footnote}
                    </p>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
