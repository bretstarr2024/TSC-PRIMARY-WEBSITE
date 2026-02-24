'use client';

import { AnimatedSection } from '@/components/AnimatedSection';

export function OriginStory() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: story */}
          <div>
            <AnimatedSection>
              <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
                Est. 1999
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
                You shouldn&apos;t have to teach your agency what your company does for a living.
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="space-y-6 text-lg text-shroomy leading-relaxed">
                <p>
                  That was the principle Bret Starr built The Starr Conspiracy on in 1999.
                  After years on the brand side watching agencies stumble through their own
                  learning curves on his dime, he decided there had to be a better model:
                  an agency that already understood B2B technology — the buyers, the sales
                  cycles, the competitive dynamics — before the first meeting.
                </p>
                <p>
                  Twenty-five years and more than 3,000 clients later, that founding
                  instinct still drives everything we do. We don&apos;t dabble in B2B. We don&apos;t
                  &ldquo;also do tech.&rdquo; This is all we&apos;ve ever done — and we&apos;ve been doing it
                  longer than most agencies have existed.
                </p>
                <p>
                  What&apos;s changed is the toolkit. While the fundamentals of great marketing
                  haven&apos;t moved — know your buyer, differentiate or die, measure what
                  matters — the technology has transformed. We didn&apos;t wait for AI to become
                  a trend. We started building with it years before the industry caught up.
                  Today, AI is wired into how we think, how we create, and how we deliver
                  results for clients.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right: stats */}
          <div>
            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { stat: '1999', label: 'Founded' },
                  { stat: '3,000+', label: 'B2B tech clients' },
                  { stat: '25+', label: 'Years of experience' },
                  { stat: '100+', label: 'Brands repositioned' },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-xl p-6">
                    <p className="text-3xl md:text-4xl font-bold text-atomic-tangerine mb-2">
                      {item.stat}
                    </p>
                    <p className="text-sm text-greige">{item.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="glass rounded-xl p-8 mt-6">
                <p className="text-sm text-greige uppercase tracking-wider mb-3">The book</p>
                <p className="text-white font-semibold text-lg mb-2">
                  A Humble Guide to Fixing Everything in Brand, Marketing, and Sales
                </p>
                <p className="text-shroomy text-sm leading-relaxed">
                  Bret Starr&apos;s definitive take on what&apos;s broken in B2B marketing and how to fix it.
                  The playbook behind 25 years of work.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
