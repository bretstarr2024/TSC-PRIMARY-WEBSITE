/**
 * FAQPage JSON-LD schema generator for answer capsule sections.
 * Used on service, industry, and pricing pages.
 */

import type { AnswerCapsule } from '@/lib/services-data';

export function getServiceFaqSchema(capsules: AnswerCapsule[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: capsules.map((capsule) => ({
      '@type': 'Question',
      name: capsule.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: capsule.answer,
      },
    })),
  };
}

/** Alias for non-service pages */
export const getFaqSchema = getServiceFaqSchema;
