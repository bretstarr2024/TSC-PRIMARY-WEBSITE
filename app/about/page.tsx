import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { OriginStory } from '@/components/about/OriginStory';
import { ApproachSection } from '@/components/about/ApproachSection';
import { LeadershipSection } from '@/components/about/LeadershipSection';
import { ClientMarquee } from '@/components/about/ClientMarquee';
import { AboutFaq } from '@/components/about/AboutFaq';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';
import { getOrganizationSchema } from '@/lib/schema/people';
import { getAboutFaqSchema } from '@/lib/schema/about-faq';
import { aboutBreadcrumb } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'About | The Starr Conspiracy',
  description:
    'The Starr Conspiracy is a strategic B2B marketing agency founded in 1999, combining 25+ years of marketing fundamentals with AI-native capabilities to help 3,000+ technology companies grow.',
  alternates: { canonical: '/about' },
  keywords: [
    'B2B marketing agency',
    'The Starr Conspiracy',
    'B2B tech marketing',
    'AI marketing agency',
    'brand strategy agency',
    'demand generation agency',
    'B2B agency Austin Texas',
    'Bret Starr',
  ],
  openGraph: {
    title: 'About | The Starr Conspiracy',
    description:
      'The Starr Conspiracy is a strategic B2B marketing agency founded in 1999, combining 25+ years of marketing fundamentals with AI-native capabilities to help 3,000+ technology companies grow.',
  },
};

export default function AboutPage() {
  const orgSchema = getOrganizationSchema();
  const faqSchema = getAboutFaqSchema();
  const breadcrumbSchema = aboutBreadcrumb();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* JSON-LD structured data for AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([orgSchema, faqSchema, breadcrumbSchema]),
          }}
        />

        <AboutHero />
        <OriginStory />
        <ApproachSection />
        <LeadershipSection />
        <ClientMarquee />
        <AboutFaq />
        {/* CTA */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="relative z-10 section-wide text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-white leading-tight mb-4">
              Now you know who we are.{' '}
              <span className="font-extrabold">Let&apos;s talk about you.</span>
            </h2>
            <p className="text-lg text-shroomy mb-12 max-w-xl mx-auto">
              Tell us what you&apos;re building. We&apos;ll tell you how we can help.
            </p>
            <div className="flex justify-center">
              <CoinSlotCTA href="/contact?cta=about-bottom" ctaId="about-bottom" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
