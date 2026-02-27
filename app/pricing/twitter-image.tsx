import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Pricing | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Pricing',
    badge: 'pricing',
    subtitle: 'Subscription and project-based models built for B2B tech companies.',
  });
}
