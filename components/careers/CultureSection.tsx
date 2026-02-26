'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

const values = [
  {
    label: 'Remote-first',
    description:
      'No office. No commute. No dress code. We hire the best people regardless of zip code and trust them to figure out where they do their best work.',
  },
  {
    label: 'Senior by default',
    description:
      'We do not have layers of junior staff padding timesheets. Every person on the team owns outcomes, talks to clients, and ships work that matters.',
  },
  {
    label: 'AI-native operations',
    description:
      'We use AI the way we tell our clients to — embedded in every workflow, not bolted on as a demo. You will work with tools and systems most agencies have not built yet.',
  },
  {
    label: 'Irreverent on purpose',
    description:
      'B2B marketing does not have to be boring. We are strategic and rigorous, but we refuse to be dull. If you have ever been told you are "too direct," you will fit in here.',
  },
];

export function CultureSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-wide">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: heading */}
          <div>
            <AnimatedSection>
              <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
                How we work
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Built for people who{' '}
                <span className="text-atomic-tangerine">do not need to be managed.</span>
              </h2>
            </AnimatedSection>
          </div>

          {/* Right: values grid */}
          <div className="lg:col-span-2">
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => (
                <StaggerItem key={v.label}>
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-white font-semibold text-lg mb-2">{v.label}</h3>
                    <p className="text-shroomy text-sm leading-relaxed">{v.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
