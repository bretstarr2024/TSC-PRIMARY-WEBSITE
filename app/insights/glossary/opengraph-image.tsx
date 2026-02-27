import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Glossary | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Glossary',
    badge: 'glossary',
    subtitle: 'Key terms in B2B marketing, demand generation, and AI strategy.',
  });
}
