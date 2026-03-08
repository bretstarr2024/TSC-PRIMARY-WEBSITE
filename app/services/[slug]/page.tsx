import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceDetailSection } from '@/components/services/ServiceDetailSection';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';
import { ServiceSubpageHero } from '@/components/services/ServiceSubpageHero';
import { RelatedServices } from '@/components/services/RelatedServices';
import {
  SERVICE_CATEGORIES,
  getCategoryBySlug,
  getRelatedCategories,
} from '@/lib/services-data';
import { getServiceFaqSchema } from '@/lib/schema/service-faq';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};

  return {
    title: `${category.name} | Services | The Starr Conspiracy`,
    description: category.description,
    alternates: { canonical: `/services/${params.slug}` },
    openGraph: {
      title: `${category.name} | The Starr Conspiracy`,
      description: category.tagline + ' ' + category.description,
    },
  };
}

export default function ServiceCategoryPage({ params }: PageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const related = getRelatedCategories(params.slug, 3);

  return (
    <>
      <Header />
      <main>
        <ServiceSubpageHero category={category} />

        <div className="section-wide">
          <div className="divide-y divide-white/5">
            {category.services.map((service, index) => (
              <ServiceDetailSection
                key={service.slug}
                service={service}
                accentColor={category.color}
                index={index}
              />
            ))}
          </div>
        </div>

        <AnswerCapsulesSection
          capsules={category.answerCapsules}
          accentColor={category.color}
          heading={<>What you need to know about{' '}<span style={{ color: category.color }}>{category.name}.</span></>}
        />

        <RelatedServices categories={related} currentSlug={params.slug} />
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
          __html: JSON.stringify(getServiceFaqSchema(category.answerCapsules)),
        }}
      />
    </>
  );
}
