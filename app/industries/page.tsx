import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { IndustriesHero } from '@/components/industries/IndustriesHero';
import { IndustryCard } from '@/components/industries/IndustryCard';
import { ServiceCTA } from '@/components/services/ServiceCTA';
import { INDUSTRIES } from '@/lib/industries-data';

export const metadata: Metadata = {
  title: 'Industries | The Starr Conspiracy',
  description:
    'B2B marketing expertise across HR Tech, SaaS, FinTech, Cybersecurity, HealthTech, MarTech, DevTools, Cloud Infrastructure, and AI/ML platforms. Industry-specific strategies grounded in 25+ years of experience.',
  openGraph: {
    title: 'Industries | The Starr Conspiracy',
    description:
      'We work exclusively with B2B technology companies. If you sell software or services to businesses, we probably already understand your market.',
  },
};

export default function IndustriesPage() {
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

        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}
