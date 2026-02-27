import { renderOgImage } from '@/lib/og/render-og-image';
import { getIndustryBySlug, INDUSTRIES } from '@/lib/industries-data';

export const runtime = 'nodejs';
export const alt = 'Vertical | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return INDUSTRIES.map((ind) => ({ slug: ind.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const industry = getIndustryBySlug(params.slug);
  return renderOgImage({
    title: industry?.name ?? 'Verticals',
    badge: 'vertical',
    subtitle: industry?.tagline,
  });
}
