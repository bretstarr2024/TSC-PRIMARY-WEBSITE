/**
 * TSC leadership structured data.
 * Driven from kernel config — not hardcoded.
 */

import { getClientConfig } from '../kernel/client';

export interface PersonSchema {
  '@type': 'Person';
  name: string;
  jobTitle: string;
  worksFor: {
    '@type': 'Organization';
    name: string;
  };
  sameAs: string[];
  description: string;
}

export function getLeaderSchemas(): PersonSchema[] {
  const config = getClientConfig();

  return config.leaders.map((leader) => ({
    '@type': 'Person' as const,
    name: leader.name,
    jobTitle: leader.title,
    worksFor: {
      '@type': 'Organization' as const,
      name: config.brand.name.full,
    },
    sameAs: [leader.linkedIn, leader.youTube].filter(Boolean) as string[],
    description: leader.shortBio,
  }));
}

export function getOrganizationSchema() {
  const config = getClientConfig();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.brand.name.full,
    description: config.message.elevatorPitches.thirtySecond || config.brand.brandPromise,
    knowsAbout: [
      'B2B Marketing',
      'Go-to-Market Strategy',
      'AI Transformation',
      'Demand Generation',
      'Brand Strategy',
    ],
  };
}

export function getArticleSchema(opts: {
  title: string;
  description: string;
  datePublished: string;
  author: string;
  tags: string[];
  wordCount?: number;
  url?: string;
}) {
  const config = getClientConfig();
  const leader = config.leaders.find((l) => l.name === opts.author);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    author: leader
      ? {
          '@type': 'Person',
          name: leader.name,
          jobTitle: leader.title,
          worksFor: { '@type': 'Organization', name: config.brand.name.full },
          sameAs: [leader.linkedIn, leader.youTube].filter(Boolean),
        }
      : { '@type': 'Person', name: opts.author },
    publisher: {
      '@type': 'Organization',
      name: config.brand.name.full,
    },
    keywords: opts.tags,
    ...(opts.wordCount && { wordCount: opts.wordCount }),
    ...(opts.url && { url: opts.url }),
  };
}
