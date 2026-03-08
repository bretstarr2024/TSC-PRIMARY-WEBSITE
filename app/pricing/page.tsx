import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PricingHero } from '@/components/pricing/PricingHero';
import { ModelOverview } from '@/components/pricing/ModelOverview';
import { FourPillars } from '@/components/pricing/FourPillars';
import { WhyDifferent } from '@/components/pricing/WhyDifferent';
import { PricingCards } from '@/components/pricing/PricingCards';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';
import { pricingBreadcrumb } from '@/lib/schema/breadcrumbs';
import { pricingCapsules } from '@/lib/schema/pricing-faq';
import { getFaqSchema } from '@/lib/schema/service-faq';

export const metadata: Metadata = {
  title: 'Pricing | The Starr Conspiracy',
  description:
    'Senior B2B marketing talent combined with AI-native execution. Subscriptions from $15K/month, projects from $30K. We sell growth, not hours.',
  alternates: { canonical: '/pricing' },
  keywords: [
    'B2B marketing agency pricing',
    'AI marketing agency',
    'B2B marketing subscription',
    'senior marketing talent',
    'AI-native marketing',
    'B2B agency model',
  ],
  openGraph: {
    title: 'Pricing | The Starr Conspiracy',
    description:
      'Senior B2B marketing talent combined with AI-native execution. Subscriptions from $15K/month, projects from $30K.',
  },
};

export default function PricingPage() {
  const breadcrumbSchema = pricingBreadcrumb();

  const faqSchema = getFaqSchema(pricingCapsules);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, faqSchema]),
          }}
        />

        <PricingHero />
        <ModelOverview />
        <FourPillars />
        <WhyDifferent />
        <PricingCards />

        <AnswerCapsulesSection
          capsules={pricingCapsules}
          accentColor="#FF5910"
          heading={<>Common questions about{' '}<span className="text-white font-extrabold">working with us.</span></>}
          subheading="Straight answers about pricing, engagement models, and what you actually get."
        />

        {/* CTA */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="relative z-10 section-wide text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-white leading-tight mb-4">
              Like the model?{' '}
              <span className="font-extrabold">Let&apos;s scope yours.</span>
            </h2>
            <p className="text-lg text-shroomy mb-12 max-w-xl mx-auto">
              No generic proposals. Tell us what you need and we&apos;ll build a plan that fits.
            </p>
            <div className="flex justify-center">
              <CoinSlotCTA href="/contact?cta=pricing-bottom" ctaId="pricing-bottom" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
