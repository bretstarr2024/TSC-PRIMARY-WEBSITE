/**
 * Resolves [INTERNAL_LINK: topic] placeholders in generated content.
 *
 * Strategy:
 * 1. Find all [INTERNAL_LINK: topic] patterns
 * 2. For each, fuzzy-match against published content titles across all collections
 * 3. If a good match (Jaccard >= 0.15) is found → replace with a real markdown link
 * 4. If no match → strip the placeholder entirely (no broken link on live site)
 *
 * URLs are ONLY sourced from the database — never guessed or hardcoded.
 * This guarantees every link points to a page that actually exists.
 */

import { getDatabase } from '@/lib/mongodb';

const CONTENT_SOURCES = [
  { collection: 'blog_posts',      idField: 'slug',         titleField: 'title',    pathPrefix: '/insights/blog/' },
  { collection: 'faq_items',       idField: 'faqId',        titleField: 'question', pathPrefix: '/insights/faq/' },
  { collection: 'expert_qa',       idField: 'qaId',         titleField: 'question', pathPrefix: '/insights/expert-qa/' },
  { collection: 'glossary_terms',  idField: 'termId',       titleField: 'term',     pathPrefix: '/insights/glossary/' },
  { collection: 'comparisons',     idField: 'comparisonId', titleField: 'title',    pathPrefix: '/insights/comparisons/' },
  { collection: 'industry_briefs', idField: 'briefId',      titleField: 'title',    pathPrefix: '/insights/industry-briefs/' },
];

function tokenize(text: string): Set<string> {
  const stopWords = new Set(['a','an','the','is','are','and','or','for','to','of','in','on','with','how','what','why','when','do','does','b2b','your','our']);
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/)
      .filter(t => t.length > 2 && !stopWords.has(t))
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  a.forEach(t => { if (b.has(t)) intersection++; });
  return intersection / (a.size + b.size - intersection);
}

interface ContentCandidate {
  title: string;
  url: string;
  score: number;
}

async function findBestMatch(topic: string): Promise<ContentCandidate | null> {
  const db = await getDatabase();
  const topicTokens = tokenize(topic);
  let best: ContentCandidate | null = null;

  for (const source of CONTENT_SOURCES) {
    const docs = await db.collection(source.collection)
      .find({ status: 'published' }, { projection: { [source.idField]: 1, [source.titleField]: 1 } })
      .toArray();

    for (const doc of docs) {
      const title = String(doc[source.titleField] || '');
      const id = String(doc[source.idField] || '');
      if (!title || !id) continue;

      const titleTokens = tokenize(title);
      const score = jaccardSimilarity(topicTokens, titleTokens);

      if (score > (best?.score ?? 0)) {
        best = { title, url: `${source.pathPrefix}${id}`, score };
      }
    }
  }

  // Require meaningful overlap — threshold of 0.15 to avoid totally random matches
  return best && best.score >= 0.15 ? best : null;
}

/**
 * Resolve all [INTERNAL_LINK: topic] placeholders in a markdown string.
 * Only replaces with URLs verified to exist in the database.
 * Strips the placeholder entirely if no match found — never guesses a URL.
 */
export async function resolveInternalLinks(content: string): Promise<string> {
  const pattern = /\[INTERNAL_LINK:\s*([^\]]+)\]/g;
  const matches = [...content.matchAll(pattern)];

  if (matches.length === 0) return content;

  let resolved = content;

  for (const match of matches) {
    const [full, topic] = match;
    const trimmedTopic = topic.trim();

    // Only use DB-verified URLs — never guess
    const dbMatch = await findBestMatch(trimmedTopic);
    if (dbMatch) {
      const linkText = trimmedTopic.charAt(0).toUpperCase() + trimmedTopic.slice(1);
      resolved = resolved.replace(full, `[${linkText}](${dbMatch.url})`);
      continue;
    }

    // Strip entirely — no broken links, no guessed URLs on live site
    resolved = resolved.replace(full, '');
  }

  // Clean up any double spaces left by stripped placeholders
  resolved = resolved.replace(/  +/g, ' ').replace(/ \./g, '.').trim();

  return resolved;
}
