import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Comparisons | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Comparisons',
    badge: 'comparison',
    subtitle: 'Side-by-side analysis of B2B marketing strategies and approaches.',
  });
}
