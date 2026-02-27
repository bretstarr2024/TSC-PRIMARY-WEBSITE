import { Suspense } from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactDualPath } from '@/components/contact/ContactDualPath';
import { PongGameTrigger } from '@/components/contact/PongGameTrigger';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { contactBreadcrumb } from '@/lib/schema/breadcrumbs';
import { contactCapsules } from '@/lib/schema/contact-faq';
import { getFaqSchema } from '@/lib/schema/service-faq';

export const metadata: Metadata = {
  title: 'Contact | The Starr Conspiracy',
  description:
    'Get in touch with The Starr Conspiracy. Drop a line or book a call with a senior strategist. B2B marketing that compounds.',
  alternates: { canonical: '/contact' },
  keywords: [
    'contact B2B marketing agency',
    'B2B marketing consultation',
    'The Starr Conspiracy contact',
    'book a marketing strategy call',
  ],
  openGraph: {
    title: 'Contact | The Starr Conspiracy',
    description:
      'Get in touch with The Starr Conspiracy. Drop a line or book a call with a senior strategist.',
  },
};

export default function ContactPage() {
  const breadcrumbSchema = contactBreadcrumb();
  const faqSchema = getFaqSchema(contactCapsules);

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

        <ContactHero />

        <Suspense>
          <ContactDualPath />
        </Suspense>

        <PongGameTrigger />

        <AnswerCapsulesSection
          capsules={contactCapsules}
          accentColor="#FF5910"
          heading={<>Questions about{' '}<span className="text-atomic-tangerine">getting started.</span></>}
          subheading="What to expect when you reach out."
        />
      </main>
      <Footer />
    </>
  );
}
