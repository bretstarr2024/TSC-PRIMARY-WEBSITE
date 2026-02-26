/**
 * FAQ data and schema for the Contact page.
 * Answer capsules addressing common questions about engaging with TSC.
 */

import type { AnswerCapsule } from '@/lib/services-data';

export const contactCapsules: AnswerCapsule[] = [
  {
    question: 'What happens after I fill out the form?',
    answer:
      'A senior strategist reviews your message and responds within one business day. No sales reps, no qualification gauntlet. The person who responds is the person who would work on your business.',
  },
  {
    question: 'How fast will I hear back?',
    answer:
      'Within one business day. If you need to talk sooner, book a call directly using the calendar on this page — you can get on our schedule today.',
  },
  {
    question: 'What does a first conversation look like?',
    answer:
      'Twenty-five minutes with a senior strategist. We listen to what you are trying to accomplish, share relevant experience, and tell you honestly whether TSC is the right fit. No pitch decks, no pressure.',
  },
  {
    question: 'Do you work with companies outside B2B tech?',
    answer:
      'Our expertise is deepest in B2B technology — SaaS, HR tech, fintech, cybersecurity, and adjacent verticals. If your company sells to businesses and you need marketing that compounds, we should talk.',
  },
  {
    question: 'Is there a minimum engagement size?',
    answer:
      'Subscriptions start at $15K per month. Projects start at $30K minimum. These floors exist because we staff engagements with senior talent, not junior account managers. The investment reflects the caliber of the team and the outcomes we drive.',
  },
];
