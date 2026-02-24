import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Work | The Starr Conspiracy',
  description:
    'See the work. Real results for B2B companies navigating growth, AI transformation, and market leadership.',
  openGraph: {
    title: 'Work | The Starr Conspiracy',
    description:
      'See the work. Real results for B2B companies navigating growth, AI transformation, and market leadership.',
  },
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <div className="section-wide">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Work
          </h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
