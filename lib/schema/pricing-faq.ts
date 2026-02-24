/**
 * FAQ data and schema for the Pricing page.
 * Answer capsules addressing common pricing and engagement model questions.
 */

import type { AnswerCapsule } from '@/lib/services-data';

export const pricingCapsules: AnswerCapsule[] = [
  {
    question: 'Why does TSC charge premium agency rates?',
    answer:
      'TSC charges premium rates because every engagement is staffed with senior strategists and executives, not junior account managers learning on your budget. You get 25+ years of B2B marketing pattern recognition combined with proprietary AI infrastructure that multiplies output — the combination delivers more strategic value per dollar than agencies that charge less but staff with less.',
  },
  {
    question: "What's the difference between TSC's subscription and project models?",
    answer:
      'Subscriptions provide ongoing strategic marketing partnership with embedded senior talent starting at $15K/month, while projects deliver defined-scope work with clear deliverables starting at $30K minimum. Subscriptions are for companies that need continuous marketing leadership and execution; projects are for companies with a specific initiative — repositioning, GTM launch, or campaign — with a defined timeline.',
  },
  {
    question: 'What does a typical B2B marketing agency engagement look like?',
    answer:
      "A typical TSC engagement starts with a strategic immersion where we learn your business, market, and competitive landscape — then we build and execute against a shared growth thesis with measurable KPIs. We don't start with tactics; we start with strategy. Execution follows the strategy, and every activity is tied to outcomes you can measure.",
  },
  {
    question: 'How does AI reduce the cost of agency services?',
    answer:
      'AI reduces agency costs by automating production-level work — content generation, creative iteration, data analysis, and campaign optimization — so senior strategists spend time on strategy instead of execution tasks. The result is senior-level thinking at a price point that traditionally required junior staff, without sacrificing quality or strategic depth.',
  },
  {
    question: 'How do you measure ROI on a B2B marketing agency engagement?',
    answer:
      'We measure agency ROI through pipeline contribution, marketing-sourced revenue, customer acquisition cost efficiency, and brand metrics that correlate with long-term growth. Every engagement includes a measurement framework agreed upon upfront — because if we can\'t show the impact, we don\'t deserve the engagement.',
  },
];
