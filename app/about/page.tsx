import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About | The Starr Conspiracy',
  description:
    'Meet the team behind The Starr Conspiracy — 25+ years of B2B marketing expertise where fundamentals meet AI transformation.',
  openGraph: {
    title: 'About | The Starr Conspiracy',
    description:
      'Meet the team behind The Starr Conspiracy — 25+ years of B2B marketing expertise where fundamentals meet AI transformation.',
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <div className="section-wide">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            About
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
