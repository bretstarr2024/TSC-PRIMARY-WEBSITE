import { renderOgImage } from '@/lib/og/render-og-image';
import { getCategoryBySlug, SERVICE_CATEGORIES } from '@/lib/services-data';

export const runtime = 'nodejs';
export const alt = 'Service | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  return renderOgImage({
    title: category?.name ?? 'Services',
    badge: 'service',
    subtitle: category?.tagline,
  });
}
