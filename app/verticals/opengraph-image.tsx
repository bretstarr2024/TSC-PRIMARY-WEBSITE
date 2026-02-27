import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Verticals | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Verticals',
    badge: 'verticals',
    subtitle: 'B2B technology companies across dozens of verticals.',
  });
}
