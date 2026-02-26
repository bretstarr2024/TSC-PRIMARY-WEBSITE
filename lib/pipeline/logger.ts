/**
 * Structured logging for the content pipeline.
 * Tracks costs, durations, and errors for observability.
 * Adapted from AEO donor — videoId → contentId, OpenAI only.
 */

import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from '../mongodb';
import type { ErrorCategory, ErrorService, ClassifiedError } from './error-classifier';

// ============================================
// Types
// ============================================

export interface PipelineLogEntry {
  _id?: ObjectId;
  timestamp: Date;
  contentId: string | null;
  phase: string;
  action: string;
  success: boolean;
  durationMs: number;
  cost?: {
    service: 'openai';
    amount: number;
    unit: string;
  };
  error?: string;
  metadata?: Record<string, unknown>;
  // Error classification fields
  errorCategory?: ErrorCategory;
  errorService?: ErrorService;
  errorRetryable?: boolean;
  rawResponse?: string;
  contentSlug?: string;
  pipelineRunId?: string;
}

export type LogLevel = 'info' | 'warn' | 'error';

// ============================================
// Collection Access
// ============================================

async function getLogCollection(): Promise<Collection<PipelineLogEntry>> {
  const db = await getDatabase();
  return db.collection<PipelineLogEntry>('pipeline_logs');
}

// ============================================
// Logging Functions
// ============================================

/**
 * Log a pipeline event
 */
export async function logPipelineEvent(entry: Omit<PipelineLogEntry, '_id' | 'timestamp'>): Promise<void> {
  try {
    const collection = await getLogCollection();
    const fullEntry: PipelineLogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    await collection.insertOne(fullEntry);

    // Also log to console for immediate visibility
    const level: LogLevel = entry.success ? 'info' : 'error';
    const costStr = entry.cost
      ? ` [${entry.cost.service}: ${entry.cost.amount} ${entry.cost.unit}]`
      : '';
    const errorStr = entry.error ? ` - ${entry.error}` : '';

    const message = `[Pipeline] ${entry.phase}/${entry.action} (${entry.durationMs}ms)${costStr}${errorStr}`;

    if (level === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  } catch (error) {
    // Don't let logging failures break the pipeline
    console.error('[Logger] Failed to log event:', error);
  }
}

/**
 * Create a timed operation wrapper that logs automatically
 */
export function createTimedOperation<T>(
  phase: string,
  action: string,
  contentId: string | null = null
): {
  start: () => void;
  success: (cost?: PipelineLogEntry['cost'], metadata?: Record<string, unknown>) => Promise<T>;
  failure: (error: string, metadata?: Record<string, unknown>) => Promise<never>;
  wrap: (operation: () => Promise<T>) => Promise<T>;
} {
  let startTime: number;

  return {
    start() {
      startTime = Date.now();
    },

    async success(cost?: PipelineLogEntry['cost'], metadata?: Record<string, unknown>) {
      const durationMs = Date.now() - startTime;
      await logPipelineEvent({
        contentId,
        phase,
        action,
        success: true,
        durationMs,
        cost,
        metadata,
      });
      return undefined as T;
    },

    async failure(error: string, metadata?: Record<string, unknown>) {
      const durationMs = Date.now() - startTime;
      await logPipelineEvent({
        contentId,
        phase,
        action,
        success: false,
        durationMs,
        error,
        metadata,
      });
      throw new Error(error);
    },

    async wrap(operation: () => Promise<T>) {
      startTime = Date.now();
      try {
        const result = await operation();
        const durationMs = Date.now() - startTime;
        await logPipelineEvent({
          contentId,
          phase,
          action,
          success: true,
          durationMs,
        });
        return result;
      } catch (error) {
        const durationMs = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await logPipelineEvent({
          contentId,
          phase,
          action,
          success: false,
          durationMs,
          error: errorMessage,
        });
        throw error;
      }
    },
  };
}

/**
 * Log a classified error with full context
 */
export async function logClassifiedError(
  contentId: string | null,
  classified: ClassifiedError,
  durationMs: number,
  extras?: { contentSlug?: string; pipelineRunId?: string; rawResponse?: string }
): Promise<void> {
  await logPipelineEvent({
    contentId,
    phase: classified.phase,
    action: 'error',
    success: false,
    durationMs,
    error: classified.message,
    errorCategory: classified.category,
    errorService: classified.service,
    errorRetryable: classified.retryable,
    rawResponse: extras?.rawResponse?.substring(0, 2000),
    contentSlug: extras?.contentSlug,
    pipelineRunId: extras?.pipelineRunId,
    metadata: { category: classified.category, retryable: classified.retryable },
  });
}

// ============================================
// Log Queries
// ============================================

export interface LogQueryOptions {
  contentId?: string;
  phase?: string;
  success?: boolean;
  since?: Date;
  limit?: number;
}

/**
 * Query pipeline logs
 */
export async function queryLogs(options: LogQueryOptions = {}): Promise<PipelineLogEntry[]> {
  const collection = await getLogCollection();

  const filter: Record<string, unknown> = {};

  if (options.contentId) filter.contentId = options.contentId;
  if (options.phase) filter.phase = options.phase;
  if (options.success !== undefined) filter.success = options.success;
  if (options.since) filter.timestamp = { $gte: options.since };

  return collection
    .find(filter)
    .sort({ timestamp: -1 })
    .limit(options.limit || 100)
    .toArray();
}

/**
 * Get recent errors
 */
export async function getRecentErrors(limit: number = 20): Promise<PipelineLogEntry[]> {
  return queryLogs({ success: false, limit });
}

/**
 * Get logs for a specific content item
 */
export async function getContentLogs(contentId: string): Promise<PipelineLogEntry[]> {
  return queryLogs({ contentId, limit: 50 });
}

// ============================================
// Log Aggregation
// ============================================

export interface LogStats {
  totalEvents: number;
  successCount: number;
  errorCount: number;
  successRate: number;
  totalCost: {
    openai: number;
  };
  avgDurationMs: {
    content_generation: number;
    content_validation: number;
    total: number;
  };
}

/**
 * Get aggregated log statistics
 */
export async function getLogStats(since?: Date): Promise<LogStats> {
  const collection = await getLogCollection();

  const filter: Record<string, unknown> = {};
  if (since) filter.timestamp = { $gte: since };

  const pipeline = [
    { $match: filter },
    {
      $group: {
        _id: null,
        totalEvents: { $sum: 1 },
        successCount: {
          $sum: { $cond: ['$success', 1, 0] },
        },
        errorCount: {
          $sum: { $cond: ['$success', 0, 1] },
        },
        openaiCost: {
          $sum: {
            $cond: [{ $eq: ['$cost.service', 'openai'] }, '$cost.amount', 0],
          },
        },
        avgDuration: { $avg: '$durationMs' },
      },
    },
  ];

  const [result] = await collection.aggregate(pipeline).toArray();

  // Per-phase duration averages
  const phasePipeline = [
    { $match: { ...filter, success: true, phase: { $in: ['content_generation', 'content_validation'] } } },
    { $group: { _id: '$phase', avgDuration: { $avg: '$durationMs' } } },
  ];
  const phaseResults = await collection.aggregate(phasePipeline).toArray();
  const phaseAvgs: Record<string, number> = {};
  for (const p of phaseResults) {
    phaseAvgs[p._id as string] = Math.round(p.avgDuration as number);
  }

  if (!result) {
    return {
      totalEvents: 0,
      successCount: 0,
      errorCount: 0,
      successRate: 0,
      totalCost: { openai: 0 },
      avgDurationMs: {
        content_generation: 0,
        content_validation: 0,
        total: 0,
      },
    };
  }

  return {
    totalEvents: result.totalEvents,
    successCount: result.successCount,
    errorCount: result.errorCount,
    successRate:
      result.totalEvents > 0 ? (result.successCount / result.totalEvents) * 100 : 0,
    totalCost: {
      openai: result.openaiCost || 0,
    },
    avgDurationMs: {
      content_generation: phaseAvgs['content_generation'] || 0,
      content_validation: phaseAvgs['content_validation'] || 0,
      total: result.avgDuration || 0,
    },
  };
}

// ============================================
// Log Cleanup
// ============================================

/**
 * Clean old log entries
 */
export async function cleanOldLogs(olderThanDays: number = 30): Promise<number> {
  const collection = await getLogCollection();
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);

  const result = await collection.deleteMany({
    timestamp: { $lt: cutoff },
  });

  console.log(`[Logger] Cleaned ${result.deletedCount} log entries older than ${olderThanDays} days`);
  return result.deletedCount;
}
