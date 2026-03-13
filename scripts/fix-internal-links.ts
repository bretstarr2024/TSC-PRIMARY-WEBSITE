/**
 * One-time fix: resolve [INTERNAL_LINK:] placeholders in the live growth engine post.
 * Run with: npx dotenv -e .env.local -- tsx scripts/fix-internal-links.ts
 */

import { getDatabase } from '../lib/mongodb';
import { resolveInternalLinks } from '../lib/pipeline/internal-link-resolver';

async function main() {
  const db = await getDatabase();
  const collection = db.collection('blog_posts');

  const slug = 'what-is-a-b2b-growth-engine';
  const post = await collection.findOne({ slug });

  if (!post) {
    console.error(`[fix-links] Post not found: ${slug}`);
    process.exit(1);
  }

  const originalContent = post.content as string;
  const placeholderCount = (originalContent.match(/\[INTERNAL_LINK:/g) || []).length;

  console.log(`[fix-links] Found post: "${post.title}"`);
  console.log(`[fix-links] Placeholders to resolve: ${placeholderCount}`);

  if (placeholderCount === 0) {
    console.log('[fix-links] No placeholders found — nothing to do.');
    process.exit(0);
  }

  const resolvedContent = await resolveInternalLinks(originalContent);

  const remainingPlaceholders = (resolvedContent.match(/\[INTERNAL_LINK:/g) || []).length;
  const resolved = placeholderCount - remainingPlaceholders;

  console.log(`[fix-links] Resolved: ${resolved} | Stripped (no match): ${remainingPlaceholders}`);

  await collection.updateOne({ slug }, { $set: { content: resolvedContent } });

  console.log('[fix-links] Done — post updated in MongoDB.');
}

main().catch((err) => {
  console.error('[fix-links] Fatal error:', err);
  process.exit(1);
});
