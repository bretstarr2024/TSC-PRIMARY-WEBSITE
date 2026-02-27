import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Case Studies | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Case Studies',
    badge: 'case-study',
    subtitle: 'Real results from B2B tech companies we partner with.',
  });
}
