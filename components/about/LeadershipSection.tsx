'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

interface Leader {
  name: string;
  title: string;
  bio: string;
  linkedin: string;
  initials: string;
}

const leaders: Leader[] = [
  {
    name: 'Bret Starr',
    title: 'Founder',
    bio: 'Bret founded The Starr Conspiracy in 1999 on a simple principle: you shouldn\'t have to teach your agency what your company does for a living. Over 25+ years, he has helped thousands of B2B technology companies grow through world-class brand, marketing, and go-to-market strategy. A recognized authority at the intersection of B2B marketing and AI, Bret has spent recent years rebuilding how marketing is conceived and executed from the ground up. He is the author of A Humble Guide to Fixing Everything in Brand, Marketing, and Sales, publishes A Humble Newsletter, and previously served on the Vista Equity Partners External Board of Directors. He holds a BA in English Literature from Southwestern University, studied Business Foundations at UT McCombs, and earned an MA in Criminology from the University of North Texas.',
    linkedin: 'https://www.linkedin.com/in/bret-starr/',
    initials: 'BS',
  },
  {
    name: 'Dan McCarron',
    title: 'Chief Operating Officer',
    bio: 'Dan oversees agency operations and finance, playing a central role in shaping TSC into one of the leading B2B marketing agencies in the industry over nearly two decades. Before TSC, he spent over seven years as an A&R representative at Universal Music Group and Universal Records — an experience that honed his instincts for creative talent, brand identity, and audience development. His expertise spans branding, identity development, strategic consulting, marketing communications, PR, and web development. Dan holds degrees in Biology/Chemistry, Philosophy, and Spanish from Southwestern University.',
    linkedin: 'https://www.linkedin.com/in/dmccarron/',
    initials: 'DM',
  },
  {
    name: 'Racheal Bates',
    title: 'Chief Experience Officer',
    bio: 'Racheal leads customer experience strategy across TSC, drawing on more than 12 years at the agency spanning Director of Marketing and VP of Customer Experience. Her graduate thesis at Technological University Dublin explored cross-cultural implications of color in brand logos — the intersection of analytical thinking and visual intelligence that defines her approach. Before marketing, she worked as a staff photographer and photo editor in Dublin, Ireland. She holds a BA in Fine Arts (Photography) with a minor in Anthropology from TCU and an MS in Marketing from TU Dublin.',
    linkedin: 'https://www.linkedin.com/in/rachealbates/',
    initials: 'RB',
  },
  {
    name: 'JJ La Pata',
    title: 'Chief Strategy Officer',
    bio: 'JJ has spent over a decade shaping marketing strategy for some of the most ambitious B2B technology companies in the market. He leads the development of cohesive, pipeline-driving strategies that help tech brands cut through the noise. As former VP of Strategy and AI Innovation, he was at the forefront of integrating artificial intelligence into TSC\'s strategic offerings. His expertise spans media strategy, digital marketing, SEM, SEO, conversion rate optimization, paid media, and account-based experience (ABX). JJ holds a BS in Marketing from TCU.',
    linkedin: 'https://www.linkedin.com/in/jj-la-pata-761b1a64/',
    initials: 'JL',
  },
  {
    name: 'Nancy Crabb',
    title: 'VP of Brand Experience',
    bio: 'Nancy has spent nearly 15 years shaping the visual and brand identity of some of B2B marketing\'s most compelling work. Equal parts strategist and maker, she ensures that brand expression is not just beautiful, but meaningful. Before TSC, she led creative services at PPAI, served as Director of Marketing and Communications at UNT Libraries, and was Partner and Marketing Director at Aduro Bean & Leaf, a specialty fair-trade coffee roastery. She holds a BA in Arts and Performance from UT Dallas and studied Communications at UT Austin.',
    linkedin: 'https://www.linkedin.com/in/nancy-pummill-crabb-2946726/',
    initials: 'NC',
  },
  {
    name: 'Noah Johnson',
    title: 'Director of Digital Strategy',
    bio: 'Noah brings more than a decade of experience designing and executing digital marketing strategies across a wide range of industries. Before TSC, he spent four years at Metric Theory (a Media.Monks company), rising from Account Director to Director of Media Planning & Strategy, leading planning for high-budget international multi-channel accounts with monthly budgets exceeding $1M. He leads digital strategy for B2B tech clients spanning SEM, AEO, paid social, programmatic media, SEO, and multi-channel campaign management. Noah holds a BBA in Marketing from Harding University.',
    linkedin: 'https://www.linkedin.com/in/noahmorganjohnson/',
    initials: 'NJ',
  },
  {
    name: 'Joanna Castle',
    title: 'Senior Client Success & Marketing Manager',
    bio: 'Joanna serves as a strategic advisor for B2B SaaS clients navigating go-to-market strategy, marketing execution, and customer experience. With over five years at TSC and seven years in B2B marketing, she specializes in helping SaaS and professional services brands turn complex business goals into audience-driven strategies. Before TSC, she led digital marketing at BGM — the first CPA firm to work exclusively with the cannabis industry — and consulted for accounting firms across the Bay Area. She holds a BA in Communication from Denison University and studied Political Science at the University of Oslo.',
    linkedin: 'https://www.linkedin.com/in/joanna-castle/',
    initials: 'JC',
  },
  {
    name: 'Evan Addison Payne',
    title: 'Marketing & Brand Strategist',
    bio: 'Evan focuses on scaling go-to-market programs for work tech companies to maximize pipeline and drive measurable business impact. His career spans brand strategy, digital marketing, communications, and customer experience across Fortune 500 companies and high-growth startups. Previous roles include Senior Manager of Digital Marketing at hireEZ and Director of Marketing, Communications & Digital Engagement for AIDS/LifeCycle at the San Francisco AIDS Foundation. He holds a BS in Marketing and Economics from the University of Arkansas.',
    linkedin: 'https://www.linkedin.com/in/evanaddison/',
    initials: 'EP',
  },
  {
    name: 'Melissa Casey',
    title: 'Growth Strategist',
    bio: 'Melissa is a seasoned business development and marketing leader with more than 15 years of experience across nonprofit, agency, and tech environments. As former Managing Director of Marketing and Partnerships at Truth Initiative, she led grassroots, experiential, and out-of-home marketing for one of the country\'s most recognized public health brands. A lifelong traveler who has explored nearly 100 countries, she is fluent in English and Spanish with professional proficiency in French, Portuguese, Arabic, and Italian. She holds a BA from Georgetown University.',
    linkedin: 'https://www.linkedin.com/in/mel-casey/',
    initials: 'MC',
  },
  {
    name: 'Skylin Solaris',
    title: 'AI Workflow Engineer',
    bio: 'Skylin sits at the intersection of artificial intelligence and B2B marketing — building the systems, automations, and integrations that turn AI\'s promise into actual business results. While most agencies are still talking about adopting AI, Skylin is the one wiring it in. A self-taught systems thinker with deep expertise in ERP and CRM integrations, APIs, EDI, and cross-platform data exchange, he\'s migrated legacy systems, rescued at-risk integration projects, and once stabilized a company after a cyberattack before anyone had time to panic.',
    linkedin: 'https://www.linkedin.com/in/technicallyrain/',
    initials: 'SS',
  },
];

// Gradient pairs for initials avatars
const gradients = [
  'from-atomic-tangerine to-hot-sauce',
  'from-hurricane-sky to-tidal-wave',
  'from-sprinkles to-atomic-tangerine',
  'from-neon-cactus to-hurricane-sky',
  'from-tidal-wave to-sprinkles',
  'from-hot-sauce to-sprinkles',
  'from-atomic-tangerine to-neon-cactus',
  'from-hurricane-sky to-atomic-tangerine',
  'from-neon-cactus to-tidal-wave',
  'from-sprinkles to-hurricane-sky',
];

export function LeadershipSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

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
                className="glass rounded-xl p-6 cursor-pointer h-full flex flex-col"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                onClick={() =>
                  setExpanded(expanded === leader.name ? null : leader.name)
                }
              >
                {/* Avatar */}
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-4 shrink-0`}
                >
                  <span className="text-sm font-bold text-white">
                    {leader.initials}
                  </span>
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

                {/* Expanded bio */}
                <AnimatePresence>
                  {expanded === leader.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-shroomy text-xs leading-relaxed mt-4 pt-4 border-t border-white/10">
                        {leader.bio}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
