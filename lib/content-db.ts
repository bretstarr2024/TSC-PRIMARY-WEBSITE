/**
 * MongoDB helpers for autonomous content generation.
 * Manages: content_queue (pipeline) + blog_posts (article storage)
 * Multi-tenant: all documents include clientId, all queries filter by it.
 * Adapted from AEO donor codebase (lib/content-db.ts).
 */

import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { getClientId } from './kernel/client';

// ===========================================
// Types: Content Queue
// ===========================================

export type ContentType =
  | 'blog_post'
  | 'faq_item'
  | 'glossary_term'
  | 'comparison'
  | 'expert_qa'
  | 'news_item'
  | 'case_study'
  | 'industry_brief'
  | 'video'
  | 'tool';

export type ContentQueueStatus =
  | 'pending'
  | 'approved'
  | 'generating'
  | 'review'
  | 'published'
  | 'rejected'
  | 'failed';

export interface StatusHistoryEntry {
  status: ContentQueueStatus;
  timestamp: Date;
  reason?: string;
}

export interface TokenCost {
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
}

export interface ContentQueueItem {
  _id?: ObjectId;
  clientId: string;

  // What triggered this
  sourceUrl: string;
  sourceName: string;
  sourceType: string;

  // What to generate
  contentType: ContentType;
  priority: number; // 1=highest, 5=lowest
  title?: string;
  targetQueries?: string[];

  // JTBD linkage
  seedId?: number;
  clusterName?: string;

  // State machine
  status: ContentQueueStatus;
  statusHistory: StatusHistoryEntry[];

  // Generated output
  generatedContentId?: string;

  // Quality guardrails
  qualityScore?: number;
  qualityIssues?: string[];
  duplicateOf?: string;

  // Cost tracking
  tokenCost?: TokenCost;

  // Timestamps
  createdAt: Date;
  processedAt?: Date;
  publishedAt?: Date;

  // Error handling
  retryCount: number;
  lastError?: string;
}

// ===========================================
// Types: Blog Posts
// ===========================================

export type BlogPostStatus = 'draft' | 'published' | 'archived';
export type BlogPostOrigin = 'manual' | 'autonomous';

export interface SourceClaimReference {
  claim: string;
  sourceUrl: string;
  sourceName: string;
}

export interface BlogPost {
  _id?: ObjectId;
  clientId: string;
  slug: string;
  title: string;
  description: string;
  content: string; // Markdown body
  date: string; // ISO date string for display
  author: string;
  tags: string[];

  // Autonomous generation metadata
  origin: BlogPostOrigin;
  contentQueueId?: string;
  sourceClaims?: SourceClaimReference[];

  // JTBD linkage
  seedId?: number;
  clusterName?: string;

  // Publication state
  status: BlogPostStatus;
  publishedAt?: Date;

  // Quality
  qualityScore?: number;
  brandVoiceScore?: number;

  // SEO
  canonicalUrl?: string;

  // Video
  videoQueued?: boolean;
  videoId?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// Collection Helpers
// ===========================================

export async function getContentQueueCollection(): Promise<Collection<ContentQueueItem>> {
  const db = await getDatabase();
  return db.collection<ContentQueueItem>('content_queue');
}

export async function getBlogPostsCollection(): Promise<Collection<BlogPost>> {
  const db = await getDatabase();
  return db.collection<BlogPost>('blog_posts');
}

// ===========================================
// Content Queue Operations
// ===========================================

export async function enqueueContent(
  item: Omit<ContentQueueItem, '_id' | 'clientId' | 'statusHistory' | 'createdAt' | 'retryCount'>
): Promise<string> {
  const collection = await getContentQueueCollection();
  const clientId = getClientId();

  const doc: Omit<ContentQueueItem, '_id'> = {
    ...item,
    clientId,
    statusHistory: [{ status: item.status, timestamp: new Date() }],
    createdAt: new Date(),
    retryCount: 0,
  };

  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

export async function getNextPendingItems(
  limit: number = 5,
  contentType?: ContentType
): Promise<ContentQueueItem[]> {
  const collection = await getContentQueueCollection();
  const clientId = getClientId();

  const filter: Record<string, unknown> = { clientId, status: 'pending' };
  if (contentType) filter.contentType = contentType;

  return collection
    .find(filter)
    .sort({ priority: 1, createdAt: 1 })
    .limit(limit)
    .toArray();
}

/**
 * Atomically claim a pending queue item by setting status to 'generating'.
 * Uses findOneAndUpdate to prevent two concurrent runs from claiming the same item.
 * Returns null if no pending items of this type remain.
 */
export async function claimNextPendingItem(
  contentType: ContentType
): Promise<ContentQueueItem | null> {
  const collection = await getContentQueueCollection();
  const clientId = getClientId();

  const result = await collection.findOneAndUpdate(
    { clientId, status: 'pending', contentType },
    {
      $set: { status: 'generating' as ContentQueueStatus, processedAt: new Date() },
      $push: {
        statusHistory: {
          status: 'generating' as ContentQueueStatus,
          timestamp: new Date(),
          reason: 'Claimed by pipeline',
        },
      },
    },
    { sort: { priority: 1, createdAt: 1 }, returnDocument: 'after' }
  );

  return result ?? null;
}

/**
 * Get titles of recently published queue items for dedup checking.
 * Looks at items published in the last 90 days for the given content type.
 */
export async function getRecentPublishedTitles(
  contentType: ContentType,
  days: number = 90
): Promise<string[]> {
  const collection = await getContentQueueCollection();
  const clientId = getClientId();

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const items = await collection
    .find(
      { clientId, contentType, status: 'published', publishedAt: { $gte: cutoff } },
      { projection: { title: 1 } }
    )
    .toArray();

  return items.map((i) => i.title).filter((t): t is string => !!t);
}

export async function updateQueueItemStatus(
  itemId: string,
  newStatus: ContentQueueStatus,
  reason?: string
): Promise<void> {
  const collection = await getContentQueueCollection();

  const historyEntry: StatusHistoryEntry = {
    status: newStatus,
    timestamp: new Date(),
    reason,
  };

  const update: Record<string, unknown> = {
    $set: { status: newStatus },
    $push: { statusHistory: historyEntry },
  };

  if (newStatus === 'published') {
    update.$set = { ...(update.$set as Record<string, unknown>), publishedAt: new Date() };
  }
  if (newStatus === 'generating' || newStatus === 'approved') {
    update.$set = { ...(update.$set as Record<string, unknown>), processedAt: new Date() };
  }

  await collection.updateOne({ _id: new ObjectId(itemId) }, update);
}

export async function markQueueItemFailed(itemId: string, error: string): Promise<void> {
  const collection = await getContentQueueCollection();

  await collection.updateOne(
    { _id: new ObjectId(itemId) },
    {
      $set: { status: 'failed', lastError: error },
      $inc: { retryCount: 1 },
      $push: {
        statusHistory: { status: 'failed', timestamp: new Date(), reason: error },
      },
    }
  );
}

export async function getBlogPostsPublishedToday(): Promise<number> {
  return getContentPublishedToday('blog_post');
}

/**
 * Get the number of items of a given content type published today.
 * Generalizes getBlogPostsPublishedToday for all content types.
 */
export async function getContentPublishedToday(contentType: ContentType): Promise<number> {
  const collection = await getContentQueueCollection();
  const clientId = getClientId();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return collection.countDocuments({
    clientId,
    contentType,
    status: 'published',
    publishedAt: { $gte: startOfDay },
  });
}

/**
 * Reset queue items stuck in 'generating' status back to 'pending'.
 * Catches orphaned items from crashed pipeline runs.
 * Items that exceed MAX_RETRIES are marked as 'failed' instead of retried.
 */
const MAX_RETRIES = 3;

export async function resetStuckGeneratingItems(olderThanMs: number = 600000): Promise<number> {
  const collection = await getContentQueueCollection();
  const clientId = getClientId();

  const cutoff = new Date(Date.now() - olderThanMs);

  // Items below retry ceiling → reset to pending
  const retryable = await collection.updateMany(
    {
      clientId,
      status: 'generating',
      processedAt: { $lt: cutoff },
      retryCount: { $lt: MAX_RETRIES },
    },
    {
      $set: { status: 'pending' },
      $inc: { retryCount: 1 },
      $push: {
        statusHistory: {
          status: 'pending',
          timestamp: new Date(),
          reason: `Reset from stuck generating (older than ${olderThanMs}ms)`,
        },
      },
    }
  );

  // Items at or above retry ceiling → mark as permanently failed
  const exhausted = await collection.updateMany(
    {
      clientId,
      status: 'generating',
      processedAt: { $lt: cutoff },
      retryCount: { $gte: MAX_RETRIES },
    },
    {
      $set: { status: 'failed', lastError: `Exceeded ${MAX_RETRIES} retry attempts` },
      $push: {
        statusHistory: {
          status: 'failed',
          timestamp: new Date(),
          reason: `Exceeded ${MAX_RETRIES} retry attempts — stuck in generating`,
        },
      },
    }
  );

  const total = retryable.modifiedCount + exhausted.modifiedCount;
  if (total > 0) {
    console.log(`[Content DB] Reset ${retryable.modifiedCount} stuck items to pending, ${exhausted.modifiedCount} permanently failed (retry ceiling)`);
  }

  return total;
}

// ===========================================
// Blog Post Operations
// ===========================================

export async function createBlogPost(
  post: Omit<BlogPost, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const collection = await getBlogPostsCollection();
  const clientId = getClientId();

  const doc: Omit<BlogPost, '_id'> = {
    ...post,
    clientId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(doc);
  return result.insertedId.toString();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const collection = await getBlogPostsCollection();
  const clientId = getClientId();
  return collection.findOne({ clientId, slug });
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const collection = await getBlogPostsCollection();
  const clientId = getClientId();
  return collection.findOne({ clientId, slug, status: 'published' });
}

export async function getAllPublishedBlogPosts(limit: number = 500): Promise<BlogPost[]> {
  const collection = await getBlogPostsCollection();
  const clientId = getClientId();
  return collection.find({ clientId, status: 'published' }).sort({ date: -1 }).limit(limit).toArray();
}

export async function getAllBlogPostSlugs(): Promise<string[]> {
  const collection = await getBlogPostsCollection();
  const clientId = getClientId();
  const posts = await collection
    .find({ clientId, status: 'published' })
    .project({ slug: 1 })
    .toArray();
  return posts.map((p) => p.slug);
}

export async function updateBlogPostStatus(slug: string, status: BlogPostStatus): Promise<void> {
  const collection = await getBlogPostsCollection();
  const clientId = getClientId();

  const update: Record<string, unknown> = { status, updatedAt: new Date() };
  if (status === 'published') update.publishedAt = new Date();

  await collection.updateOne({ clientId, slug }, { $set: update });
}

export async function blogPostSlugExists(slug: string): Promise<boolean> {
  const collection = await getBlogPostsCollection();
  const clientId = getClientId();
  const count = await collection.countDocuments({ clientId, slug });
  return count > 0;
}

export async function findSimilarBlogPosts(title: string, limit: number = 5): Promise<BlogPost[]> {
  const collection = await getBlogPostsCollection();
  const clientId = getClientId();

  const keywords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 4)
    .slice(0, 5);

  if (keywords.length === 0) return [];
  const pattern = keywords.join('|');

  return collection
    .find({ clientId, status: 'published', title: { $regex: pattern, $options: 'i' } })
    .limit(limit)
    .toArray();
}

export async function upsertBlogPost(post: Omit<BlogPost, '_id'>): Promise<void> {
  const collection = await getBlogPostsCollection();

  await collection.updateOne(
    { clientId: post.clientId, slug: post.slug },
    { $set: { ...post, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
}

// ===========================================
// Index Setup
// ===========================================

export async function ensureContentIndexes(): Promise<void> {
  const db = await getDatabase();
  const queue = await getContentQueueCollection();
  const posts = await getBlogPostsCollection();

  // Content queue indexes
  await queue.createIndex({ clientId: 1, status: 1, priority: 1, createdAt: 1 });
  await queue.createIndex({ clientId: 1, contentType: 1, status: 1 });
  await queue.createIndex({ clientId: 1, publishedAt: -1 });

  // Blog posts indexes
  await posts.createIndex({ clientId: 1, slug: 1 }, { unique: true });
  await posts.createIndex({ clientId: 1, status: 1, date: -1 });
  await posts.createIndex({ clientId: 1, origin: 1, status: 1 });
  await posts.createIndex({ clientId: 1, tags: 1 });

  // TTL indexes on operational collections
  const interactions = db.collection('interactions');
  await interactions.createIndex(
    { timestamp: 1 },
    { expireAfterSeconds: 180 * 24 * 60 * 60, name: 'ttl_180d' }
  );

  const pipelineLogs = db.collection('pipeline_logs');
  await pipelineLogs.createIndex(
    { timestamp: 1 },
    { expireAfterSeconds: 90 * 24 * 60 * 60, name: 'ttl_90d' }
  );

  // Leads index (deferred since Session XLII)
  const leads = db.collection('leads');
  await leads.createIndex({ timestamp: -1 });

  console.log('[Content DB] Indexes created successfully');
}
