/**
 * Content Queue Seeding Cron Job
 *
 * Runs daily at 7:30am UTC (30 min before generate-content at 8am).
 * Reads uncovered JTBD queries from query_coverage and creates
 * content_queue items for generation.
 *
 * Pipeline flow:
 *   kernel.yaml → sync-jtbd-coverage (monthly) → query_coverage
 *   query_coverage → seed-content-queue (daily) → content_queue
 *   content_queue → generate-content (daily 8am) → published content
 *
 * Daily caps per type to stay within budget.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUncoveredQueries } from '@/lib/resources-db';
import { enqueueContent, type ContentType } from '@/lib/content-db';
import { getClientConfig } from '@/lib/kernel/client';
import { logPipelineEvent } from '@/lib/pipeline/logger';
import { DAILY_CAPS } from '@/lib/pipeline/content-guardrails';
import { verifyCronAuth } from '@/lib/cron-auth';

export const maxDuration = 60; // 1 minute

// Query classification patterns
const QUESTION_PATTERNS = /^(how|what|why|when|can|should|does|is|are|will|where|which|do)\b/i;
const DEFINITION_PATTERNS = /\b(definition|meaning|what is|what are|explain|overview)\b/i;
const SHORT_TERM_PATTERN = /^[a-z0-9\s\-]{3,40}$/i;
const COMPARISON_PATTERNS = /\b(vs\.?|versus|compared to|difference between|better|alternative)\b/i;

// ============================================
// Query Classification
// ============================================

function classifyQuery(query: string): ContentType | null {
  const lower = query.toLowerCase().trim();

  // Comparison pattern: "X vs Y", "difference between"
  if (COMPARISON_PATTERNS.test(lower)) return 'comparison';

  // Explicit definition/glossary
  if (DEFINITION_PATTERNS.test(lower)) return 'glossary_term';

  // Short terms without question words → glossary
  if (SHORT_TERM_PATTERN.test(lower) && !QUESTION_PATTERNS.test(lower)) return 'glossary_term';

  // Questions → FAQ or expert Q&A (rotate)
  if (QUESTION_PATTERNS.test(lower)) {
    // Longer, strategy-oriented questions → expert Q&A
    if (lower.length > 60 || /\b(strategy|should|best practice|recommend)\b/i.test(lower)) {
      return 'expert_qa';
    }
    return 'faq_item';
  }

  // Longer phrases → blog post candidate
  if (lower.split(/\s+/).length > 6) return 'blog_post';

  // Default: FAQ
  return 'faq_item';
}

// ============================================
// Main Handler
// ============================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  // Auth check
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'MONGODB_URI not configured' }, { status: 500 });
  }

  const kernel = getClientConfig();
  const enqueued: Record<string, number> = {};
  const skipped: string[] = [];
  const caps: Record<string, number> = {};

  // Initialize caps tracking
  const allTypes: ContentType[] = [
    'faq_item', 'glossary_term', 'comparison', 'expert_qa', 'blog_post',
    'news_item', 'case_study', 'industry_brief', 'video', 'tool',
  ];
  for (const t of allTypes) {
    caps[t] = 0;
    enqueued[t] = 0;
  }

  // Get uncovered queries
  const uncoveredQueries = await getUncoveredQueries(50);

  if (uncoveredQueries.length === 0) {
    return NextResponse.json({
      status: 'complete',
      message: 'No uncovered queries to process',
      durationMs: Date.now() - startTime,
    });
  }

  for (const queryCov of uncoveredQueries) {
    const contentType = classifyQuery(queryCov.query);
    if (!contentType) {
      skipped.push(queryCov.query);
      continue;
    }

    // Check daily cap for this type
    const cap = DAILY_CAPS[contentType] || 1;
    if (caps[contentType] >= cap) {
      skipped.push(`${queryCov.query} (cap reached for ${contentType})`);
      continue;
    }

    // Build context from kernel
    const context = buildContextForQuery(queryCov.query, queryCov.clusterName, kernel);

    try {
      await enqueueContent({
        sourceUrl: '',
        sourceName: 'query_coverage',
        sourceType: 'jtbd_query',
        contentType,
        priority: 3, // Default priority
        title: queryCov.query,
        targetQueries: [queryCov.query],
        seedId: queryCov.seedId,
        clusterName: queryCov.clusterName,
        status: 'pending',
      });

      caps[contentType]++;
      enqueued[contentType]++;
    } catch (error) {
      console.error(`[Seed] Failed to enqueue: ${queryCov.query}`, error);
      skipped.push(`${queryCov.query} (error)`);
    }
  }

  const durationMs = Date.now() - startTime;
  const totalEnqueued = Object.values(enqueued).reduce((a, b) => a + b, 0);

  await logPipelineEvent({
    contentId: null,
    phase: 'seeding',
    action: 'seed_complete',
    success: true,
    durationMs,
    metadata: { enqueued, skipped: skipped.length, totalEnqueued },
  });

  return NextResponse.json({
    status: 'complete',
    durationMs,
    totalEnqueued,
    enqueued,
    skipped: skipped.length,
    skippedQueries: skipped.slice(0, 10), // Show first 10
  });
}

// ============================================
// Helpers
// ============================================

function buildContextForQuery(
  query: string,
  clusterName: string | undefined,
  kernel: ReturnType<typeof getClientConfig>
): string {
  const parts: string[] = [];

  // Find matching JTBD cluster
  if (clusterName) {
    const cluster = kernel.jtbd.find((j) => j.jobName === clusterName);
    if (cluster) {
      parts.push(`JTBD: ${cluster.jobName}`);
      parts.push(`Starting state: ${cluster.startingState}`);
      parts.push(`Desired state: ${cluster.desiredState}`);
      parts.push(`Obstacles: ${cluster.obstacles.join(', ')}`);
    }
  }

  // Add ICP context
  parts.push(`ICP: ${kernel.icp.primary.label}`);
  parts.push(`Pain points: ${kernel.icp.primary.painPoints.slice(0, 3).join(', ')}`);

  // Brand promise
  parts.push(`Brand promise: ${kernel.brand.brandPromise}`);

  return parts.join('\n');
}
