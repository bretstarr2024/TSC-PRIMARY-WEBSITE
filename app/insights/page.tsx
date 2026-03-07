import { Metadata } from 'next';
import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AnswerCapsulesSection } from '@/components/AnswerCapsulesSection';
import { getClientConfig } from '@/lib/kernel/client';
import { insightsCapsules } from '@/lib/schema/hub-faqs';
import { getFaqSchema } from '@/lib/schema/service-faq';
import { SnakeGameTrigger } from '@/components/insights/SnakeGameTrigger';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Insights | The Starr Conspiracy',
  description: 'Strategic insights on B2B marketing, AI transformation, and growth strategy from The Starr Conspiracy.',
  alternates: { canonical: '/insights' },
};

const CONTENT_TYPES = [
  {
    type: 'blog',
    label: 'Blog',
    description: 'Strategic perspectives on B2B marketing, AI, and growth.',
    href: '/insights/blog',
    color: '#FF5910',
    icon: '01',
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Direct answers to the questions B2B marketers actually ask.',
    href: '/insights/faq',
    color: '#E1FF00',
    icon: '02',
  },
  {
    type: 'glossary',
    label: 'Glossary',
    description: 'Clear definitions for the terms that matter in modern marketing.',
    href: '/insights/glossary',
    color: '#73F5FF',
    icon: '03',
  },
  {
    type: 'comparisons',
    label: 'Comparisons',
    description: 'Side-by-side analyses to inform your strategic decisions.',
    href: '/insights/comparisons',
    color: '#ED0AD2',
    icon: '04',
  },
  {
    type: 'expert-qa',
    label: 'Expert Q&A',
    description: 'Candid perspectives from experienced marketing leaders.',
    href: '/insights/expert-qa',
    color: '#FFBDAE',
    icon: '05',
  },
  {
    type: 'news',
    label: 'News & Analysis',
    description: 'What\'s happening in B2B marketing — with our take on why it matters.',
    href: '/insights/news',
    color: '#088BA0',
    icon: '06',
  },
  {
    type: 'industry-briefs',
    label: 'Industry Briefs',
    description: 'Data-driven snapshots of market trends and buyer behavior.',
    href: '/insights/industry-briefs',
    color: '#D97706',
    icon: '08',
  },
  {
    type: 'tools',
    label: 'Tools',
    description: 'Checklists, assessments, and calculators for B2B marketing leaders.',
    href: '/insights/tools',
    color: '#F472B6',
    icon: '09',
  },
  {
    type: 'videos',
    label: 'Videos',
    description: 'Strategic video perspectives on B2B marketing, AI, and growth.',
    href: '/insights/videos',
    color: '#10B981',
    icon: '10',
  },
  {
    type: 'infographics',
    label: 'Infographics',
    description: 'Visual breakdowns of data, frameworks, and strategies worth sharing.',
    href: '/insights/infographics',
    color: '#818CF8',
    icon: '11',
  },
];

export default function InsightsPage() {
  const config = getClientConfig();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        {/* Hero */}
        <section className="section-wide mb-20">
          <AnimatedSection>
            <div className="max-w-4xl">
              <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
                Insights
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.1] mb-6">
                Strategic clarity.{' '}
                <span className="text-white font-extrabold">Measurable growth.</span>
              </h1>
              <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
                Here&apos;s the thinking behind it.
              </p>
            </div>
          </AnimatedSection>
        </section>

        {/* Buyer Goal Clusters */}
        {config.jtbd.length > 0 && (
          <section className="section-wide mb-20">
            <AnimatedSection>
              <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-8">
                What are you trying to do?
              </p>
            </AnimatedSection>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.jtbd.map((job, i) => (
                <StaggerItem key={i}>
                  <div className="glass rounded-xl p-6 h-full">
                    <h3 className="text-white font-semibold text-lg mb-2">{job.jobName}</h3>
                    <p className="text-white text-sm mb-3">{job.startingState}</p>
                    <div className="flex items-center gap-2 text-white text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span>{job.desiredState}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        )}

        {/* Content Type Grid */}
        <section className="section-wide">
          <AnimatedSection>
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-8">
              Explore by type
            </p>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTENT_TYPES.map((ct) => (
              <StaggerItem key={ct.type}>
                <Link
                  href={ct.href}
                  className="group glass rounded-xl p-6 block h-full hover:no-underline transition-all duration-300 hover:border-white/10"
                  style={{ borderLeftColor: ct.color, borderLeftWidth: 3 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: ct.color }}
                    >
                      {ct.label}
                    </span>
                    <span className="text-xs text-greige font-mono">{ct.icon}</span>
                  </div>
                  <p className="text-sm text-white leading-relaxed">
                    {ct.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-greige group-hover:text-white/80 transition-colors">
                    <span>Explore</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        <SnakeGameTrigger />

        <AnswerCapsulesSection
          capsules={insightsCapsules}
          accentColor="#73F5FF"
          heading={<>About our <span className="text-tidal-wave">content engine.</span></>}
          subheading="How TSC builds AI-powered content that earns authority with buyers and search engines alike."
        />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqSchema(insightsCapsules)),
        }}
      />
    </>
  );
}
