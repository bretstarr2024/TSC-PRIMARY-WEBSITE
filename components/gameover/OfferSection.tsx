'use client';

import { motion } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { CrownIcon, TrophyIcon, JoystickIcon } from './PixelArtIcons';

export function OfferSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0e0d0f] to-heart-of-darkness" />

      {/* Animated glows */}
      <motion.div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <div className="flex items-center gap-5 mb-6">
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px]">
              LEVEL 5
            </p>
            <div style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.7))' }}>
              <JoystickIcon size={8} />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1] mb-4 max-w-4xl">
            Want to see your score in{' '}
            <span className="font-extrabold">the new game?</span>
          </h2>
          <p className="text-xl text-shroomy leading-relaxed max-w-3xl mt-8 mb-20">
            We&apos;ll build you a real AI-Era Competitive Intelligence Assessment. Not a PDF with charts you&apos;ll never look at again. A live analysis, delivered in a lightpaper format, built from your actual competitive landscape. It expires in 15 days because competitive intelligence has a shelf life, and we want you to use it, not file it.
          </p>
        </AnimatedSection>

        <StaggerContainer className="space-y-8" staggerDelay={0.15}>
          {/* Offer Block 1 — Your Free Assessment */}
          <StaggerItem journey>
            <div className="group p-8 md:p-10 rounded-2xl glass border border-atomic-tangerine/15 relative overflow-hidden transition-all duration-300 hover:border-atomic-tangerine/25">
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
                style={{ background: '#FF5910' }}
                animate={{ opacity: [0.04, 0.08, 0.04] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <p
                    className="font-arcade text-[9px] tracking-widest"
                    style={{ color: '#FF5910', filter: 'drop-shadow(0 0 6px rgba(255,89,16,0.5))' }}
                  >
                    THE ASSESSMENT
                  </p>
                  <div style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.7))' }}>
                    <CrownIcon size={8} />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-snug tracking-tight">
                  Your Free AI-Era Competitive Intelligence Assessment
                </h3>

                <p className="text-white font-semibold mb-5">Here&apos;s how it works. You tell us:</p>
                <ul className="space-y-3 mb-8">
                  {[
                    { label: 'Your top 3 competitors.', desc: 'The ones keeping you up at night. We cap it at three to keep the analysis sharp.' },
                    { label: 'Your AI engine of choice.', desc: "ChatGPT, Claude, or Perplexity. Pick one. (They don't all see you the same way. That's a conversation worth having.)" },
                    { label: 'One seed topic.', desc: 'The core problem your buyers are trying to solve. We take it from there.' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-arcade text-[7px] mt-1.5 shrink-0" style={{ color: '#FF5910', filter: 'drop-shadow(0 0 4px rgba(255,89,16,0.4))' }}>+</span>
                      <div>
                        <span className="text-white font-semibold text-sm">{item.label}</span>{' '}
                        <span className="text-shroomy text-sm">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="text-white font-semibold mb-5">Here&apos;s what you get back:</p>
                <ul className="space-y-4 mb-8">
                  {[
                    { label: 'AI Feature and Product Intelligence.', desc: 'What AI-powered features, products, and services your competitors are shipping, marketing, and positioning right now, and where they\'re ahead of you.' },
                    { label: 'AEO Performance Snapshot.', desc: "How you and your three competitors show up when real buyers ask your chosen AI engine about your space. Who gets recommended. Who gets cited. Who's a ghost. Based on real query data from the top 50 queries in your topic." },
                    { label: 'AI Messaging Analysis.', desc: "How your competitors are talking about AI in their positioning and whether it's landing or just noise." },
                    { label: 'Content Plays.', desc: "Specific opportunities where your competitors are visible and you're not, with creative briefs so your team can act on them immediately." },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-arcade text-[7px] mt-1.5 shrink-0" style={{ color: '#FF5910', filter: 'drop-shadow(0 0 4px rgba(255,89,16,0.4))' }}>+</span>
                      <div>
                        <span className="text-white font-semibold text-sm">{item.label}</span>{' '}
                        <span className="text-shroomy text-sm">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="text-shroomy leading-relaxed mb-5">
                  Think of this as the boss-level intelligence briefing. Most companies are fighting competitors they can see. This shows you the ones operating in channels you&apos;re not even monitoring yet.
                </p>
                <p className="text-sm font-bold text-atomic-tangerine" style={{ filter: 'drop-shadow(0 0 4px rgba(255,89,16,0.3))' }}>
                  Delivered as a lightpaper. Expires in 15 days. Because intelligence that sits in a folder isn&apos;t intelligence. It&apos;s a souvenir.
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* Offer Block 2 — How to claim it */}
          <StaggerItem journey>
            <div className="group p-8 md:p-10 rounded-2xl glass border border-neon-cactus/15 relative overflow-hidden transition-all duration-300 hover:border-neon-cactus/25">
              <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
                style={{ background: '#E1FF00' }}
                animate={{ opacity: [0.03, 0.06, 0.03] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <p
                    className="font-arcade text-[9px] tracking-widest"
                    style={{ color: '#E1FF00', filter: 'drop-shadow(0 0 6px rgba(225,255,0,0.5))' }}
                  >
                    HOW IT WORKS
                  </p>
                  <div style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.7))' }}>
                    <TrophyIcon size={8} />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-snug tracking-tight">
                  How to claim it
                </h3>

                <div className="space-y-6 mb-8">
                  {[
                    { step: '01', text: 'Fill out the intake form below. Takes about 2 minutes.' },
                    { step: '02', text: 'We build your assessment. Real data. Real analysis. Your competitors. Your market.' },
                    { step: '03', text: "We walk you through it live. 30 minutes. If you haven't completed the intake form before the call, we'll do it together on the spot. Either way, you walk out with the finished assessment." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start">
                      <span
                        className="font-arcade text-lg shrink-0"
                        style={{
                          background: 'linear-gradient(180deg, #E1FF00, #E1FF0088)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 0 8px rgba(225,255,0,0.4))',
                        }}
                      >
                        {item.step}
                      </span>
                      <p className="text-shroomy leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-xl bg-white/[0.03] border border-neon-cactus/10">
                  <p className="text-sm text-white leading-relaxed">
                    No credit card. No auto-renewal. No surprise upsell. You get the assessment, you get 15 days to use it, and you decide if there&apos;s a deeper conversation worth having.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
