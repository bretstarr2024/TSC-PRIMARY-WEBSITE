import { renderOgImage } from '@/lib/og/render-og-image';
import { getCaseStudyBySlug } from '@/lib/work-data';

export const runtime = 'nodejs';
export const alt = 'Case Study | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image({ params }: { params: { slug: string } }) {
  const study = getCaseStudyBySlug(params.slug);
  return renderOgImage({
    title: study?.client ?? 'Case Study',
    badge: 'work',
    subtitle: study?.headline ?? '',
  });
}
