import type { Metadata } from 'next';
import BookPageContent from '@/components/BookPageContent';

export const metadata: Metadata = {
  title: 'Book a Call | The Starr Conspiracy',
  description:
    'Schedule a 25-minute strategy call with a senior B2B marketing strategist at The Starr Conspiracy. No pitch decks, just real conversation about what you need.',
  alternates: { canonical: '/book' },
  keywords: [
    'book B2B marketing call',
    'B2B marketing strategy session',
    'The Starr Conspiracy consultation',
    'schedule marketing strategy call',
  ],
  openGraph: {
    title: 'Book a Call | The Starr Conspiracy',
    description:
      'Schedule a 25-minute strategy call with a senior B2B marketing strategist. No pitch decks, just real conversation.',
  },
};

export default function BookPage() {
  return <BookPageContent />;
}
