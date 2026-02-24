import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PricingHero } from '@/components/pricing/PricingHero';
import { ModelOverview } from '@/components/pricing/ModelOverview';
import { FourPillars } from '@/components/pricing/FourPillars';
import { WhyDifferent } from '@/components/pricing/WhyDifferent';
import { PricingCards } from '@/components/pricing/PricingCards';
import { ServiceCTA } from '@/components/services/ServiceCTA';
import { pricingBreadcrumb } from '@/lib/schema/breadcrumbs';

export const metadata: Metadata = {
  title: 'Pricing | The Starr Conspiracy',
  description:
    'Senior B2B marketing talent combined with AI-native execution. Subscriptions from $15K/month, projects from $30K. We sell growth, not hours.',
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

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema]),
          }}
        />

        <PricingHero />
        <ModelOverview />
        <FourPillars />
        <WhyDifferent />
        <PricingCards />
        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}
