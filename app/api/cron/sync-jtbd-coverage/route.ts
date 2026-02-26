/**
 * JTBD Coverage Sync Cron Job
 *
 * Runs monthly (1st of each month at 3am UTC).
 * Loads the kernel, extracts target queries from each JTBD cluster
 * (pain points, obstacles, hiring criteria), and upserts them
 * into the query_coverage collection.
 *
 * Pipeline flow:
 *   kernel.yaml → sync-jtbd-coverage (monthly) → query_coverage
 *   query_coverage → seed-content-queue (daily) → content_queue
 *   content_queue → generate-content (daily) → published content
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClientConfig } from '@/lib/kernel/client';
import { upsertQueryCoverage } from '@/lib/resources-db';
import { logPipelineEvent } from '@/lib/pipeline/logger';
import { verifyCronAuth } from '@/lib/cron-auth';

export const maxDuration = 60; // 1 minute

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
  let totalUpserted = 0;
  const perCluster: Record<string, number> = {};

  for (let seedId = 0; seedId < kernel.jtbd.length; seedId++) {
    const cluster = kernel.jtbd[seedId];
    const clusterName = cluster.jobName;
    let clusterCount = 0;

    // Extract target queries from cluster data
    const queries = extractQueriesFromCluster(cluster);

    for (const query of queries) {
      try {
        await upsertQueryCoverage(seedId, clusterName, query);
        clusterCount++;
        totalUpserted++;
      } catch (error) {
        console.error(`[Sync JTBD] Failed to upsert: ${query}`, error);
      }
    }

    perCluster[clusterName] = clusterCount;
  }

  // Also extract from ICP pain points (not tied to a specific cluster)
  const icpQueries = kernel.icp.primary.painPoints.map(
    (pp) => `How can B2B companies address: ${pp}`
  );
  let icpCount = 0;
  for (const query of icpQueries) {
    try {
      await upsertQueryCoverage(0, 'ICP Pain Points', query);
      icpCount++;
      totalUpserted++;
    } catch (error) {
      console.error(`[Sync JTBD] Failed to upsert ICP query: ${query}`, error);
    }
  }
  perCluster['ICP Pain Points'] = icpCount;

  const durationMs = Date.now() - startTime;

  await logPipelineEvent({
    contentId: null,
    phase: 'coverage_sync',
    action: 'sync_complete',
    success: true,
    durationMs,
    metadata: { totalUpserted, perCluster, jtbdClusters: kernel.jtbd.length },
  });

  return NextResponse.json({
    status: 'complete',
    durationMs,
    totalUpserted,
    perCluster,
    jtbdClusters: kernel.jtbd.length,
    icpPainPoints: icpQueries.length,
  });
}

// ============================================
// Query Extraction
// ============================================

interface JtbdCluster {
  jobName: string;
  startingState: string;
  desiredState: string;
  obstacles: string[];
  hiringCriteria: string[];
}

function extractQueriesFromCluster(cluster: JtbdCluster): string[] {
  const queries: string[] = [];

  // From obstacles → "How to overcome [obstacle]"
  for (const obstacle of cluster.obstacles) {
    queries.push(`How to overcome ${obstacle.toLowerCase()}`);
  }

  // From hiring criteria → "What to look for in [criterion]"
  for (const criterion of cluster.hiringCriteria) {
    queries.push(`What to look for when evaluating ${criterion.toLowerCase()}`);
  }

  // Job-level questions
  queries.push(`How to ${cluster.jobName.toLowerCase()}`);
  queries.push(`${cluster.jobName}: best practices for B2B companies`);
  queries.push(`Why B2B companies struggle with ${cluster.jobName.toLowerCase()}`);

  // From starting → desired state
  queries.push(`Moving from ${cluster.startingState.toLowerCase()} to ${cluster.desiredState.toLowerCase()}`);

  return queries;
}
