import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CaseStudyContent } from '@/components/work/CaseStudyContent';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';
import {
  CASE_STUDIES,
  getCaseStudyBySlug,
  getAdjacentCaseStudies,
} from '@/lib/work-data';
import { workCaseStudyBreadcrumb } from '@/lib/schema/breadcrumbs';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({
    slug: cs.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) return {};

  return {
    title: `${study.client} | Examples | The Starr Conspiracy`,
    description: `${study.headline} ${study.subheading}`,
    alternates: { canonical: `/examples/${params.slug}` },
    openGraph: {
      title: `${study.client} | Examples | The Starr Conspiracy`,
      description: study.headline,
    },
  };
}

export default function CaseStudyPage({ params }: PageProps) {
  const study = getCaseStudyBySlug(params.slug);
  if (!study) notFound();

  const { prev, next } = getAdjacentCaseStudies(params.slug);

  return (
    <>
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(workCaseStudyBreadcrumb(study.client)),
          }}
        />

        <CaseStudyContent study={study} prev={prev} next={next} />

        {/* CTA */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="relative z-10 section-wide text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-white leading-tight mb-4">
              Like what you see?{' '}
              <span className="font-extrabold">Let&apos;s make yours next.</span>
            </h2>
            <p className="text-lg text-shroomy mb-12 max-w-xl mx-auto">
              Tell us where you&apos;re headed. We&apos;ll show you how to get there faster.
            </p>
            <div className="flex justify-center">
              <CoinSlotCTA
                href={`/contact?cta=work-${study.slug}`}
                ctaId={`work-${study.slug}`}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
