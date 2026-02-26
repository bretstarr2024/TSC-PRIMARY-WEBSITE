/**
 * Cost estimation for content pipeline operations.
 * Estimates costs BEFORE making expensive API calls.
 * Adapted from AEO donor — simplified to OpenAI only.
 */

// ============================================
// Pricing Constants (as of Feb 2026)
// ============================================

const OPENAI_PRICING = {
  'gpt-4o': {
    input: 0.0025, // $2.50 per 1M input tokens
    output: 0.01, // $10 per 1M output tokens
  },
} as const;

// Typical token usage per content type (estimated)
const CONTENT_TYPE_ESTIMATES: Record<string, { inputTokens: number; outputTokens: number }> = {
  blog_post: { inputTokens: 2000, outputTokens: 2000 },
  faq_item: { inputTokens: 1500, outputTokens: 500 },
  glossary_term: { inputTokens: 1500, outputTokens: 800 },
  comparison: { inputTokens: 2000, outputTokens: 1500 },
  expert_qa: { inputTokens: 2000, outputTokens: 1000 },
  news_item: { inputTokens: 1500, outputTokens: 1000 },
  case_study: { inputTokens: 2000, outputTokens: 1500 },
  industry_brief: { inputTokens: 2000, outputTokens: 1500 },
  video: { inputTokens: 1500, outputTokens: 800 },
  tool: { inputTokens: 2000, outputTokens: 2000 },
};

// ============================================
// Estimation Functions
// ============================================

export function estimateOpenAICost(params: {
  inputTokens: number;
  outputTokens: number;
  model?: string;
}): { tokens: number; estimatedCost: number } {
  const model = params.model || 'gpt-4o';
  const pricing = OPENAI_PRICING[model as keyof typeof OPENAI_PRICING] || OPENAI_PRICING['gpt-4o'];

  const inputCost = (params.inputTokens / 1_000_000) * pricing.input;
  const outputCost = (params.outputTokens / 1_000_000) * pricing.output;

  return {
    tokens: params.inputTokens + params.outputTokens,
    estimatedCost: Math.round((inputCost + outputCost) * 10000) / 10000,
  };
}

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

export function estimateContentCost(contentType: string): {
  tokens: number;
  estimatedCost: number;
} {
  const estimate = CONTENT_TYPE_ESTIMATES[contentType] || { inputTokens: 2000, outputTokens: 1000 };
  return estimateOpenAICost(estimate);
}

export function estimateDailyRunCost(contentCounts: Record<string, number>): {
  perType: Record<string, { count: number; cost: number }>;
  total: number;
} {
  const perType: Record<string, { count: number; cost: number }> = {};
  let total = 0;

  for (const [type, count] of Object.entries(contentCounts)) {
    const cost = estimateContentCost(type);
    perType[type] = { count, cost: cost.estimatedCost * count };
    total += cost.estimatedCost * count;
  }

  return { perType, total: Math.round(total * 100) / 100 };
}

export function formatCostBreakdown(costs: ReturnType<typeof estimateDailyRunCost>): string {
  const lines = Object.entries(costs.perType)
    .filter(([, v]) => v.count > 0)
    .map(([type, v]) => `${type}: ${v.count}x ($${v.cost.toFixed(4)})`);
  lines.push(`Total: $${costs.total.toFixed(2)}`);
  return lines.join(' | ');
}
