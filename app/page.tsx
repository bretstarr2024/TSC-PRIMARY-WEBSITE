import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { ProblemSection } from '@/components/home/ProblemSection';
import { ApproachSection } from '@/components/home/ApproachSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { CredibilitySection } from '@/components/home/CredibilitySection';
import { CtaSection } from '@/components/home/CtaSection';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <ApproachSection />
        <ServicesSection />
        <CredibilitySection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
