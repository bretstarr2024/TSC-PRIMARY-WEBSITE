import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServicesHero } from '@/components/services/ServicesHero';
import { ServiceDualUniverse } from '@/components/services/ServiceDualUniverse';
import { ServiceCategoryStrip } from '@/components/services/ServiceCategoryStrip';
import { AiCascade } from '@/components/services/AiCascade';
import { BridgeStatement } from '@/components/services/BridgeStatement';
import { ServiceCTA } from '@/components/services/ServiceCTA';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { getStrategicCategories, getAiCategory } from '@/lib/services-data';
import { servicesCapsules } from '@/lib/schema/hub-faqs';
import { getFaqSchema } from '@/lib/schema/service-faq';

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
  const aiCategory = getAiCategory();

  return (
    <>
      <Header />
      <main>
        <ServicesHero />
        <ServiceDualUniverse aiCategory={aiCategory} />
        {strategicCategories.map((category, index) => (
          <ServiceCategoryStrip
            key={category.slug}
            category={category}
            index={index}
          />
        ))}
        <AiCascade aiCategory={aiCategory} />
        <BridgeStatement />

        <AnswerCapsulesSection
          capsules={servicesCapsules}
          accentColor="#FF5910"
          heading={<>Common questions about <span className="text-atomic-tangerine">our services.</span></>}
          subheading="What B2B marketing leaders want to know before engaging an agency."
        />

        <ServiceCTA />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqSchema(servicesCapsules)),
        }}
      />
    </>
  );
}
