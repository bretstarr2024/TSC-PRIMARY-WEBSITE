import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServicesHero } from '@/components/services/ServicesHero';
import { ServiceDualUniverse } from '@/components/services/ServiceDualUniverse';
import { ServiceCategoryStrip } from '@/components/services/ServiceCategoryStrip';
import { AiCascade } from '@/components/services/AiCascade';
import { BridgeStatement } from '@/components/services/BridgeStatement';
import { ServiceCTA } from '@/components/services/ServiceCTA';
import { getStrategicCategories } from '@/lib/services-data';

export const metadata: Metadata = {
  title: 'Services | The Starr Conspiracy',
  description:
    'Full-stack B2B marketing services: brand strategy, demand generation, digital performance, content & creative, advisory, and AI-native marketing solutions.',
  openGraph: {
    title: 'Services | The Starr Conspiracy',
    description:
      'Strategic B2B marketing fundamentals and AI-native solutions from a team that refuses to choose between proven and pioneering.',
  },
};

export default function ServicesPage() {
  const strategicCategories = getStrategicCategories();

  return (
    <>
      <Header />
      <main>
        <ServicesHero />
        <ServiceDualUniverse />
        {strategicCategories.map((category, index) => (
          <ServiceCategoryStrip
            key={category.slug}
            category={category}
            index={index}
          />
        ))}
        <AiCascade />
        <BridgeStatement />
        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}
