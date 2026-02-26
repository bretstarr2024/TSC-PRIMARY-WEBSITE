'use client';

import { AnimatedSection } from '@/components/AnimatedSection';

const roles = [
  {
    title: 'AI Workflow Engineer',
    type: 'Full-time · Remote',
    accent: '#E1FF00', // Neon Cactus
    summary:
      'Build the AI infrastructure that powers a marketing agency that actually uses AI. Content pipelines, automation workflows, prompt systems, model evaluation — production code, not prototypes.',
    responsibilities: [
      'Design and maintain autonomous content generation pipelines',
      'Build AI-powered tools that make strategists faster and smarter',
      'Evaluate and integrate new models, APIs, and frameworks as the landscape shifts',
      'Own the technical relationship between our GTM Kernel and downstream outputs',
      'Monitor, tune, and improve system performance and content quality',
    ],
    qualifications: [
      'Deep hands-on experience with LLM APIs (OpenAI, Anthropic, etc.)',
      'Production TypeScript/Node.js — you ship, not just experiment',
      'Comfortable with databases (MongoDB), cron jobs, and infrastructure',
      'Strong opinions about prompt engineering, loosely held',
      'Bonus: marketing or content strategy background',
    ],
  },
  {
    title: 'Senior B2B Marketing Strategist',
    type: 'Full-time · Remote',
    accent: '#73F5FF', // Tidal Wave
    summary:
      'Lead strategy for B2B technology companies that are serious about growth. Brand positioning, go-to-market architecture, demand generation, narrative development — the work that makes everything else work.',
    responsibilities: [
      'Own strategic engagements end-to-end for a portfolio of B2B tech clients',
      'Develop brand positioning, messaging frameworks, and GTM strategies',
      'Translate complex technology stories into market narratives that drive pipeline',
      'Collaborate with AI-native content and demand systems to amplify strategy',
      'Present work directly to CMOs and executive teams',
    ],
    qualifications: [
      '7+ years in B2B marketing strategy (agency or in-house at a tech company)',
      'Track record of building and executing GTM strategies that drove measurable results',
      'Exceptional writing and presentation skills — you think in narratives, not decks',
      'Comfort with ambiguity and a bias toward getting things done',
      'Bonus: experience in HR Tech, SaaS, or enterprise software verticals',
    ],
  },
];

export function RolesSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-wide">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            Open roles
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-16 max-w-2xl">
            Two roles.{' '}
            <span className="text-neon-cactus">No &ldquo;future openings&rdquo; list.</span>
          </h2>
        </AnimatedSection>

        <div className="space-y-8">
          {roles.map((role, i) => (
            <AnimatedSection key={role.title} delay={i * 0.15}>
              <div className="glass rounded-2xl p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {role.title}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: role.accent }}>
                      {role.type}
                    </p>
                  </div>
                </div>

                <p className="text-shroomy leading-relaxed mb-8 max-w-3xl">
                  {role.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                      What you will do
                    </h4>
                    <ul className="space-y-3">
                      {role.responsibilities.map((item) => (
                        <li key={item} className="flex gap-3 text-sm text-shroomy">
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: role.accent }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                      What you bring
                    </h4>
                    <ul className="space-y-3">
                      {role.qualifications.map((item) => (
                        <li key={item} className="flex gap-3 text-sm text-shroomy">
                          <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: role.accent }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
