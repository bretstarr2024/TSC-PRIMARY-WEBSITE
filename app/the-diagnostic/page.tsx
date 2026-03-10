import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DiagnosticShell } from '@/components/solve/DiagnosticShell';
import { SolveHero } from '@/components/solve/SolveHero';
import { DomainCards } from '@/components/solve/DomainCards';
import { MissionGrid } from '@/components/solve/MissionGrid';
import { SystemReveal } from '@/components/solve/SystemReveal';
import { SolveCTA } from '@/components/solve/SolveCTA';

const ConstellationStage = dynamic(
  () => import('@/components/solve/ConstellationStage').then((mod) => ({ default: mod.ConstellationStage })),
  { ssr: false }
);

const ConvergenceStage = dynamic(
  () => import('@/components/solve/ConvergenceStage').then((mod) => ({ default: mod.ConvergenceStage })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'The Diagnostic | The Starr Conspiracy',
  description:
    'B2B go-to-market systems fail in three places. Strategy. Demand. Execution. Find your problem and see the solution path.',
  alternates: { canonical: '/the-diagnostic' },
  openGraph: {
    title: 'The Diagnostic | The Starr Conspiracy',
    description:
      'B2B go-to-market systems fail in three places. Strategy. Demand. Execution. Find your problem and see the solution path.',
  },
};

export default function DiagnosticPage() {
  return (
    <DiagnosticShell>
      <Header />
      <main>
        <SolveHero />
        <DomainCards />
        <ConstellationStage />
        <MissionGrid />
        <ConvergenceStage />
        <SystemReveal />
        <SolveCTA />
      </main>
      <Footer />
    </DiagnosticShell>
  );
}
