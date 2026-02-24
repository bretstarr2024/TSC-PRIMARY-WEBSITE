import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ServiceDetailSection } from '@/components/services/ServiceDetailSection';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { ServiceCTA } from '@/components/services/ServiceCTA';
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
        <ServiceCTA />
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
