import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { IndustryHero } from '@/components/industries/IndustryHero';
import { IndustryContent } from '@/components/industries/IndustryContent';
import { RelatedIndustries } from '@/components/industries/RelatedIndustries';
import {
  INDUSTRIES,
  getIndustryBySlug,
  getRelatedIndustries,
} from '@/lib/industries-data';
import { industryBreadcrumb } from '@/lib/schema/breadcrumbs';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return INDUSTRIES.map((ind) => ({
    slug: ind.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) return {};

  return {
    title: `${industry.name} Marketing | Industries | The Starr Conspiracy`,
    description: `${industry.tagline} ${industry.description}`,
    openGraph: {
      title: `${industry.name} Marketing | The Starr Conspiracy`,
      description: industry.description,
    },
  };
}

export default function IndustryPage({ params }: PageProps) {
  const industry = getIndustryBySlug(params.slug);
  if (!industry) notFound();

  const related = getRelatedIndustries(params.slug, 3);

  return (
    <>
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(industryBreadcrumb(industry.name)),
          }}
        />

        <IndustryHero industry={industry} />
        <IndustryContent industry={industry} />
        <RelatedIndustries industries={related} />
      </main>
      <Footer />
    </>
  );
}
