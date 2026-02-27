'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

// --- Generative Avatar ---

function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h) + name.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function prng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const avatarPalette: [string, string][] = [
  ['#FF5910', '#E1FF00'],
  ['#73F5FF', '#ED0AD2'],
  ['#ED0AD2', '#FF5910'],
  ['#E1FF00', '#73F5FF'],
  ['#73F5FF', '#FF5910'],
  ['#FF5910', '#ED0AD2'],
  ['#E1FF00', '#FF5910'],
  ['#73F5FF', '#E1FF00'],
  ['#ED0AD2', '#73F5FF'],
  ['#E1FF00', '#ED0AD2'],
];

function GenerativeAvatar({ name, index, size, reducedMotion }: { name: string; index: number; size?: number; reducedMotion?: boolean }) {
  const px = size ?? 56;
  const hash = nameHash(name);
  const rand = prng(hash);
  const [c1, c2] = avatarPalette[index % avatarPalette.length];

  const r1Dur = +(12 + rand() * 8).toFixed(1);
  const r1Start = Math.round(rand() * 360);
  const r1Rx = 18 + rand() * 4;
  const r1Ry = 6 + rand() * 4;
  const dot1A = rand() * Math.PI * 2;

  const r2Dur = +(16 + rand() * 10).toFixed(1);
  const r2Start = Math.round(rand() * 360);
  const r2Rx = 13 + rand() * 4;
  const r2Ry = 5 + rand() * 3;
  const dot2A = rand() * Math.PI * 2;

  const pulseDur = +(2.5 + rand() * 1.5).toFixed(1);
  const sparkDur = +(18 + rand() * 8).toFixed(1);
  const sparkPhase = +(rand() * 4).toFixed(1);

  return (
    <svg viewBox="0 0 56 56" style={{ width: px, height: px }} className="shrink-0" aria-hidden="true">
      <defs>
        <radialGradient id={`av${index}g`}>
          <stop offset="0%" stopColor={c1} stopOpacity="0.2" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <circle cx="28" cy="28" r="26" fill={`url(#av${index}g)`} />

      {/* Ring 1 */}
      <g transform={reducedMotion ? `rotate(${r1Start} 28 28)` : undefined}>
        {!reducedMotion && (
          <animateTransform
            attributeName="transform" type="rotate"
            from={`${r1Start} 28 28`} to={`${r1Start + 360} 28 28`}
            dur={`${r1Dur}s`} repeatCount="indefinite"
          />
        )}
        <ellipse cx="28" cy="28" rx={r1Rx} ry={r1Ry}
          fill="none" stroke={c1} strokeWidth="0.75" opacity="0.3" />
        <circle
          cx={28 + r1Rx * Math.cos(dot1A)}
          cy={28 + r1Ry * Math.sin(dot1A)}
          r="2.5" fill={c1} opacity="0.8"
        />
      </g>

      {/* Ring 2 - counter-rotate */}
      <g transform={reducedMotion ? `rotate(${r2Start} 28 28)` : undefined}>
        {!reducedMotion && (
          <animateTransform
            attributeName="transform" type="rotate"
            from={`${r2Start + 360} 28 28`} to={`${r2Start} 28 28`}
            dur={`${r2Dur}s`} repeatCount="indefinite"
          />
        )}
        <ellipse cx="28" cy="28" rx={r2Rx} ry={r2Ry}
          fill="none" stroke={c2} strokeWidth="0.75" opacity="0.3" />
        <circle
          cx={28 + r2Rx * Math.cos(dot2A)}
          cy={28 + r2Ry * Math.sin(dot2A)}
          r="2" fill={c2} opacity="0.8"
        />
      </g>

      {/* Ambient spark */}
      <circle cx="28" cy="6" r="1" fill={c2} opacity={reducedMotion ? 0.5 : undefined}>
        {!reducedMotion && (
          <>
            <animateTransform
              attributeName="transform" type="rotate"
              from="0 28 28" to="360 28 28"
              dur={`${sparkDur}s`} repeatCount="indefinite"
            />
            <animate
              attributeName="opacity" values="0;0.5;0"
              dur="3.5s" begin={`${sparkPhase}s`} repeatCount="indefinite"
            />
          </>
        )}
      </circle>

      {/* Center core */}
      <circle cx="28" cy="28" r="3.5" fill={c1} opacity="0.8">
        {!reducedMotion && (
          <>
            <animate attributeName="r" values="3;4.5;3" dur={`${pulseDur}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;1;0.6" dur={`${pulseDur}s`} repeatCount="indefinite" />
          </>
        )}
      </circle>
      <circle cx="28" cy="28" r="1.5" fill="white" opacity="0.85" />
    </svg>
  );
}

// --- Leader Data ---

interface Leader {
  name: string;
  title: string;
  bio: string;
  linkedin: string;
}

const leaders: Leader[] = [
  {
    name: 'Bret Starr',
    title: 'Founder',
    bio: 'Bret founded The Starr Conspiracy in 1999 on a simple principle: you shouldn\'t have to teach your agency what your company does for a living. Over 25+ years, he has helped thousands of B2B technology companies grow through world-class brand, marketing, and go-to-market strategy. A recognized authority at the intersection of B2B marketing and AI, Bret has spent recent years rebuilding how marketing is conceived and executed from the ground up. He is the author of A Humble Guide to Fixing Everything in Brand, Marketing, and Sales, publishes A Humble Newsletter, and previously served on the Vista Equity Partners External Board of Directors. He holds a BA in English Literature from Southwestern University, studied Business Foundations at UT McCombs, and earned an MA in Criminology from the University of North Texas.',
    linkedin: 'https://www.linkedin.com/in/bret-starr/',
  },
  {
    name: 'Dan McCarron',
    title: 'Chief Operating Officer',
    bio: 'Dan oversees agency operations and finance, playing a central role in shaping TSC into one of the leading B2B marketing agencies in the industry over nearly two decades. Before TSC, he spent over seven years as an A&R representative at Universal Music Group and Universal Records — an experience that honed his instincts for creative talent, brand identity, and audience development. His expertise spans branding, identity development, strategic consulting, marketing communications, PR, and web development. Dan holds degrees in Biology/Chemistry, Philosophy, and Spanish from Southwestern University.',
    linkedin: 'https://www.linkedin.com/in/dmccarron/',
  },
  {
    name: 'Racheal Bates',
    title: 'Chief Experience Officer',
    bio: 'Racheal leads customer experience strategy across TSC, drawing on more than 12 years at the agency spanning Director of Marketing and VP of Customer Experience. Her graduate thesis at Technological University Dublin explored cross-cultural implications of color in brand logos — the intersection of analytical thinking and visual intelligence that defines her approach. Before marketing, she worked as a staff photographer and photo editor in Dublin, Ireland. She holds a BA in Fine Arts (Photography) with a minor in Anthropology from TCU and an MS in Marketing from TU Dublin.',
    linkedin: 'https://www.linkedin.com/in/rachealbates/',
  },
  {
    name: 'JJ La Pata',
    title: 'Chief Strategy Officer',
    bio: 'JJ has spent over a decade shaping marketing strategy for some of the most ambitious B2B technology companies in the market. He leads the development of cohesive, pipeline-driving strategies that help tech brands cut through the noise. As former VP of Strategy and AI Innovation, he was at the forefront of integrating artificial intelligence into TSC\'s strategic offerings. His expertise spans media strategy, digital marketing, SEM, SEO, conversion rate optimization, paid media, and account-based experience (ABX). JJ holds a BS in Marketing from TCU.',
    linkedin: 'https://www.linkedin.com/in/jj-la-pata-761b1a64/',
  },
  {
    name: 'Nancy Crabb',
    title: 'VP of Brand Experience',
    bio: 'Nancy has spent nearly 15 years shaping the visual and brand identity of some of B2B marketing\'s most compelling work. Equal parts strategist and maker, she ensures that brand expression is not just beautiful, but meaningful. Before TSC, she led creative services at PPAI, served as Director of Marketing and Communications at UNT Libraries, and was Partner and Marketing Director at Aduro Bean & Leaf, a specialty fair-trade coffee roastery. She holds a BA in Arts and Performance from UT Dallas and studied Communications at UT Austin.',
    linkedin: 'https://www.linkedin.com/in/nancy-pummill-crabb-2946726/',
  },
  {
    name: 'Noah Johnson',
    title: 'Director of Digital Strategy',
    bio: 'Noah brings more than a decade of experience designing and executing digital marketing strategies across a wide range of industries. Before TSC, he spent four years at Metric Theory (a Media.Monks company), rising from Account Director to Director of Media Planning & Strategy, leading planning for high-budget international multi-channel accounts with monthly budgets exceeding $1M. He leads digital strategy for B2B tech clients spanning SEM, AEO, paid social, programmatic media, SEO, and multi-channel campaign management. Noah holds a BBA in Marketing from Harding University.',
    linkedin: 'https://www.linkedin.com/in/noahmorganjohnson/',
  },
  {
    name: 'Joanna Castle',
    title: 'Senior Client Success & Marketing Manager',
    bio: 'Joanna serves as a strategic advisor for B2B SaaS clients navigating go-to-market strategy, marketing execution, and customer experience. With over five years at TSC and seven years in B2B marketing, she specializes in helping SaaS and professional services brands turn complex business goals into audience-driven strategies. Before TSC, she led digital marketing at BGM — the first CPA firm to work exclusively with the cannabis industry — and consulted for accounting firms across the Bay Area. She holds a BA in Communication from Denison University and studied Political Science at the University of Oslo.',
    linkedin: 'https://www.linkedin.com/in/joanna-castle/',
  },
  {
    name: 'Evan Addison Payne',
    title: 'Marketing & Brand Strategist',
    bio: 'Evan focuses on scaling go-to-market programs for work tech companies to maximize pipeline and drive measurable business impact. His career spans brand strategy, digital marketing, communications, and customer experience across Fortune 500 companies and high-growth startups. Previous roles include Senior Manager of Digital Marketing at hireEZ and Director of Marketing, Communications & Digital Engagement for AIDS/LifeCycle at the San Francisco AIDS Foundation. He holds a BS in Marketing and Economics from the University of Arkansas.',
    linkedin: 'https://www.linkedin.com/in/evanaddison/',
  },
  {
    name: 'Melissa Casey',
    title: 'Growth Strategist',
    bio: 'Melissa is a seasoned business development and marketing leader with more than 15 years of experience across nonprofit, agency, and tech environments. As former Managing Director of Marketing and Partnerships at Truth Initiative, she led grassroots, experiential, and out-of-home marketing for one of the country\'s most recognized public health brands. A lifelong traveler who has explored nearly 100 countries, she is fluent in English and Spanish with professional proficiency in French, Portuguese, Arabic, and Italian. She holds a BA from Georgetown University.',
    linkedin: 'https://www.linkedin.com/in/mel-casey/',
  },
  {
    name: 'Skylin Solaris',
    title: 'AI Workflow Engineer',
    bio: 'Skylin sits at the intersection of artificial intelligence and B2B marketing — building the systems, automations, and integrations that turn AI\'s promise into actual business results. While most agencies are still talking about adopting AI, Skylin is the one wiring it in. A self-taught systems thinker with deep expertise in ERP and CRM integrations, APIs, EDI, and cross-platform data exchange, he\'s migrated legacy systems, rescued at-risk integration projects, and once stabilized a company after a cyberattack before anyone had time to panic.',
    linkedin: 'https://www.linkedin.com/in/technicallyrain/',
  },
];

export function LeadershipSection() {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selected !== null) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [selected]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selected === null) return;
    if (e.key === 'Escape') setSelected(null);
    if (e.key === 'ArrowLeft') setSelected(selected === 0 ? leaders.length - 1 : selected - 1);
    if (e.key === 'ArrowRight') setSelected(selected === leaders.length - 1 ? 0 : selected + 1);
  }, [selected]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section className="relative py-24 md:py-32">
      <div className="section-wide">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            Leadership
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mb-16">
            Senior people doing the work.{' '}
            <span className="text-atomic-tangerine">Not selling it.</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {leaders.map((leader, i) => (
            <AnimatedSection key={leader.name} delay={i * 0.05}>
              <motion.div
                className="glass rounded-xl p-6 cursor-pointer h-full flex flex-col group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected(i)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(i);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${leader.name}'s bio`}
                layoutId={`leader-card-${i}`}
              >
                {/* Generative avatar */}
                <div className="mb-4">
                  <GenerativeAvatar name={leader.name} index={i} reducedMotion={!!reducedMotion} />
                </div>

                {/* Info */}
                <h3 className="text-white font-semibold text-base mb-1">
                  {leader.name}
                </h3>
                <p className="text-greige text-xs mb-3">{leader.title}</p>

                {/* LinkedIn */}
                <a
                  href={leader.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-shroomy hover:text-atomic-tangerine transition-colors mt-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  LinkedIn &rarr;
                </a>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Bio modal overlay */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leader-modal-name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1a1a]/95 backdrop-blur-xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-greige hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {/* Top accent bar */}
              <div
                className="h-1 rounded-t-2xl"
                style={{
                  background: `linear-gradient(90deg, ${avatarPalette[selected % avatarPalette.length][0]}, ${avatarPalette[selected % avatarPalette.length][1]})`,
                }}
              />

              <div className="p-8 sm:p-10">
                {/* Avatar + header */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="shrink-0">
                    <div className="w-20 h-20">
                      <GenerativeAvatar name={leaders[selected].name} index={selected} size={80} reducedMotion={!!reducedMotion} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 id="leader-modal-name" className="text-white font-bold text-2xl mb-1">
                      {leaders[selected].name}
                    </h3>
                    <p className="text-greige text-sm mb-3">{leaders[selected].title}</p>
                    <a
                      href={leaders[selected].linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium hover:text-atomic-tangerine transition-colors"
                      style={{ color: avatarPalette[selected % avatarPalette.length][0] }}
                    >
                      LinkedIn &rarr;
                    </a>
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="h-px mb-8 opacity-20"
                  style={{
                    background: `linear-gradient(90deg, ${avatarPalette[selected % avatarPalette.length][0]}, transparent)`,
                  }}
                />

                {/* Bio */}
                <p className="text-shroomy text-base leading-relaxed">
                  {leaders[selected].bio}
                </p>

                {/* Nav arrows */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                  <button
                    onClick={() => setSelected(selected === 0 ? leaders.length - 1 : selected - 1)}
                    className="flex items-center gap-2 text-sm text-greige hover:text-white transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {leaders[selected === 0 ? leaders.length - 1 : selected - 1].name}
                  </button>
                  <button
                    onClick={() => setSelected(selected === leaders.length - 1 ? 0 : selected + 1)}
                    className="flex items-center gap-2 text-sm text-greige hover:text-white transition-colors"
                  >
                    {leaders[selected === leaders.length - 1 ? 0 : selected + 1].name}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
