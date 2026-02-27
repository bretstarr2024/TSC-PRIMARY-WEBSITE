import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CareersHero } from '@/components/careers/CareersHero';
import { CultureSection } from '@/components/careers/CultureSection';
import { RolesSection } from '@/components/careers/RolesSection';
import { CareersContact } from '@/components/careers/CareersContact';
import { PacManGameTrigger } from '@/components/careers/PacManGameTrigger';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { careersBreadcrumb } from '@/lib/schema/breadcrumbs';
import { careersCapsules } from '@/lib/schema/careers-faq';
import { getFaqSchema } from '@/lib/schema/service-faq';

export const metadata: Metadata = {
  title: 'Careers | The Starr Conspiracy',
  description:
    'Join The Starr Conspiracy. We are hiring AI Workflow Engineers and Senior B2B Marketing Strategists. Remote-first, senior by default, irreverent on purpose.',
  alternates: { canonical: '/careers' },
  keywords: [
    'B2B marketing careers',
    'AI workflow engineer jobs',
    'B2B marketing strategist',
    'remote marketing jobs',
    'The Starr Conspiracy careers',
  ],
  openGraph: {
    title: 'Careers | The Starr Conspiracy',
    description:
      'We are hiring AI Workflow Engineers and Senior B2B Marketing Strategists. Remote-first, senior by default.',
  },
};

export default function CareersPage() {
  const breadcrumbSchema = careersBreadcrumb();
  const faqSchema = getFaqSchema(careersCapsules);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([breadcrumbSchema, faqSchema]),
          }}
        />

        <CareersHero />
        <CultureSection />
        <RolesSection />
        <CareersContact />

        <PacManGameTrigger />

        <AnswerCapsulesSection
          capsules={careersCapsules}
          accentColor="#73F5FF"
          label="Career Questions"
          heading={<>Common questions about{' '}<span className="text-tidal-wave">working here.</span></>}
          subheading="What you should know before reaching out."
        />
      </main>
      <Footer />
    </>
  );
}
