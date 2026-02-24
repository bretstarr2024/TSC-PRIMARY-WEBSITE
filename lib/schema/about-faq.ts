/**
 * FAQ data and schema for the About page.
 * Shared between server (schema) and client (accordion component).
 */

export const aboutFaqs = [
  {
    question: 'What does The Starr Conspiracy do?',
    answer:
      'The Starr Conspiracy is a strategic B2B marketing agency that helps technology companies grow through brand strategy, demand generation, digital performance, content marketing, and AI transformation. We combine 25+ years of marketing fundamentals with AI-native capabilities — strategy and execution under one roof.',
  },
  {
    question: 'What industries does TSC serve?',
    answer:
      'We work exclusively with B2B technology companies. Our deepest expertise spans HR Tech, SaaS, FinTech, Cybersecurity, HealthTech, MarTech, DevTools, Cloud Infrastructure, and AI/ML platforms. If you sell software or services to businesses, we probably already understand your market.',
  },
  {
    question: 'How is TSC different from other B2B marketing agencies?',
    answer:
      "Three things. First, we've been doing this for 25+ years — we don't need a ramp-up period on your industry. Second, the same senior team that builds your strategy also executes it — no handoff to junior staff. Third, we're years ahead on AI transformation, with proprietary tools and methodologies built into how we work, not bolted on as an afterthought.",
  },
  {
    question: "What is TSC's approach to AI in marketing?",
    answer:
      "AI amplifies what works and accelerates what doesn't. We don't use AI as a gimmick — we build it into strategy, content production, analytics, and campaign optimization. Our proprietary GTM Kernel powers autonomous content generation grounded in your actual go-to-market strategy. We also help clients develop their own AI transformation roadmaps.",
  },
  {
    question: 'Who founded The Starr Conspiracy?',
    answer:
      "Bret Starr founded TSC in 1999 after years on the brand side watching agencies stumble through learning curves on his dime. His principle was simple: you shouldn't have to teach your agency what your company does for a living. That founding instinct — deep B2B expertise from day one — still drives everything we do.",
  },
  {
    question: 'What size companies does TSC work with?',
    answer:
      'We typically work with B2B tech companies between $5M and $500M in annual recurring revenue with 50 to 2,000 employees. Our clients are usually at a growth inflection point — scaling demand gen, repositioning their brand, navigating a leadership transition, or figuring out how AI fits into their marketing function.',
  },
];

/** FAQPage JSON-LD schema for AEO */
export function getAboutFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: aboutFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
