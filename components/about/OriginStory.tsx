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
              <div className="grid grid-cols-3 gap-4">
                {[
                  { stat: '1999', label: 'Founded' },
                  { stat: '3,000+', label: 'B2B tech clients' },
                  { stat: '100,000', label: 'Shots of tequila' },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-xl p-6">
                    <p className="text-2xl md:text-3xl font-bold text-atomic-tangerine mb-2">
                      {item.stat}
                    </p>
                    <p className="text-sm text-greige">{item.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="glass rounded-xl p-8 mt-6">
                <p className="text-sm text-greige uppercase tracking-wider mb-4">The book</p>
                <p className="text-white font-semibold text-xl mb-3">
                  A Humble Guide to Fixing Everything in Brand, Marketing, and Sales
                </p>
                <p className="text-shroomy text-sm leading-relaxed mb-3">
                  Nearly every tech company is experiencing performance declines from their
                  tried-and-true sales and marketing strategies. Many don&apos;t know why. Bret
                  Starr&apos;s definitive take on what&apos;s broken in B2B marketing and how to fix
                  it — the playbook behind 3,000+ client engagements.
                </p>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-atomic-tangerine font-semibold">4.6 ★</span>
                  <span className="text-greige text-sm">451 ratings on Amazon</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.amazon.com/Humble-Guide-Fixing-Everything-Marketing/dp/B0CJL6LBQF/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-atomic-tangerine/10 border border-atomic-tangerine/30 rounded-lg text-atomic-tangerine text-sm font-medium hover:bg-atomic-tangerine/20 transition-colors"
                  >
                    Get the Book &rarr;
                  </a>
                  <a
                    href="https://www.linkedin.com/newsletters/7114623320527929345/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-shroomy text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Subscribe to Newsletter
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
