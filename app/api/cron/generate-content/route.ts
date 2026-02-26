/**
 * Autonomous Content Generation Cron Job
 *
 * Runs daily at 8am UTC to process the content queue:
 * 1. Pre-flight checks (circuit breaker, budget, env vars)
 * 2. Pull pending items from content_queue
 * 3. For each item: generate via OpenAI, validate with Zod, run quality checks, write to DB
 * 4. Log everything via pipeline logger
 *
 * Safety guardrails:
 * - Per-type daily caps (blog 1, FAQ 5, glossary 3, etc.)
 * - $5/day budget cap
 * - Brand voice scoring (heuristic, no extra API call)
 * - Duplicate title detection (Jaccard)
 * - Circuit breaker on OpenAI
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getNextPendingItems,
  updateQueueItemStatus,
  markQueueItemFailed,
  type ContentType,
  type ContentQueueItem,
} from '@/lib/content-db';
import {
  createFaq,
  createGlossaryTerm,
  createComparison,
  createExpertQa,
  createNewsItem,
  createCaseStudy,
  createIndustryBrief,
  createVideo,
  createTool,
} from '@/lib/resources-db';
import { createBlogPost } from '@/lib/content-db';
import { callOpenAI } from '@/lib/pipeline/openai-client';
import { parseGeneratedContent } from '@/lib/pipeline/schemas';
import { canAttempt, getAllCircuitBreakerStatus, formatCircuitBreakerStatus } from '@/lib/pipeline/circuit-breaker';
import { classifyError, detectPhaseFromError } from '@/lib/pipeline/error-classifier';
import { logPipelineEvent, logClassifiedError } from '@/lib/pipeline/logger';
import { estimateContentCost, formatCostBreakdown, estimateDailyRunCost } from '@/lib/pipeline/cost-estimator';
import {
  runPreFlight,
  runPostGenerationChecks,
  DAILY_CAPS,
  DAILY_BUDGET_USD,
} from '@/lib/pipeline/content-guardrails';
import {
  getFaqPrompts,
  getGlossaryPrompts,
  getBlogPrompts,
  getComparisonPrompts,
  getExpertQaPrompts,
  getNewsPrompts,
  getCaseStudyPrompts,
  getIndustryBriefPrompts,
  getVideoPrompts,
  getToolPrompts,
} from '@/lib/pipeline/content-prompts';
import { getClientConfig } from '@/lib/kernel/client';

export const maxDuration = 300; // 5 minutes

// ============================================
// Auth
// ============================================

function verifyAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.log('[Generate Content] No CRON_SECRET set, allowing request');
    return true;
  }
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

// ============================================
// Prompt Routing
// ============================================

function getPromptsForItem(
  item: ContentQueueItem,
  context: string
): { system: string; user: string } | null {
  const kernel = getClientConfig();
  const title = item.title || '';

  switch (item.contentType) {
    case 'faq_item':
      return getFaqPrompts(title, context);
    case 'glossary_term':
      return getGlossaryPrompts(title, context);
    case 'blog_post':
      return getBlogPrompts(title, context);
    case 'comparison':
      return getComparisonPrompts(title, context);
    case 'expert_qa': {
      const leaders = kernel.leaders;
      const expert = leaders[Math.floor(Math.random() * leaders.length)] ||
        { name: 'Bret Starr', title: 'Founder & CEO' };
      return getExpertQaPrompts(expert, title, context);
    }
    case 'news_item':
      return getNewsPrompts(title, context);
    case 'case_study':
      return getCaseStudyPrompts(title, context);
    case 'industry_brief':
      return getIndustryBriefPrompts(title, context);
    case 'video':
      return getVideoPrompts(title, context);
    case 'tool':
      return getToolPrompts(title, 'checklist', context);
    default:
      return null;
  }
}

// ============================================
// DB Write Routing
// ============================================

async function writeContentToDb(
  contentType: ContentType,
  data: Record<string, unknown>,
  item: ContentQueueItem
): Promise<string> {
  const common = {
    clusterName: item.clusterName,
    status: 'published' as const,
    origin: 'autonomous' as const,
    publishedAt: new Date(),
  };

  switch (contentType) {
    case 'faq_item':
      return createFaq({
        faqId: (data.faqId as string) || '',
        question: (data.question as string) || '',
        answer: (data.answer as string) || '',
        category: (data.category as string) || 'strategy',
        tags: (data.tags as string[]) || [],
        relatedFaqs: [],
        ...common,
      });
    case 'glossary_term':
      return createGlossaryTerm({
        termId: (data.termId as string) || '',
        term: (data.term as string) || '',
        acronym: (data.acronym as string) || undefined,
        shortDefinition: (data.shortDefinition as string) || '',
        fullDefinition: (data.fullDefinition as string) || '',
        examples: (data.examples as string[]) || [],
        synonyms: (data.synonyms as string[]) || [],
        relatedTerms: (data.relatedTerms as string[]) || [],
        category: (data.category as string) || 'marketing',
        tags: (data.tags as string[]) || [],
        ...common,
      });
    case 'blog_post':
      return createBlogPost({
        slug: (data.slug as string) || '',
        title: (data.title as string) || '',
        description: (data.description as string) || '',
        content: (data.content as string) || '',
        date: new Date().toISOString(),
        author: (data.author as string) || 'Bret Starr',
        tags: (data.tags as string[]) || [],
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
    case 'comparison':
      return createComparison({
        comparisonId: (data.comparisonId as string) || '',
        title: (data.title as string) || '',
        introduction: (data.introduction as string) || '',
        items: (data.items as []) || [],
        criteria: (data.criteria as []) || [],
        verdict: (data.verdict as string) || '',
        bestFor: (data.bestFor as []) || [],
        tags: (data.tags as string[]) || [],
        ...common,
      });
    case 'expert_qa':
      return createExpertQa({
        qaId: (data.qaId as string) || '',
        question: (data.question as string) || '',
        answer: (data.answer as string) || '',
        expert: (data.expert as { name: string; title: string; organization: string }) ||
          { name: 'Bret Starr', title: 'Founder & CEO', organization: 'The Starr Conspiracy' },
        quotableSnippets: (data.quotableSnippets as string[]) || [],
        tags: (data.tags as string[]) || [],
        ...common,
      });
    case 'news_item':
      return createNewsItem({
        newsId: (data.newsId as string) || '',
        headline: (data.headline as string) || '',
        summary: (data.summary as string) || '',
        commentary: (data.commentary as string) || '',
        source: (data.source as { name: string; url: string; publishedAt: Date }) ||
          { name: 'TSC Analysis', url: '', publishedAt: new Date() },
        category: ((data.category as string) || 'marketing') as 'marketing' | 'ai' | 'industry' | 'research',
        sentiment: ((data.sentiment as string) || 'neutral') as 'positive' | 'neutral' | 'negative',
        impact: ((data.impact as string) || 'medium') as 'high' | 'medium' | 'low',
        tags: (data.tags as string[]) || [],
        autoPublished: true,
        ...common,
      });
    case 'case_study':
      return createCaseStudy({
        caseStudyId: (data.caseStudyId as string) || '',
        title: (data.title as string) || '',
        client: (data.client as string) || '',
        industry: (data.industry as string) || '',
        challenge: (data.challenge as string) || '',
        approach: (data.approach as string) || '',
        results: (data.results as string) || '',
        metrics: (data.metrics as []) || [],
        testimonial: data.testimonial as { quote: string; attribution: string } | undefined,
        tags: (data.tags as string[]) || [],
        ...common,
      });
    case 'industry_brief':
      return createIndustryBrief({
        briefId: (data.briefId as string) || '',
        title: (data.title as string) || '',
        summary: (data.summary as string) || '',
        content: (data.content as string) || '',
        industry: (data.industry as string) || '',
        keyFindings: (data.keyFindings as string[]) || [],
        recommendations: (data.recommendations as string[]) || [],
        author: (data.author as string) || 'Bret Starr',
        tags: (data.tags as string[]) || [],
        ...common,
      });
    case 'video':
      return createVideo({
        videoId: (data.videoId as string) || '',
        title: (data.title as string) || '',
        description: (data.description as string) || '',
        duration: (data.duration as string) || '10:00',
        answerCapsule: (data.answerCapsule as string) || undefined,
        speaker: (data.speaker as string) || 'Bret Starr',
        tags: (data.tags as string[]) || [],
        ...common,
      });
    case 'tool':
      return createTool({
        toolId: (data.toolId as string) || '',
        title: (data.title as string) || '',
        description: (data.description as string) || '',
        toolType: (data.toolType as 'checklist' | 'assessment') || 'checklist',
        checklistItems: data.checklistItems as [] | undefined,
        assessmentQuestions: data.assessmentQuestions as [] | undefined,
        assessmentResults: data.assessmentResults as [] | undefined,
        downloadable: false,
        tags: (data.tags as string[]) || [],
        ...common,
      });
    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }
}

// ============================================
// Get primary text field for quality checks
// ============================================

function getPrimaryTextField(contentType: ContentType, data: Record<string, unknown>): string {
  switch (contentType) {
    case 'blog_post':
      return (data.content as string) || '';
    case 'faq_item':
      return (data.answer as string) || '';
    case 'glossary_term':
      return (data.fullDefinition as string) || '';
    case 'comparison':
      return (data.introduction as string) + ' ' + (data.verdict as string) || '';
    case 'expert_qa':
      return (data.answer as string) || '';
    case 'news_item':
      return (data.commentary as string) || '';
    case 'case_study':
      return (data.approach as string) || '';
    case 'industry_brief':
      return (data.content as string) || '';
    case 'video':
      return (data.description as string) || '';
    case 'tool':
      return (data.description as string) || '';
    default:
      return '';
  }
}

// ============================================
// Main Handler
// ============================================

export async function GET(request: NextRequest) {
  const pipelineRunId = `run-${Date.now()}`;
  const startTime = Date.now();

  // Auth check
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Environment check
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
  }
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'MONGODB_URI not configured' }, { status: 500 });
  }

  // Circuit breaker check
  const circuitStatus = getAllCircuitBreakerStatus();
  if (!canAttempt('openai')) {
    await logPipelineEvent({
      contentId: null,
      phase: 'preflight',
      action: 'circuit_breaker_check',
      success: false,
      durationMs: 0,
      error: 'OpenAI circuit breaker is OPEN',
      pipelineRunId,
    });
    return NextResponse.json({
      status: 'skipped',
      reason: 'Circuit breaker OPEN',
      circuits: formatCircuitBreakerStatus(circuitStatus),
    });
  }

  const results: Array<{
    contentType: ContentType;
    title: string;
    status: 'published' | 'failed' | 'skipped';
    reason?: string;
  }> = [];

  let totalSpend = 0;

  // Process queue items by type, respecting daily caps
  const contentTypes: ContentType[] = [
    'faq_item', 'glossary_term', 'blog_post', 'comparison', 'expert_qa',
    'news_item', 'case_study', 'industry_brief', 'video', 'tool',
  ];

  const publishedToday: Record<string, number> = {};

  for (const contentType of contentTypes) {
    const cap = DAILY_CAPS[contentType] || 1;

    // Get pending items for this type
    const items = await getNextPendingItems(cap, contentType);
    if (items.length === 0) continue;

    for (const item of items) {
      const itemId = item._id?.toString() || '';

      // Pre-flight for this item
      const preflight = runPreFlight({
        contentType: item.contentType,
        candidateTitle: item.title,
        publishedToday: publishedToday[contentType] || 0,
        estimatedSpendToday: totalSpend,
      });

      if (!preflight.approved) {
        const reason = preflight.issues.map((i) => i.message).join('; ');
        results.push({ contentType, title: item.title || '', status: 'skipped', reason });
        continue;
      }

      // Mark as generating
      await updateQueueItemStatus(itemId, 'generating');

      const context = `JTBD cluster: ${item.clusterName || 'General'}\nTarget queries: ${(item.targetQueries || []).join(', ')}`;

      try {
        // Get prompts
        const prompts = getPromptsForItem(item, context);
        if (!prompts) {
          await markQueueItemFailed(itemId, `No prompt generator for type: ${contentType}`);
          results.push({ contentType, title: item.title || '', status: 'failed', reason: 'No prompts' });
          continue;
        }

        // Call OpenAI
        const openaiResult = await callOpenAI({
          systemPrompt: prompts.system,
          userPrompt: prompts.user,
          contentId: itemId,
        });
        totalSpend += openaiResult.estimatedCost;

        // Parse + validate with Zod
        const parsed = parseGeneratedContent(openaiResult.content, contentType);
        if (!parsed.success) {
          await markQueueItemFailed(itemId, parsed.error);
          await logClassifiedError(
            itemId,
            classifyError(new Error(parsed.error), 'content_validation'),
            Date.now() - startTime,
            { pipelineRunId, rawResponse: parsed.rawResponse }
          );
          results.push({ contentType, title: item.title || '', status: 'failed', reason: parsed.error });
          continue;
        }

        const data = parsed.data as Record<string, unknown>;

        // Quality checks
        const primaryText = getPrimaryTextField(contentType, data);
        const quality = runPostGenerationChecks(primaryText, contentType);

        if (!quality.passed) {
          await markQueueItemFailed(itemId, `Quality check failed: ${quality.issues.join('; ')}`);
          results.push({ contentType, title: item.title || '', status: 'failed', reason: quality.issues.join('; ') });
          continue;
        }

        // Write to DB
        const contentId = await writeContentToDb(contentType, data, item);

        // Mark queue item as published
        await updateQueueItemStatus(itemId, 'published');

        publishedToday[contentType] = (publishedToday[contentType] || 0) + 1;

        await logPipelineEvent({
          contentId,
          phase: 'content_generation',
          action: 'published',
          success: true,
          durationMs: Date.now() - startTime,
          metadata: {
            contentType,
            qualityScore: quality.qualityScore,
            brandVoiceScore: quality.brandVoiceScore,
          },
          pipelineRunId,
        });

        results.push({ contentType, title: item.title || (data.title as string) || '', status: 'published' });
      } catch (error) {
        const phase = detectPhaseFromError(error, itemId);
        const classified = classifyError(error, phase);

        await markQueueItemFailed(itemId, classified.message);
        await logClassifiedError(itemId, classified, Date.now() - startTime, { pipelineRunId });

        results.push({ contentType, title: item.title || '', status: 'failed', reason: classified.message });
      }
    }
  }

  const durationMs = Date.now() - startTime;
  const published = results.filter((r) => r.status === 'published').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  // Log run summary
  await logPipelineEvent({
    contentId: null,
    phase: 'pipeline',
    action: 'run_complete',
    success: failed === 0,
    durationMs,
    metadata: { published, failed, skipped, totalSpend, pipelineRunId },
    pipelineRunId,
  });

  // Estimate daily cost
  const costBreakdown = estimateDailyRunCost(publishedToday);

  return NextResponse.json({
    status: 'complete',
    pipelineRunId,
    durationMs,
    summary: { published, failed, skipped },
    totalSpend: Math.round(totalSpend * 10000) / 10000,
    costBreakdown: formatCostBreakdown(costBreakdown),
    circuits: formatCircuitBreakerStatus(getAllCircuitBreakerStatus()),
    results,
  });
}
