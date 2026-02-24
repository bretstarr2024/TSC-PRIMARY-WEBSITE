import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PacManGameTrigger } from '@/components/careers/PacManGameTrigger';

export const metadata: Metadata = {
  title: 'Careers | The Starr Conspiracy',
  description:
    'Join The Starr Conspiracy. We are building the future of B2B marketing — and we need people who refuse to choose between proven and pioneering.',
  openGraph: {
    title: 'Careers | The Starr Conspiracy',
    description:
      'Join The Starr Conspiracy. We are building the future of B2B marketing — and we need people who refuse to choose between proven and pioneering.',
  },
};

export default function CareersPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <div className="section-wide">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Careers
          </h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Coming soon.
          </p>

          <PacManGameTrigger />
        </div>
      </main>
      <Footer />
    </>
  );
}
