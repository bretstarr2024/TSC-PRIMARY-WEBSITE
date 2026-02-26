import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { IndustriesHero } from '@/components/industries/IndustriesHero';
import { IndustryCard } from '@/components/industries/IndustryCard';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { INDUSTRIES } from '@/lib/industries-data';
import { SpaceInvadersGameTrigger } from '@/components/industries/SpaceInvadersGameTrigger';
import { verticalsCapsules } from '@/lib/schema/hub-faqs';
import { getFaqSchema } from '@/lib/schema/service-faq';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';

export const metadata: Metadata = {
  title: 'Verticals | The Starr Conspiracy',
  description:
    'B2B marketing expertise across dozens of verticals — Talent Acquisition, Learning & Development, Employee Engagement, Core HCM, Enterprise SaaS, Cybersecurity, FinTech, and more. Vertical-specific strategies grounded in 25+ years of experience.',
  openGraph: {
    title: 'Verticals | The Starr Conspiracy',
    description:
      'Thousands of B2B technology companies across dozens of verticals. If you sell software or services to businesses, we get you.',
  },
};

export default function VerticalsPage() {
  return (
    <>
      <Header />
      <main>
        <IndustriesHero />

        <section className="pb-24 md:pb-32">
          <div className="section-wide">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INDUSTRIES.map((industry, index) => (
                <IndustryCard
                  key={industry.slug}
                  industry={industry}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <SpaceInvadersGameTrigger />

        <AnswerCapsulesSection
          capsules={verticalsCapsules}
          accentColor="#ED0AD2"
          heading={<>Questions about our <span className="text-sprinkles">vertical expertise.</span></>}
          subheading="How deep B2B technology specialization translates into better marketing results."
        />

        {/* CTA */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="relative z-10 section-wide text-center">
            <div className="flex justify-center">
              <CoinSlotCTA href="/contact?cta=verticals-bottom" ctaId="verticals-bottom" />
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqSchema(verticalsCapsules)),
        }}
      />
    </>
  );
}
