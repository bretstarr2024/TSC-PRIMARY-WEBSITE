/**
 * Shared OpenAI client for the content pipeline.
 * Pure fetch (no SDK) with circuit breaker + timeout guard.
 * Extracted from scripts/generate-content.ts and hardened.
 */

import { withCircuitBreaker } from './circuit-breaker';
import { withContentGenerationTimeout } from './timeout-guard';
import { logPipelineEvent } from './logger';
import { estimateOpenAICost } from './cost-estimator';

// ============================================
// Types
// ============================================

export interface OpenAICallParams {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  contentId?: string | null;
}

export interface OpenAICallResult {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  estimatedCost: number;
}

// ============================================
// Client
// ============================================

/**
 * Call OpenAI's chat completions API with circuit breaker + timeout.
 * Uses pure fetch (no SDK dependency) per project constraint.
 *
 * Requires OPENAI_API_KEY environment variable.
 */
export async function callOpenAI(params: OpenAICallParams): Promise<OpenAICallResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const {
    systemPrompt,
    userPrompt,
    maxTokens = 4000,
    temperature = 0.7,
    contentId = null,
  } = params;

  const startTime = Date.now();

  // Wrap in circuit breaker + timeout
  const result = await withCircuitBreaker('openai', () =>
    withContentGenerationTimeout(async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI API error ${response.status}: ${text}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

      return {
        content,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        },
      };
    })
  );

  // Calculate cost from actual token usage
  const costEstimate = estimateOpenAICost({
    inputTokens: result.usage.promptTokens,
    outputTokens: result.usage.completionTokens,
  });

  const durationMs = Date.now() - startTime;

  // Log the call
  await logPipelineEvent({
    contentId,
    phase: 'content_generation',
    action: 'openai_call',
    success: true,
    durationMs,
    cost: {
      service: 'openai',
      amount: costEstimate.estimatedCost,
      unit: 'USD',
    },
    metadata: {
      model: 'gpt-4o',
      promptTokens: result.usage.promptTokens,
      completionTokens: result.usage.completionTokens,
      totalTokens: result.usage.totalTokens,
    },
  });

  return {
    content: result.content,
    usage: result.usage,
    estimatedCost: costEstimate.estimatedCost,
  };
}
