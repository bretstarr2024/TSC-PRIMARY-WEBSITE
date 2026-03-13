import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GameOverHero } from '@/components/gameover/GameOverHero';
import { OldGameSection } from '@/components/gameover/OldGameSection';
import { ShiftsSection } from '@/components/gameover/ShiftsSection';
import { NewGameSection } from '@/components/gameover/NewGameSection';
import { ProofSection } from '@/components/gameover/ProofSection';
import { OfferSection } from '@/components/gameover/OfferSection';
import { GameOverForm } from '@/components/gameover/GameOverForm';
import { ClosingSection } from '@/components/gameover/ClosingSection';
import { StickyCtaBar } from '@/components/gameover/StickyCtaBar';

export const metadata: Metadata = {
  title: 'Game Over | The Starr Conspiracy',
  description:
    'The B2B marketing game changed. Most companies are still playing the old one. See where you stand in the new game, and enter to win a free AI-Era Competitive Intelligence Assessment.',
  openGraph: {
    title: 'Game Over | The Starr Conspiracy',
    description:
      'The B2B marketing game changed. Enter to win a free AI-Era Competitive Intelligence Assessment + 15 days of tool access.',
    type: 'website',
  },
};

export default function GameOverPage() {
  return (
    <>
      <Header />
      <main>
        <GameOverHero />
        <OldGameSection />
        <ShiftsSection />
        <NewGameSection />
        <ProofSection />
        <OfferSection />
        <GameOverForm />
        <ClosingSection />
      </main>
      <Footer />
      <StickyCtaBar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Game Over | The Starr Conspiracy',
            description:
              'The B2B marketing game changed. See where you stand in the new game.',
            publisher: {
              '@type': 'Organization',
              name: 'The Starr Conspiracy',
              url: 'https://thestarrconspiracy.com',
            },
          }),
        }}
      />
    </>
  );
}
