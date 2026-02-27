/**
 * Structured error classification for the content pipeline.
 * Categorizes failures for queryable diagnostics and automated reporting.
 * Adapted from AEO donor — simplified for content generation (no video pipeline).
 */

import { TimeoutError, isTimeoutError } from './timeout-guard';
import { CircuitBreakerOpenError } from './circuit-breaker';

// ============================================
// Error Category Taxonomy
// ============================================

export type ErrorCategory =
  | 'CONTENT_GENERATION_TIMEOUT'
  | 'CONTENT_GENERATION_ERROR'
  | 'CONTENT_VALIDATION_ERROR'
  | 'CONTENT_PARSE_ERROR'
  | 'CIRCUIT_BREAKER_OPEN'
  | 'DB_UPDATE_FAILED'
  | 'CONTENT_SELECTION'
  | 'PREFLIGHT_FAILED'
  | 'ENV_MISSING'
  | 'RATE_LIMIT'
  | 'UNKNOWN';

export type ErrorService =
  | 'openai'
  | 'mongodb'
  | 'internal'
  | null;

export interface ClassifiedError {
  category: ErrorCategory;
  service: ErrorService;
  message: string;
  retryable: boolean;
  phase: string;
}

// ============================================
// Phase-to-Service Mapping
// ============================================

function mapPhaseToService(phase: string): ErrorService {
  switch (phase) {
    case 'content_generation':
    case 'content_validation':
      return 'openai';
    case 'state_update':
    case 'content_selection':
      return 'mongodb';
    default:
      return 'internal';
  }
}

// ============================================
// Classification Logic
// ============================================

export function classifyError(error: unknown, phase: string): ClassifiedError {
  // TimeoutError
  if (isTimeoutError(error)) {
    return {
      category: 'CONTENT_GENERATION_TIMEOUT',
      service: mapPhaseToService(phase),
      message: (error as TimeoutError).message,
      retryable: true,
      phase,
    };
  }

  // CircuitBreakerOpenError
  if (error instanceof CircuitBreakerOpenError) {
    return {
      category: 'CIRCUIT_BREAKER_OPEN',
      service: error.message.includes('openai') ? 'openai' : mapPhaseToService(phase),
      message: error.message,
      retryable: false,
      phase,
    };
  }

  const msg = error instanceof Error ? error.message : String(error);

  // JSON parse failures
  if (msg.includes('JSON parse error') || msg.includes('Failed to parse JSON') || msg.includes('SyntaxError') || msg.includes('Unexpected token')) {
    return { category: 'CONTENT_PARSE_ERROR', service: 'openai', message: msg, retryable: true, phase };
  }

  // Validation failures
  if (msg.includes('Validation failed:') || msg.includes('validation failed') || msg.includes('ZodError')) {
    return { category: 'CONTENT_VALIDATION_ERROR', service: 'openai', message: msg, retryable: true, phase };
  }

  // Rate limit / quota
  if (msg.includes('429') || msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('quota')) {
    return { category: 'RATE_LIMIT', service: 'openai', message: msg, retryable: true, phase };
  }

  // API errors
  if (msg.includes('OpenAI API error') || msg.includes('ECONNREFUSED') || msg.includes('fetch failed')) {
    return { category: 'CONTENT_GENERATION_ERROR', service: 'openai', message: msg, retryable: true, phase };
  }

  // DB errors
  if (msg.includes('MongoError') || msg.includes('MongoDB') || phase === 'state_update') {
    return { category: 'DB_UPDATE_FAILED', service: 'mongodb', message: msg, retryable: true, phase };
  }

  // Environment
  if (msg.includes('environment variable') || msg.includes('not set')) {
    return { category: 'ENV_MISSING', service: 'internal', message: msg, retryable: false, phase };
  }

  return {
    category: 'UNKNOWN',
    service: mapPhaseToService(phase),
    message: msg,
    retryable: false,
    phase,
  };
}

export function detectPhaseFromError(error: unknown, contentId: string | null): string {
  if (isTimeoutError(error)) {
    const opName = (error as TimeoutError).operationName.toLowerCase();
    if (opName.includes('openai') || opName.includes('content')) return 'content_generation';
    if (opName.includes('mongo')) return 'state_update';
  }

  if (error instanceof CircuitBreakerOpenError) {
    if (error.message.toLowerCase().includes('openai')) return 'content_generation';
  }

  if (!contentId) return 'content_selection';

  return 'unknown';
}
