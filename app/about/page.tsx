import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { OriginStory } from '@/components/about/OriginStory';
import { ApproachSection } from '@/components/about/ApproachSection';
import { LeadershipSection } from '@/components/about/LeadershipSection';
import { ClientMarquee } from '@/components/about/ClientMarquee';
import { AboutFaq } from '@/components/about/AboutFaq';
import { ServiceCTA } from '@/components/services/ServiceCTA';
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
        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}
