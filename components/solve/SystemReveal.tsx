'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { KernelMockup, IntelligenceMockup, ContentMockup } from './PlatformMockups';

const systemSteps = [
  { name: 'Kernel', description: 'The foundation. Strategy in, execution out.', color: '#FF5910', number: '01' },
  { name: 'Intelligence', description: 'Maps buyer intent. Finds pipeline opportunities.', color: '#73F5FF', number: '02' },
  { name: 'Content Engine', description: 'Produces at scale. On-strategy by default.', color: '#E1FF00', number: '03' },
  { name: 'AI GTM Engine', description: 'Executes autonomously. Compounds results.', color: '#ED0AD2', number: '04' },
  { name: 'Campaigns', description: 'Demand gen, ABM, enablement. One system.', color: '#FFBDAE', number: '05' },
];


export function SystemReveal() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Warm background — heating up */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0e08] via-[#1f0f06] to-[#241008]" />

      {/* Animated threshold divider — brighter, wider glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <motion.div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #088BA0, #73F5FF, #E1FF00, #088BA0, transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={reducedMotion ? {} : { backgroundPosition: ['0% 0%', '200% 0%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {/* Glow halo below divider */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(255,89,16,0.15) 0%, transparent 100%)' }}
      />

      {/* Central nebula — blazing tangerine core */}
      <motion.div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,89,16,0.6) 0%, rgba(237,10,210,0.25) 40%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.7 } : {
          scale: [1, 1.12, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Tidal glow — behind platform mockups area */}
      <motion.div
        className="absolute bottom-[15%] right-[5%] w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(115,245,255,0.18) 0%, rgba(115,245,255,0.08) 50%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.3 } : {
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Neon cactus accent — mid left */}
      <motion.div
        className="absolute top-[50%] left-[3%] w-[450px] h-[450px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,255,0,0.35) 0%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.4 } : {
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Sprinkles accent — bottom left */}
      <motion.div
        className="absolute bottom-[25%] left-[15%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(237,10,210,0.35) 0%, transparent 70%)' }}
        animate={reducedMotion ? { opacity: 0.4 } : {
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
      />

      <div className="relative z-10">
        {/* The reveal */}
        <div className="section-wide">
          <AnimatedSection journey>
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
              The Answer
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-white leading-[1.05] mb-8 max-w-5xl">
              Most B2B teams don&apos;t have a{' '}
              <span className="font-extrabold">GTM operating system.</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection journey delay={0.2} className="mb-20 max-w-3xl">
            <div className="space-y-4 text-lg text-shroomy leading-relaxed">
              <p>
                They have tools. CRMs, marketing automation platforms, analytics dashboards,
                AI assistants, project management systems. They have campaigns. Emails, ads,
                webinars, content programs. They have agencies or contractors producing work.
              </p>
              <p className="text-white text-xl font-medium">
                What they don&apos;t have is a system that connects all of it.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* GTM Kernel callout — full-width emphasis */}
        <div className="section-wide mb-24">
          <AnimatedSection journey>
            <div className="relative glass rounded-2xl border border-atomic-tangerine/20 p-8 md:p-12 lg:p-16 overflow-hidden">
              {/* Corner glow */}
              <div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-25"
                style={{ background: '#FF5910' }}
              />
              <div
                className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20"
                style={{ background: '#73F5FF' }}
              />

              <div className="relative z-10">
                <p className="text-[16px] font-bold text-atomic-tangerine uppercase tracking-[4px] mb-6">
                  The GTM Kernel
                </p>
                <p className="text-2xl md:text-3xl lg:text-4xl text-white leading-snug font-normal mb-6 max-w-4xl">
                  A comprehensive, machine-readable{' '}
                  <span className="font-extrabold">single source of truth</span>{' '}
                  for your entire go-to-market strategy.
                </p>
                <p className="text-lg text-shroomy leading-relaxed max-w-3xl">
                  It defines who you are. Who you serve. Why you win. What your buyers care about.
                  How they buy. What triggers them to act. The kernel connects strategy, demand generation,
                  and execution into one system. When the kernel is set, everything else gets faster, sharper,
                  and measurable.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* System Flow — visual cascade */}
        <div className="section-wide mb-24">
          <AnimatedSection journey className="mb-12">
            <h3 className="text-3xl md:text-4xl font-normal text-white">
              System <span className="font-extrabold">Flow</span>
            </h3>
          </AnimatedSection>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-px">
              <motion.div
                className="w-full h-full"
                style={{
                  background: 'repeating-linear-gradient(to right, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 8px, transparent 8px, transparent 20px)',
                }}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" staggerDelay={0.12}>
              {systemSteps.map((step) => (
                <StaggerItem key={step.name} journey>
                  <motion.div
                    className="glass rounded-xl p-6 border h-full relative overflow-hidden group"
                    style={{ borderColor: `${step.color}22` }}
                    whileHover={reducedMotion ? {} : { y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Watermark */}
                    <span
                      className="absolute top-2 right-4 text-[60px] font-black leading-none select-none pointer-events-none"
                      style={{ color: step.color, opacity: 0.06 }}
                    >
                      {step.number}
                    </span>

                    {/* Hover glow */}
                    <div
                      className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                      style={{ background: step.color }}
                    />

                    <div className="relative z-10">
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: step.color }}
                      >
                        {step.number}
                      </span>
                      <h4 className="text-base font-extrabold text-white mt-2 mb-2">{step.name}</h4>
                      <p className="text-xs text-shroomy leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>

        {/* Platform Previews — animated browser mockups */}
        <div className="section-wide">
          <AnimatedSection journey className="mb-12">
            <h3 className="text-3xl md:text-4xl font-normal text-white mb-4">
              See the system <span className="font-extrabold">in action</span>
            </h3>
            <p className="text-lg text-shroomy max-w-2xl">
              Three production platforms. One unified GTM operating system.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.2}>
            <StaggerItem>
              <KernelMockup />
              <div className="mt-4 px-1">
                <h4 className="text-base font-extrabold text-white mb-1">GTM Kernel</h4>
                <p className="text-xs font-bold text-greige mb-2 font-mono">tscgtmkernel.com</p>
                <p className="text-sm text-shroomy leading-relaxed">
                  The strategic operating system. 20 components, machine-readable, governs every downstream system.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <IntelligenceMockup />
              <div className="mt-4 px-1">
                <h4 className="text-base font-extrabold text-white mb-1">Intelligence Engine</h4>
                <p className="text-xs font-bold text-greige mb-2 font-mono">intelligence.tscgtmkernel.com</p>
                <p className="text-sm text-shroomy leading-relaxed">
                  Deep query analysis and buyer intent mapping. See exactly where pipeline opportunities exist.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <ContentMockup />
              <div className="mt-4 px-1">
                <h4 className="text-base font-extrabold text-white mb-1">Content Engine</h4>
                <p className="text-xs font-bold text-greige mb-2 font-mono">content.tscgtmkernel.com</p>
                <p className="text-sm text-shroomy leading-relaxed">
                  AI-native content production at scale. On-strategy by default, optimized for AI-driven discovery.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
