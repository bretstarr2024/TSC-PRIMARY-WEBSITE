'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';

const ctaOptions = [
  {
    label: 'GTM Kernel Diagnostic',
    headline: 'Diagnose My GTM System',
    description:
      "A strategic assessment of your current go-to-market foundation. We evaluate your positioning, messaging, ICP clarity, competitive frame, and system readiness. You get a clear picture of what's working, what's broken, and what to fix first.",
    whoFor:
      'Teams that know something is off but need to pinpoint exactly where the system is failing before committing to a build.',
    href: '/contact?cta=solve-diagnostic&service=GTM+Kernel+Diagnostic',
    ctaId: 'solve-diagnostic',
    color: '#FF5910',
  },
  {
    label: 'GTM System Build',
    headline: 'Build My GTM System',
    description:
      'A full GTM Kernel build plus the brand, messaging, and strategic infrastructure your go-to-market system needs to function. This is the foundation engagement. Everything else builds on what we create here.',
    whoFor:
      "Teams ready to rebuild their go-to-market foundation. Launching, repositioning, entering new markets, or replacing an outdated strategy that isn't performing.",
    href: '/contact?cta=solve-build&service=GTM+System+Build',
    ctaId: 'solve-build',
    color: '#73F5FF',
  },
  {
    label: 'AI GTM Execution',
    headline: 'See the GTM Kernel',
    description:
      'Production-grade AI systems that execute against your GTM Kernel. Intelligence Engine for buyer intent data. Content Engine for scaled production. AI GTM Engine for autonomous execution.',
    whoFor:
      'Teams that have a clear strategy (or have completed a GTM Kernel build) and need the execution system to scale it.',
    href: '/contact?cta=solve-execution&service=AI+GTM+Execution',
    ctaId: 'solve-execution',
    color: '#E1FF00',
  },
];

export function SolveCTA() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1118] via-[#1a0e08] to-heart-of-darkness" />

      {/* Radial pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.08 } : {
          scale: [1, 1.15, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 section-wide py-32 md:py-40">
        <AnimatedSection className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-white leading-[1.05]">
            Ready to fix
          </h2>
          <p className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white leading-[1.05] mt-2">
            the system?
          </p>
          <p className="text-xl text-shroomy max-w-2xl mx-auto mt-8 leading-relaxed">
            Every engagement starts with understanding where you are and where
            the system is breaking. Choose the path that fits.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-20" staggerDelay={0.15}>
          {ctaOptions.map((option) => (
            <StaggerItem key={option.ctaId}>
              <motion.div
                className="glass rounded-2xl border p-8 h-full flex flex-col relative overflow-hidden group"
                style={{ borderColor: `${option.color}22` }}
                whileHover={reducedMotion ? {} : { y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Corner glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500"
                  style={{ background: option.color }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-4"
                    style={{ color: option.color }}
                  >
                    {option.label}
                  </p>
                  <p className="text-shroomy leading-relaxed mb-4 flex-1">
                    {option.description}
                  </p>
                  <div className="mb-6">
                    <p className="text-xs font-bold text-greige uppercase tracking-wider mb-2">
                      Who it&apos;s for
                    </p>
                    <p className="text-sm text-shroomy">{option.whoFor}</p>
                  </div>
                  <Link
                    href={option.href}
                    className="mt-auto block text-center px-6 py-3 bg-heart-of-darkness text-white border-2 border-white font-medium rounded-lg hover:bg-white hover:text-heart-of-darkness transition-colors hover:no-underline"
                    data-track-cta={option.ctaId}
                    data-track-component="SolveCTA"
                    data-track-label={option.headline}
                    data-track-destination={option.href}
                  >
                    {option.headline}
                  </Link>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Coin slot */}
        <div className="text-center">
          <p className="text-lg text-shroomy mb-8">
            Not sure which path? Start a conversation.
          </p>
          <div className="flex justify-center">
            <CoinSlotCTA href="/contact?cta=solve-bottom" ctaId="solve-bottom" />
          </div>
        </div>
      </div>
    </section>
  );
}
