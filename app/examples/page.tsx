import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WorkHero } from '@/components/work/WorkHero';
import { CaseStudyCard } from '@/components/work/CaseStudyCard';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';
import { GalagaGameTrigger } from '@/components/work/GalagaGameTrigger';
import { CASE_STUDIES } from '@/lib/work-data';

export const metadata: Metadata = {
  title: 'Examples | The Starr Conspiracy',
  description:
    'The work that built our reputation. Brands, campaigns, and strategies that moved markets for B2B tech companies.',
  alternates: { canonical: '/examples' },
  openGraph: {
    title: 'Examples | The Starr Conspiracy',
    description:
      'The work that built our reputation. Brands, campaigns, and strategies that moved markets for B2B tech companies.',
  },
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main>
        <WorkHero />

        <section className="pb-24 md:pb-32">
          <div className="section-wide">
            <div className="grid md:grid-cols-2 gap-6">
              {CASE_STUDIES.map((study, index) => (
                <CaseStudyCard key={study.slug} study={study} index={index} />
              ))}
            </div>
          </div>
          <GalagaGameTrigger />
        </section>

        {/* CTA */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="relative z-10 section-wide text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-white leading-tight mb-4">
              Like what you see?{' '}
              <span className="font-extrabold">Let&apos;s make yours next.</span>
            </h2>
            <p className="text-lg text-shroomy mb-12 max-w-xl mx-auto">
              Tell us where you&apos;re headed. We&apos;ll show you how to get there faster.
            </p>
            <div className="flex justify-center">
              <CoinSlotCTA href="/contact?cta=work-bottom" ctaId="work-bottom" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
