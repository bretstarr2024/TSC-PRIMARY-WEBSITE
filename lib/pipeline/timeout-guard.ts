/**
 * Timeout guards for pipeline operations.
 * Prevents hung operations from blocking the pipeline.
 * Adapted from AEO donor — removed video-specific timeouts.
 */

// ============================================
// Types
// ============================================

export interface TimeoutConfig {
  timeoutMs: number;
  operationName: string;
  cleanup?: () => Promise<void>;
}

// ============================================
// Default Timeouts
// ============================================

export const DEFAULT_TIMEOUTS = {
  openai_script: 60000, // 60 seconds
  openai_content: 90000, // 90 seconds (content generation — longer output)
  mongodb_query: 30000, // 30 seconds
} as const;

// ============================================
// Timeout Error
// ============================================

export class TimeoutError extends Error {
  public readonly timeoutMs: number;
  public readonly operationName: string;

  constructor(operationName: string, timeoutMs: number) {
    super(`Operation '${operationName}' timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
    this.operationName = operationName;
  }
}

// ============================================
// Timeout Guard
// ============================================

export async function withTimeout<T>(
  operation: () => Promise<T>,
  config: TimeoutConfig
): Promise<T> {
  const { timeoutMs, operationName, cleanup } = config;

  let timeoutId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(async () => {
      if (cleanup) {
        try {
          await cleanup();
          console.log(`[Timeout] ${operationName}: Cleanup completed`);
        } catch (cleanupError) {
          console.error(`[Timeout] ${operationName}: Cleanup failed:`, cleanupError);
        }
      }
      reject(new TimeoutError(operationName, timeoutMs));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([operation(), timeoutPromise]);
    return result;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function createTimeoutWrapper<TArgs extends unknown[], TResult>(
  operationName: string,
  timeoutMs: number
): (operation: (...args: TArgs) => Promise<TResult>) => (...args: TArgs) => Promise<TResult> {
  return (operation) => {
    return async (...args) => {
      return withTimeout(() => operation(...args), { operationName, timeoutMs });
    };
  };
}

// ============================================
// Pre-configured Timeout Wrappers
// ============================================

export async function withOpenAITimeout<T>(operation: () => Promise<T>): Promise<T> {
  return withTimeout(operation, {
    operationName: 'OpenAI script generation',
    timeoutMs: DEFAULT_TIMEOUTS.openai_script,
  });
}

export async function withContentGenerationTimeout<T>(operation: () => Promise<T>): Promise<T> {
  return withTimeout(operation, {
    operationName: 'Content generation',
    timeoutMs: DEFAULT_TIMEOUTS.openai_content,
  });
}

export async function withMongoTimeout<T>(operation: () => Promise<T>): Promise<T> {
  return withTimeout(operation, {
    operationName: 'MongoDB query',
    timeoutMs: DEFAULT_TIMEOUTS.mongodb_query,
  });
}

// ============================================
// Retry with Timeout
// ============================================

export interface RetryConfig {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  backoffMs: 1000,
  backoffMultiplier: 2,
  maxBackoffMs: 30000,
};

export async function withTimeoutAndRetry<T>(
  operation: () => Promise<T>,
  timeoutConfig: TimeoutConfig,
  retryConfig: Partial<RetryConfig> = {}
): Promise<T> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  let lastError: Error | undefined;
  let backoff = config.backoffMs;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await withTimeout(operation, timeoutConfig);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < config.maxAttempts) {
        console.log(
          `[Timeout] ${timeoutConfig.operationName}: Attempt ${attempt} failed, retrying in ${backoff}ms...`
        );
        await sleep(backoff);
        backoff = Math.min(backoff * config.backoffMultiplier, config.maxBackoffMs);
      }
    }
  }

  throw lastError;
}

// ============================================
// Utilities
// ============================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}
