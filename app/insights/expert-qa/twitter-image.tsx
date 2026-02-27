import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Expert Q&A | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Expert Q&A',
    badge: 'expert-qa',
    subtitle: 'Perspectives from TSC leaders on the challenges B2B marketers face.',
  });
}
