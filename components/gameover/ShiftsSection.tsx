'use client';

import { motion } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
const shifts: { number: string; title: string; subtitle?: string; body: string; accent: string }[] = [
  {
    number: '01',
    title: 'Buyers ask AI before they ask you.',
    body: "Buyers ask ChatGPT, Perplexity, and Gemini to shortlist vendors before they visit a single website or take a single sales call. If you're not in that answer, you're not in the game. Most companies have no idea this is happening to them right now.",
    accent: '#FF5910',
  },
  {
    number: '02',
    title: "AI turned your strategy into a mirror.",
    subtitle: "Most companies didn't like the reflection.",
    body: 'AI doesn\'t fix weak positioning. It scales it. "Innovative solutions for forward-thinking companies" sounds just as meaningless at 10x the volume. The companies with sharp strategy got sharper output. Everyone else got generic content faster.',
    accent: '#E1FF00',
  },
  {
    number: '03',
    title: 'Content volume decoupled from pipeline.',
    body: "More content. Same pipeline. The math broke. Not because content stopped working, but because most companies are still answering questions their market stopped asking 18 months ago. You're throwing a well-organized party in a building nobody's in.",
    accent: '#73F5FF',
  },
  {
    number: '04',
    title: 'Linear funnels stopped describing how anyone actually buys.',
    body: "B2B buyers use 10+ channels. Buying committees have 6-10 people. Your funnel is a comforting fiction that makes reporting easier and forecasting worse. It's a map of a city that got rezoned three years ago.",
    accent: '#ED0AD2',
  },
  {
    number: '05',
    title: 'Strategy became infrastructure.',
    body: "The big one. The companies pulling ahead didn't write better strategy documents. They built strategy systems. Machine-readable. Queryable. Operational. If your strategy can't be read by a machine, it can't guide one. And your gorgeous brand book is invisible to every AI system that now influences how buyers find you.",
    accent: '#FF5910',
  },
];

export function ShiftsSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0f0d0e] to-heart-of-darkness" />

      {/* Accent glows */}
      <motion.div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, #E1FF00 0%, transparent 70%)' }}
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, #73F5FF 0%, transparent 70%)' }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
            LEVEL 2
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1] mb-20 max-w-3xl">
            Five shifts that{' '}
            <span className="font-extrabold">killed the old game</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="space-y-6" staggerDelay={0.12}>
          {shifts.map((shift) => (
            <StaggerItem key={shift.number} journey>
              <div
                className="group relative p-8 md:p-10 rounded-2xl glass border transition-all duration-300 hover:border-opacity-30"
                style={{ borderColor: `${shift.accent}15` }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${shift.accent}08, transparent 60%)`,
                  }}
                />
                <div className="relative flex flex-col md:flex-row gap-6 md:gap-10">
                  <div className="flex items-start md:w-20 shrink-0">
                    <motion.span
                      className="font-arcade text-3xl md:text-4xl md:text-right"
                      style={{
                        background: `linear-gradient(180deg, ${shift.accent}, ${shift.accent}88)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: `drop-shadow(0 0 12px ${shift.accent}40)`,
                      }}
                    >
                      {shift.number}
                    </motion.span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-snug tracking-tight">
                      {shift.title}
                    </h3>
                    {shift.subtitle && (
                      <p className="text-lg text-shroomy mb-4 italic">{shift.subtitle}</p>
                    )}
                    <p className="text-shroomy leading-relaxed text-base md:text-lg">
                      {shift.body}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
