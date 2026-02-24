import { Metadata } from 'next';
import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GalagaGameTrigger } from '@/components/work/GalagaGameTrigger';

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
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <GradientText>Work</GradientText>
            </h1>
            <p className="text-xl text-shroomy max-w-2xl">
              Coming soon.
            </p>
          </AnimatedSection>

          <GalagaGameTrigger />
        </div>
      </main>
      <Footer />
    </>
  );
}
