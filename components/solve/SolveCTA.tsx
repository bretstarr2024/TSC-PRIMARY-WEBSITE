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
    <section className="relative min-h-screen overflow-hidden">
      {/* Video background — cinematic finale */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster=""
        >
          <source src="/videos/diagnostic-finale.mp4" type="video/mp4" />
        </video>
        {/* Lighter overlay — let the disco ball shine */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,89,16,0.08)] to-[rgba(255,89,16,0.15)]" />
        {/* Gradient fade from previous section */}
        <div
          className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #1a0e08 0%, transparent 100%)' }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #141213 0%, transparent 100%)' }}
        />
      </div>

      {/* Bright nebula overlays on top of video */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[130px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(circle, rgba(255,89,16,0.65) 0%, rgba(237,10,210,0.3) 50%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.7 } : {
          scale: [1, 1.15, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(circle, rgba(255,189,174,0.35) 0%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.4 } : {
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        className="absolute top-[55%] left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(circle, rgba(237,10,210,0.3) 0%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.35 } : {
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <div className="relative z-10 section-wide py-32 md:py-40">
        <AnimatedSection journey className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-white leading-[1.05]">
            This is what winning
          </h2>
          <p className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white leading-[1.05] mt-2">
            looks like.
          </p>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mt-8 leading-relaxed">
            A GTM system that actually works. Pipeline that compounds. Teams that execute with clarity. It starts with one conversation.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-20" staggerDelay={0.15}>
          {ctaOptions.map((option) => (
            <StaggerItem key={option.ctaId} journey>
              <motion.div
                className="rounded-2xl border p-8 h-full flex flex-col relative overflow-hidden group backdrop-blur-xl bg-black/70"
                style={{ borderColor: `${option.color}44` }}
                whileHover={reducedMotion ? {} : { y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Corner glow — brighter */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ background: option.color }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-4"
                    style={{ color: option.color }}
                  >
                    {option.label}
                  </p>
                  <p className="text-white/90 leading-relaxed mb-4 flex-1">
                    {option.description}
                  </p>
                  <div className="mb-6">
                    <p className="text-xs font-bold text-[#d1d1c6] uppercase tracking-wider mb-2">
                      Who it&apos;s for
                    </p>
                    <p className="text-sm text-white/80">{option.whoFor}</p>
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
        <AnimatedSection journey delay={0.3}>
          <div className="text-center">
            <p className="text-lg text-shroomy mb-8">
              Ready to feel this? Let&apos;s talk.
            </p>
            <div className="flex justify-center">
              <CoinSlotCTA href="/contact?cta=solve-bottom" ctaId="solve-bottom" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
