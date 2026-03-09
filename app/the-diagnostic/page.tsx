import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SolveHero } from '@/components/solve/SolveHero';
import { DomainCards } from '@/components/solve/DomainCards';
import { MissionGrid } from '@/components/solve/MissionGrid';
import { SystemReveal } from '@/components/solve/SystemReveal';
import { SolveCTA } from '@/components/solve/SolveCTA';

export const metadata: Metadata = {
  title: 'The Diagnostic | The Starr Conspiracy',
  description:
    'B2B go-to-market systems fail in three places. Strategy. Demand. Execution. Find your mission and see the solution path.',
  alternates: { canonical: '/the-diagnostic' },
  openGraph: {
    title: 'The Diagnostic | The Starr Conspiracy',
    description:
      'B2B go-to-market systems fail in three places. Strategy. Demand. Execution. Find your mission and see the solution path.',
  },
};

export default function DiagnosticPage() {
  return (
    <>
      <Header />
      <main>
        <SolveHero />
        <DomainCards />
        <MissionGrid />
        <SystemReveal />
        <SolveCTA />
      </main>
      <Footer />
    </>
  );
}
