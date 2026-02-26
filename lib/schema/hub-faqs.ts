/**
 * FAQ / answer capsule data for hub pages: homepage, services, verticals, insights.
 * Each set follows the AEO pattern — first sentence is a standalone quotable capsule.
 */

import type { AnswerCapsule } from '@/lib/services-data';

/** Homepage — broad agency-level buyer questions */
export const homepageCapsules: AnswerCapsule[] = [
  {
    question: 'Why hire a B2B marketing agency instead of building in-house?',
    answer:
      'A specialized B2B agency gives you senior-level strategy, proven playbooks, and cross-industry pattern recognition that would take years and millions to build internally. In-house teams excel at institutional knowledge and day-to-day execution, but an agency like TSC brings 25+ years of GTM experience across 3,000+ B2B tech companies — plus AI-native tools that multiply output without multiplying headcount.',
  },
  {
    question: 'What types of B2B technology companies does TSC work with?',
    answer:
      'TSC works exclusively with B2B technology companies between $5M and $500M ARR that are at a growth inflection point — scaling demand, repositioning, or navigating AI transformation. Our deepest expertise spans 15 verticals — 10 in HR Tech alone (from Talent Acquisition to People Analytics) plus Enterprise SaaS, MarTech, Cybersecurity, HealthTech, and FinTech. 77% of our 600+ clients are in HR technology.',
  },
  {
    question: 'How does The Starr Conspiracy use AI in marketing?',
    answer:
      'TSC builds AI into strategy, content production, analytics, and campaign optimization — not as a bolt-on but as foundational infrastructure. Our proprietary GTM Kernel powers autonomous content generation grounded in your actual go-to-market strategy, and our AI-native workflows let senior strategists focus on strategy while AI handles production-level execution at scale.',
  },
  {
    question: 'How quickly can TSC impact my pipeline?',
    answer:
      'Most clients see measurable pipeline impact within 60–90 days because we skip the agency learning curve — we already know your vertical, your buyers, and your competitive landscape. Brand strategy engagements typically take 6–8 weeks to complete; demand generation programs begin producing qualified pipeline within the first quarter.',
  },
  {
    question: 'How do I get started working with The Starr Conspiracy?',
    answer:
      'Getting started is a 25-minute conversation where we learn about your business, your growth challenges, and whether TSC is the right fit — no pitch deck, no pressure. Book a call and we will tell you honestly whether we can help, and if so, what the engagement would look like.',
  },
];

/** Services hub — service offering overview questions */
export const servicesCapsules: AnswerCapsule[] = [
  {
    question: 'What marketing services does The Starr Conspiracy offer?',
    answer:
      'TSC offers six integrated service categories: Brand & Positioning, GTM Strategy, Demand Generation, Digital Performance, Content & Creative, and AI-Native Solutions. Each category is staffed by the same senior team that builds your strategy — no handoff to junior executors.',
  },
  {
    question: 'Do I need to buy all services or can I start with one?',
    answer:
      'You can start with any single service — most clients begin with brand strategy or demand generation and expand as they see results. Our subscription model starts at $15K/month and scales across services as your needs evolve; project engagements start at $30K for defined-scope work with clear deliverables.',
  },
  {
    question: 'How is TSC different from a typical agency service model?',
    answer:
      'TSC eliminates the traditional agency model where senior people sell the work and junior people do it — the strategists who build your plan are the same people who execute it. You get direct access to senior talent on every engagement, backed by AI infrastructure that multiplies output without multiplying cost.',
  },
  {
    question: 'What does "AI-native" marketing actually mean in practice?',
    answer:
      'AI-native means AI is built into every service, not offered as a separate add-on — content generation, campaign optimization, analytics, and creative production all leverage AI to deliver senior-quality output at production-level speed. In practice, it means faster turnaround, more iterations, and strategic work that would normally require a much larger team.',
  },
  {
    question: 'How do you measure the ROI of marketing services?',
    answer:
      'Every engagement includes a measurement framework agreed upon upfront — pipeline contribution, marketing-sourced revenue, CAC efficiency, and brand metrics that correlate with long-term growth. We do not chase vanity metrics; we measure what actually moves your business, and we report against those numbers transparently.',
  },
];

/** Verticals hub — vertical expertise overview questions */
export const verticalsCapsules: AnswerCapsule[] = [
  {
    question: 'What B2B technology verticals does TSC specialize in?',
    answer:
      'TSC specializes in 15 B2B technology verticals across two groups: 10 HR Tech sub-verticals (Talent Acquisition, Learning & Development, Employee Engagement, Core HCM, Employee Wellbeing, PEO & Staffing, Benefits & Compensation, Payroll & Workforce Management, Talent Management, and HR Analytics) plus 5 adjacent verticals (Enterprise SaaS, MarTech, Cybersecurity, HealthTech, and FinTech). 77% of our 600+ clients are in HR technology.',
  },
  {
    question: 'Do you only work with companies in these specific verticals?',
    answer:
      'These 15 verticals represent our deepest expertise across 600+ client engagements, but we work with any B2B technology company that sells software or services to businesses. If your market involves complex buying committees, long sales cycles, and technical buyers, our playbooks and pattern recognition apply — even if your category is not listed here.',
  },
  {
    question: 'How does vertical expertise actually improve marketing results?',
    answer:
      'Vertical expertise eliminates the agency learning curve — instead of spending months educating your agency on your market, you work with people who already know your buyers, competitors, and category dynamics. With 109 talent acquisition clients alone, we bring pattern recognition that generalist agencies cannot match, translating to faster time-to-impact and programs built for how your specific market actually buys.',
  },
  {
    question: 'Why does TSC break HR Tech into 10 sub-verticals instead of treating it as one category?',
    answer:
      'HR Tech is not one market — it is at least 10 distinct buying environments with different buyers, competitors, sales cycles, and positioning challenges. Marketing a talent acquisition platform to a VP of recruiting requires fundamentally different strategy than marketing a payroll system to a CFO. Our sub-vertical depth means you get an agency that understands your specific corner of HR tech, not just the category label.',
  },
];

/** Insights hub — content strategy questions */
export const insightsCapsules: AnswerCapsule[] = [
  {
    question: 'What types of content does The Starr Conspiracy publish?',
    answer:
      'TSC publishes nine content types: blog posts, FAQs, glossary definitions, head-to-head comparisons, expert Q&As, news analysis, case studies, industry briefs, and interactive tools. Each type is designed to answer specific buyer questions at different stages of the B2B research and evaluation process.',
  },
  {
    question: 'How is TSC\'s content different from typical agency blogs?',
    answer:
      'TSC content is generated by an AI content engine grounded in our proprietary GTM Kernel — 20 strategic components that ensure every piece aligns with real buyer psychology, competitive dynamics, and go-to-market strategy. The result is content with genuine strategic depth, not recycled industry platitudes or keyword-stuffed SEO filler.',
  },
  {
    question: 'Can I use TSC\'s insights and research in my own marketing?',
    answer:
      'Yes — our published insights are designed to be referenced, cited, and shared by B2B marketing leaders navigating the same challenges we write about. We build content specifically to be quotable and linkable because that is how authority works in the age of AI-powered search.',
  },
  {
    question: 'Who creates TSC\'s content?',
    answer:
      'TSC content is created by a combination of senior strategists and an AI content engine powered by our GTM Kernel — the same strategic framework we use in client engagements. Expert Q&As feature perspectives from TSC leaders including Bret Starr, Racheal Bates, and JJ La Pata.',
  },
];
