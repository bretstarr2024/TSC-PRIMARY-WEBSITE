'use client';

import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { CoinIcon, SkullIcon } from './PixelArtIcons';

const painPoints = [
  {
    title: 'Strategy lived in documents.',
    body: "Brand decks. Messaging frameworks. Positioning statements. Filed in Google Drive, interpreted differently by every person and every AI tool that touched them. Everyone nodded in the meeting. Nobody executed the same thing.",
  },
  {
    title: 'Execution reset every quarter.',
    body: 'New brief. New creative. New priorities. Back to Level 1. Nothing got smarter. You just played the same levels with slightly better graphics and called it "optimization."',
  },
  {
    title: 'Content was aimed at keywords.',
    body: "Editorial calendars built around search volume and industry topics. Not buyer questions. Not competitive gaps. Not the conversations happening inside AI platforms where deals actually start now.",
  },
  {
    title: 'Agencies sold hours, not outcomes.',
    body: "Retainer bought labor. Labor produced deliverables. Deliverables got measured by activity. Activity looked great on a slide. Pipeline didn't care about your slide. Insert another quarter. Play again.",
  },
];

export function OldGameSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#110f10] to-heart-of-darkness" />

      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <div className="flex items-center gap-5 mb-6">
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px]">
              LEVEL 1
            </p>
            <div className="flex gap-3 items-center">
              <CoinIcon size={6} />
              <CoinIcon size={6} />
              <CoinIcon size={6} />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1] mb-8 max-w-4xl">
            You&apos;ve been playing a game that was designed to{' '}
            <span className="font-extrabold">eat your quarters</span>
          </h2>

        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.12}>
          {painPoints.map((point, i) => (
            <StaggerItem key={i} journey>
              <div className="group h-full p-8 rounded-2xl glass border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-start gap-3 mb-4">
                  <span
                    className="font-arcade text-[10px] mt-1 shrink-0"
                    style={{
                      background: 'linear-gradient(180deg, #FF5910, #FF3333)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">
                    {point.title}
                  </h3>
                </div>
                <p className="text-shroomy leading-relaxed pl-9">{point.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.4} className="mt-20">
          <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-start gap-6">
            <div className="hidden md:block shrink-0 mt-1">
              <SkullIcon size={10} />
            </div>
            <p className="text-2xl md:text-3xl text-white leading-snug font-normal tracking-tight">
              That game is over. Not because it crashed. Because it{' '}
              <span className="font-extrabold">quietly stopped working</span> and most teams didn&apos;t
              notice until the pipeline forced the conversation.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
