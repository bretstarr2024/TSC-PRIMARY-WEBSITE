import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedInfographicById, getAllInfographicIds, Infographic } from '@/lib/resources-db';
import { infographicBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllInfographicIds();
    return ids.map((infographicId) => ({ infographicId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ infographicId: string }>;
}): Promise<Metadata> {
  const { infographicId } = await params;
  try {
    const ig = await getPublishedInfographicById(infographicId);
    if (!ig) return { title: 'Infographic Not Found' };
    return {
      title: `${ig.title} | Infographics`,
      description: ig.description.slice(0, 160),
    };
  } catch {
    return { title: 'Infographic' };
  }
}

export default async function InfographicDetailPage({
  params,
}: {
  params: Promise<{ infographicId: string }>;
}) {
  const { infographicId } = await params;

  let ig: Infographic | null = null;
  try {
    ig = await getPublishedInfographicById(infographicId);
  } catch {
    // empty
  }

  if (!ig) notFound();

  const breadcrumbSchema = infographicBreadcrumb(ig.title);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <article className="section-wide max-w-4xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />

          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Grist</Link>
            <span>/</span>
            <Link href="/insights/infographics" className="hover:text-atomic-tangerine">Infographics</Link>
            <span>/</span>
            <span className="text-shroomy">{ig.title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {ig.title}
          </h1>

          <p className="text-xl text-shroomy leading-relaxed mb-8">
            {ig.description}
          </p>

          {ig.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {ig.tags.map((tag) => (
                <span key={tag} className="text-xs text-greige bg-white/5 rounded-full px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="glass rounded-xl overflow-hidden mb-12">
            <Image
              src={ig.imageUrl}
              alt={ig.altText || ig.title}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>

          <RelatedContent
            currentType="infographic"
            currentId={ig.infographicId}
            tags={ig.tags}
            clusterName={ig.clusterName}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
