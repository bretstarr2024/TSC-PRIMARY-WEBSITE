import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Careers | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Careers',
    badge: 'careers',
    subtitle: 'Join the team rewriting the rules of B2B marketing.',
  });
}
