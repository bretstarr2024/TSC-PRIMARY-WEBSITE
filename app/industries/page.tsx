import { Metadata } from 'next';
import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Industries | The Starr Conspiracy',
  description:
    'B2B marketing expertise across HRTech, SaaS, FinTech, and more. Industry-specific strategies grounded in 25+ years of experience.',
  openGraph: {
    title: 'Industries | The Starr Conspiracy',
    description:
      'B2B marketing expertise across HRTech, SaaS, FinTech, and more. Industry-specific strategies grounded in 25+ years of experience.',
  },
};

export default function IndustriesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <div className="section-wide">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <GradientText>Industries</GradientText>
            </h1>
            <p className="text-xl text-shroomy max-w-2xl">
              Coming soon.
            </p>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </>
  );
}
