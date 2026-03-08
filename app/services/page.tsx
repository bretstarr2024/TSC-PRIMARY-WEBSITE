import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServicesHero } from '@/components/services/ServicesHero';
import { ServiceDualUniverse } from '@/components/services/ServiceDualUniverse';
import { ServiceCategoryStrip } from '@/components/services/ServiceCategoryStrip';
import { AiCascade } from '@/components/services/AiCascade';
import { BridgeStatement } from '@/components/services/BridgeStatement';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { getStrategicCategories, getAiCategory } from '@/lib/services-data';
import { servicesCapsules } from '@/lib/schema/hub-faqs';
import { getFaqSchema } from '@/lib/schema/service-faq';

export const metadata: Metadata = {
  title: 'Services | The Starr Conspiracy',
  description:
    'Full-stack B2B marketing services: brand strategy, demand generation, digital performance, content & creative, advisory, and AI-native marketing solutions.',
  alternates: { canonical: '/services' },
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
          heading={<>Common questions about <span className="text-white font-extrabold">our services.</span></>}
          subheading="What B2B marketing leaders want to know before engaging an agency."
        />

        {/* CTA */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="relative z-10 section-wide text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-white leading-tight mb-4">
              Ready to build your{' '}
              <span className="font-extrabold">marketing engine?</span>
            </h2>
            <p className="text-lg text-shroomy mb-12 max-w-xl mx-auto">
              Whether you need strategic fundamentals, AI transformation, or both, let&apos;s figure out what moves the needle.
            </p>
            <div className="flex justify-center">
              <CoinSlotCTA href="/contact?cta=services-bottom" ctaId="services-bottom" />
            </div>
          </div>
        </section>
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
