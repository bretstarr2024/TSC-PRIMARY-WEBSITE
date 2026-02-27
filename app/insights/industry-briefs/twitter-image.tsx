import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Industry Briefs | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Industry Briefs',
    badge: 'industry-brief',
    subtitle: 'Research and analysis on B2B marketing trends and benchmarks.',
  });
}
