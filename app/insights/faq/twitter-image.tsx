import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'FAQ | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'FAQ',
    badge: 'faq',
    subtitle: 'Answers to common questions about B2B marketing strategy and execution.',
  });
}
