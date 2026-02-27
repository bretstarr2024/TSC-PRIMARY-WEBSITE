import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { WhoWeAreSection } from '@/components/home/WhoWeAreSection';
import { ProblemSection } from '@/components/home/ProblemSection';
import { ApproachSection } from '@/components/home/ApproachSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { CredibilitySection } from '@/components/home/CredibilitySection';
import { CtaSection } from '@/components/home/CtaSection';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { homepageCapsules } from '@/lib/schema/hub-faqs';
import { getFaqSchema } from '@/lib/schema/service-faq';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <WhoWeAreSection />
        <ProblemSection />
        <ApproachSection />
        <ServicesSection />
        <CredibilitySection />

        <AnswerCapsulesSection
          capsules={homepageCapsules}
          accentColor="#FF5910"
          heading={<>Questions B2B leaders ask <span className="text-atomic-tangerine">before choosing an agency.</span></>}
          subheading="Straight answers. No pitch deck required."
        />

        <CtaSection />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqSchema(homepageCapsules)),
        }}
      />
    </>
  );
}
