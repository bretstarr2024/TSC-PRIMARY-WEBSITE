import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'About The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'About The Starr Conspiracy',
    badge: 'about',
    subtitle: '25+ years of B2B marketing fundamentals meets AI-native capability.',
  });
}
