/**
 * Content generation quality guardrails.
 * Validates AI-generated content before publication:
 * - Duplicate detection (Jaccard title similarity)
 * - Brand voice / forbidden term checks
 * - Content length validation
 * - Daily budget enforcement
 * - Per-type daily cap enforcement
 * - Quality scoring
 *
 * Adapted from AEO donor — simplified for kernel-driven generation
 * (no claims-based dedup, no semantic embedding dedup, no factual grounding).
 */

import type { ContentType } from '../content-db';

// ============================================
// Jaccard Similarity (title dedup)
// ============================================

const DEDUP_STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
  'and', 'or', 'but', 'not', 'no', 'so', 'if', 'then',
  'i', 'my', 'me', 'you', 'your', 'we', 'our', 'it', 'its',
  'how', 'what', 'why', 'when', 'where', 'which', 'who',
  'that', 'this', 'these', 'those', 'has', 'have', 'had',
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 1 && !DEDUP_STOP_WORDS.has(t))
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  Array.from(a).forEach((token) => {
    if (b.has(token)) intersection++;
  });
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

const TITLE_JACCARD_THRESHOLD = 0.50;

// ============================================
// Brand Voice Constants
// ============================================

const FORBIDDEN_TERMS = [
  'thought leader',
  'synergy',
  'pioneers of aeo',
  'fractional cmo',
  'customer',    // should be "client"
  'contract',    // should be "engagement"
  'vendor',      // should be "partner"
];

// Terms that indicate TSC brand voice alignment
const BRAND_VOICE_POSITIVE = [
  'you', 'we', 'your',           // conversational
  'direct', 'practical',          // tone markers
  'data', 'strategy',             // substance
];

// ============================================
// Daily Caps (per content type)
// ============================================

export const DAILY_CAPS: Record<ContentType, number> = {
  blog_post: 1,
  faq_item: 5,
  glossary_term: 3,
  expert_qa: 2,
  comparison: 1,
  news_item: 2,
  case_study: 1,
  industry_brief: 1,
  video: 1,
  tool: 1,
};

// ============================================
// Budget Constants
// ============================================

export const DAILY_BUDGET_USD = 5.0;
export const MIN_QUALITY_SCORE = 60;
export const MIN_BRAND_VOICE_SCORE = 50;

// ============================================
// Validation Functions
// ============================================

/**
 * Check for forbidden terms in generated content.
 * Returns list of violations found.
 */
export function checkForbiddenTerms(text: string): string[] {
  const lower = text.toLowerCase();
  return FORBIDDEN_TERMS.filter((term) => lower.includes(term));
}

/**
 * Score brand voice alignment (0-100) without calling OpenAI.
 * Uses heuristic checks based on TSC voice rules.
 */
export function scoreBrandVoice(text: string): {
  score: number;
  issues: string[];
  passed: boolean;
} {
  const issues: string[] = [];
  let score = 70; // Start optimistic

  const lower = text.toLowerCase();
  const words = text.split(/\s+/);
  const wordCount = words.length;

  // 1. Forbidden terms (-15 each)
  const forbidden = checkForbiddenTerms(text);
  if (forbidden.length > 0) {
    score -= forbidden.length * 15;
    issues.push(`Forbidden terms: ${forbidden.join(', ')}`);
  }

  // 2. Conversational voice check: uses "you" / "your" (+10)
  const youCount = (lower.match(/\byou\b|\byour\b/g) || []).length;
  if (youCount > 0 && wordCount > 50) {
    score += 10;
  } else if (wordCount > 100) {
    score -= 5;
    issues.push('Missing conversational "you/your" address');
  }

  // 3. Paragraph structure: short paragraphs preferred
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  if (paragraphs.length > 0) {
    const avgParaLen = wordCount / paragraphs.length;
    if (avgParaLen > 100) {
      score -= 5;
      issues.push('Paragraphs too long — aim for 2-4 sentences each');
    }
  }

  // 4. Structure: uses headers/lists (+5)
  const hasStructure = text.includes('##') || text.includes('- ') || text.includes('1.');
  if (hasStructure && wordCount > 200) {
    score += 5;
  }

  // 5. Corporate jargon penalty
  const jargon = ['leverage', 'utilize', 'holistic', 'paradigm', 'ecosystem', 'ideate', 'deep dive'];
  const jargonFound = jargon.filter((j) => lower.includes(j));
  if (jargonFound.length > 0) {
    score -= jargonFound.length * 5;
    issues.push(`Corporate jargon detected: ${jargonFound.join(', ')}`);
  }

  // 6. Positive signal bonus
  const positiveCount = BRAND_VOICE_POSITIVE.filter((t) => lower.includes(t)).length;
  score += Math.min(positiveCount * 2, 10);

  // Clamp
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    issues,
    passed: score >= MIN_BRAND_VOICE_SCORE,
  };
}

/**
 * Check content length by word count.
 */
export function checkContentLength(
  content: string,
  contentType: ContentType
): { wordCount: number; passed: boolean; issue?: string } {
  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;

  const limits: Record<ContentType, { min: number; max: number }> = {
    blog_post: { min: 400, max: 1500 },
    faq_item: { min: 50, max: 500 },
    glossary_term: { min: 50, max: 500 },
    comparison: { min: 200, max: 1200 },
    expert_qa: { min: 100, max: 800 },
    news_item: { min: 80, max: 600 },
    case_study: { min: 200, max: 1000 },
    industry_brief: { min: 200, max: 1000 },
    video: { min: 80, max: 600 },
    tool: { min: 50, max: 400 },
  };

  const { min, max } = limits[contentType] || { min: 50, max: 1500 };

  if (wordCount < min) {
    return { wordCount, passed: false, issue: `Content too short: ${wordCount} words (minimum ${min})` };
  }
  if (wordCount > max) {
    return { wordCount, passed: false, issue: `Content too long: ${wordCount} words (maximum ${max})` };
  }

  return { wordCount, passed: true };
}

/**
 * Check if a title is too similar to existing titles.
 */
export function checkTitleDuplicate(
  candidateTitle: string,
  existingTitles: string[]
): { isDuplicate: boolean; duplicateTitle?: string; similarity?: number } {
  const candidateTokens = tokenize(candidateTitle);
  if (candidateTokens.size === 0) return { isDuplicate: false };

  for (const existing of existingTitles) {
    const existingTokens = tokenize(existing);
    const sim = jaccardSimilarity(candidateTokens, existingTokens);
    if (sim >= TITLE_JACCARD_THRESHOLD) {
      return {
        isDuplicate: true,
        duplicateTitle: existing,
        similarity: Math.round(sim * 100) / 100,
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * Check daily budget based on estimated spend so far.
 */
export function checkDailyBudget(estimatedSpendToday: number): {
  withinBudget: boolean;
  remainingUsd: number;
} {
  const remaining = Math.max(0, DAILY_BUDGET_USD - estimatedSpendToday);
  return {
    withinBudget: remaining > 0,
    remainingUsd: Math.round(remaining * 100) / 100,
  };
}

/**
 * Check if we've hit the daily cap for a content type.
 */
export function checkDailyCap(
  contentType: ContentType,
  publishedToday: number
): { withinCap: boolean; remaining: number } {
  const cap = DAILY_CAPS[contentType] || 1;
  return {
    withinCap: publishedToday < cap,
    remaining: Math.max(0, cap - publishedToday),
  };
}

// ============================================
// Quality Score
// ============================================

/**
 * Calculate overall quality score for generated content.
 * Score 0-100: lengthPassed (40) + brandVoiceScore (60 weighted)
 */
export function calculateQualityScore(params: {
  lengthPassed: boolean;
  brandVoiceScore: number;
}): number {
  const lengthPoints = params.lengthPassed ? 40 : 0;
  const voicePoints = (params.brandVoiceScore / 100) * 60;
  return Math.round(lengthPoints + voicePoints);
}

// ============================================
// Pre-Flight Orchestration
// ============================================

export interface PreFlightResult {
  approved: boolean;
  issues: Array<{
    severity: 'error' | 'warning';
    check: string;
    message: string;
  }>;
  budget: {
    remainingUsd: number;
    withinBudget: boolean;
  };
  cap?: {
    withinCap: boolean;
    remaining: number;
  };
  duplicate?: {
    isDuplicate: boolean;
    duplicateTitle?: string;
  };
}

/**
 * Run pre-flight checks before generating content.
 */
export function runPreFlight(params: {
  contentType: ContentType;
  candidateTitle?: string;
  existingTitles?: string[];
  publishedToday: number;
  estimatedSpendToday: number;
}): PreFlightResult {
  const issues: PreFlightResult['issues'] = [];

  // 1. Budget check
  const budget = checkDailyBudget(params.estimatedSpendToday);
  if (!budget.withinBudget) {
    issues.push({
      severity: 'error',
      check: 'budget',
      message: `Daily budget exhausted ($${budget.remainingUsd.toFixed(2)} remaining of $${DAILY_BUDGET_USD})`,
    });
  }

  // 2. Daily cap check
  const cap = checkDailyCap(params.contentType, params.publishedToday);
  if (!cap.withinCap) {
    issues.push({
      severity: 'error',
      check: 'daily_cap',
      message: `Daily cap reached for ${params.contentType} (${params.publishedToday}/${DAILY_CAPS[params.contentType]})`,
    });
  }

  // 3. Title duplicate check
  let duplicate: { isDuplicate: boolean; duplicateTitle?: string } | undefined;
  if (params.candidateTitle && params.existingTitles && params.existingTitles.length > 0) {
    duplicate = checkTitleDuplicate(params.candidateTitle, params.existingTitles);
    if (duplicate.isDuplicate) {
      issues.push({
        severity: 'error',
        check: 'duplicate',
        message: `Title too similar to: "${duplicate.duplicateTitle}"`,
      });
    }
  }

  const hasErrors = issues.some((i) => i.severity === 'error');

  return {
    approved: !hasErrors,
    issues,
    budget,
    cap,
    duplicate,
  };
}

/**
 * Run post-generation quality checks on content.
 */
export function runPostGenerationChecks(
  content: string,
  contentType: ContentType
): {
  passed: boolean;
  qualityScore: number;
  brandVoiceScore: number;
  issues: string[];
} {
  const issues: string[] = [];

  // 1. Content length
  const lengthCheck = checkContentLength(content, contentType);
  if (!lengthCheck.passed && lengthCheck.issue) {
    issues.push(lengthCheck.issue);
  }

  // 2. Brand voice (heuristic — no API call)
  const brandVoice = scoreBrandVoice(content);
  if (!brandVoice.passed) {
    issues.push(`Brand voice score: ${brandVoice.score}/100 (minimum ${MIN_BRAND_VOICE_SCORE})`);
    issues.push(...brandVoice.issues);
  }

  // 3. Forbidden terms
  const forbidden = checkForbiddenTerms(content);
  if (forbidden.length > 0) {
    issues.push(`Forbidden terms found: ${forbidden.join(', ')}`);
  }

  // Calculate quality score
  const qualityScore = calculateQualityScore({
    lengthPassed: lengthCheck.passed,
    brandVoiceScore: brandVoice.score,
  });

  const passed =
    lengthCheck.passed &&
    brandVoice.passed &&
    forbidden.length === 0 &&
    qualityScore >= MIN_QUALITY_SCORE;

  return {
    passed,
    qualityScore,
    brandVoiceScore: brandVoice.score,
    issues,
  };
}
