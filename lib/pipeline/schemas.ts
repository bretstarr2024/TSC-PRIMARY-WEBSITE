/**
 * Zod validation schemas for all generated content types.
 * Validates OpenAI JSON output before writing to the database.
 * Each schema matches the OUTPUT FORMAT in the corresponding prompt generator.
 */

import { z } from 'zod';

// ============================================
// Shared Validators
// ============================================

const urlFriendlyId = z
  .string()
  .min(3, 'ID must be at least 3 characters')
  .max(80, 'ID must not exceed 80 characters')
  .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens');

const tags = z
  .array(z.string())
  .min(1, 'At least 1 tag required')
  .max(8, 'No more than 8 tags');

const markdownContent = (minChars: number, maxChars: number) =>
  z
    .string()
    .min(minChars, `Content must be at least ${minChars} characters`)
    .max(maxChars, `Content must not exceed ${maxChars} characters`);

// ============================================
// Per-Type Schemas
// ============================================

export const FaqSchema = z.object({
  faqId: urlFriendlyId,
  question: z.string().min(10).max(200),
  answer: markdownContent(200, 3000),
  category: z.enum(['strategy', 'demand-generation', 'ai-transformation', 'leadership', 'operations']),
  tags,
  answerCapsule: z.string().min(15).max(200),
});

export const GlossarySchema = z.object({
  termId: urlFriendlyId,
  term: z.string().min(2).max(80),
  acronym: z.string().nullable().optional(),
  shortDefinition: z.string().min(15).max(250),
  fullDefinition: markdownContent(200, 3000),
  examples: z.array(z.string()).min(1).max(5),
  synonyms: z.array(z.string()).max(5).optional(),
  relatedTerms: z.array(z.string()).max(5).optional(),
  category: z.enum(['strategy', 'marketing', 'technology', 'analytics', 'leadership']),
  tags,
});

export const BlogPostSchema = z.object({
  slug: urlFriendlyId,
  title: z.string().min(15).max(120),
  description: z.string().min(60).max(200),
  content: markdownContent(1500, 12000),
  author: z.enum(['Bret Starr', 'Racheal Bates', 'JJ La Pata']),
  tags,
});

export const ComparisonSchema = z.object({
  comparisonId: urlFriendlyId,
  title: z.string().min(10).max(150),
  introduction: markdownContent(100, 1500),
  items: z
    .array(
      z.object({
        name: z.string().min(2),
        description: z.string().min(30),
        scores: z.record(z.string(), z.number().min(1).max(10)),
        pros: z.array(z.string()).min(1).max(6),
        cons: z.array(z.string()).min(1).max(5),
      })
    )
    .min(2)
    .max(5),
  criteria: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        weight: z.number().min(1).max(5),
      })
    )
    .min(2)
    .max(8),
  verdict: markdownContent(80, 1500),
  bestFor: z
    .array(
      z.object({
        useCase: z.string(),
        recommendation: z.string(),
      })
    )
    .min(1)
    .max(5),
  tags,
});

export const ExpertQaSchema = z.object({
  qaId: urlFriendlyId,
  question: z.string().min(10).max(250),
  answer: markdownContent(300, 5000),
  expert: z.object({
    name: z.enum(['Bret Starr', 'Racheal Bates', 'JJ La Pata']),
    title: z.string().min(3),
    organization: z.literal('The Starr Conspiracy'),
  }),
  quotableSnippets: z.array(z.string()).min(1).max(5),
  tags,
});

export const NewsSchema = z.object({
  newsId: urlFriendlyId,
  headline: z.string().min(10).max(200),
  summary: z.string().min(30).max(500),
  commentary: markdownContent(200, 3000),
  source: z.object({
    name: z.string(),
    url: z.string(),
    publishedAt: z.string(),
  }),
  category: z.enum(['marketing', 'ai', 'industry', 'research']),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  impact: z.enum(['high', 'medium', 'low']),
  tags,
});

export const CaseStudySchema = z.object({
  caseStudyId: urlFriendlyId,
  title: z.string().min(10).max(150),
  client: z.string().min(2),
  industry: z.string().min(2),
  challenge: markdownContent(80, 1500),
  approach: markdownContent(200, 3000),
  results: markdownContent(80, 1500),
  metrics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(2)
    .max(8),
  testimonial: z
    .object({
      quote: z.string(),
      attribution: z.string(),
    })
    .optional(),
  tags,
});

export const IndustryBriefSchema = z.object({
  briefId: urlFriendlyId,
  title: z.string().min(10).max(150),
  summary: markdownContent(80, 1000),
  content: markdownContent(400, 6000),
  industry: z.string().min(2),
  keyFindings: z.array(z.string()).min(2).max(6),
  recommendations: z.array(z.string()).min(1).max(5),
  author: z.enum(['Bret Starr', 'Racheal Bates', 'JJ La Pata']),
  tags,
});

export const VideoSchema = z.object({
  videoId: urlFriendlyId,
  title: z.string().min(10).max(150),
  description: markdownContent(200, 4000),
  duration: z.string().regex(/^\d{1,2}:\d{2}$/, 'Duration must be in M:SS or MM:SS format'),
  answerCapsule: z.string().min(15).max(200),
  speaker: z.enum(['Bret Starr', 'Racheal Bates', 'JJ La Pata']),
  tags,
});

export const ToolChecklistSchema = z.object({
  toolId: urlFriendlyId,
  title: z.string().min(10).max(150),
  description: markdownContent(60, 1000),
  toolType: z.literal('checklist'),
  checklistItems: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(5),
        description: z.string().min(10),
        category: z.string(),
        order: z.number().int().positive(),
      })
    )
    .min(5)
    .max(20),
  downloadable: z.boolean(),
  tags,
});

export const ToolAssessmentSchema = z.object({
  toolId: urlFriendlyId,
  title: z.string().min(10).max(150),
  description: markdownContent(60, 1000),
  toolType: z.literal('assessment'),
  assessmentQuestions: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().min(10),
        options: z
          .array(
            z.object({
              text: z.string(),
              value: z.number(),
            })
          )
          .min(2)
          .max(5),
        category: z.string(),
        order: z.number().int().positive(),
      })
    )
    .min(4)
    .max(15),
  assessmentResults: z
    .array(
      z.object({
        minScore: z.number(),
        maxScore: z.number(),
        title: z.string(),
        description: z.string(),
        recommendations: z.array(z.string()).min(1),
      })
    )
    .min(2)
    .max(5),
  downloadable: z.boolean(),
  tags,
});

export const ToolSchema = z.discriminatedUnion('toolType', [
  ToolChecklistSchema,
  ToolAssessmentSchema,
]);

// ============================================
// Schema Registry
// ============================================

const CONTENT_SCHEMAS: Record<string, z.ZodTypeAny> = {
  faq_item: FaqSchema,
  glossary_term: GlossarySchema,
  blog_post: BlogPostSchema,
  comparison: ComparisonSchema,
  expert_qa: ExpertQaSchema,
  news_item: NewsSchema,
  case_study: CaseStudySchema,
  industry_brief: IndustryBriefSchema,
  video: VideoSchema,
  tool: ToolSchema,
};

// ============================================
// Generic Parser
// ============================================

/**
 * Parse raw OpenAI output into a validated content object.
 * Strips markdown code blocks, parses JSON, validates with Zod.
 */
export function parseGeneratedContent<T = unknown>(
  raw: string,
  contentType: string
): { success: true; data: T } | { success: false; error: string; rawResponse: string } {
  const schema = CONTENT_SCHEMAS[contentType];
  if (!schema) {
    return { success: false, error: `No schema for content type: ${contentType}`, rawResponse: raw };
  }

  try {
    // Strip markdown code blocks
    let jsonStr = raw.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr);
    const validated = schema.parse(parsed);
    return { success: true, data: validated as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      return { success: false, error: `Validation failed: ${issues}`, rawResponse: raw };
    }
    if (error instanceof SyntaxError) {
      return { success: false, error: `JSON parse error: ${error.message}`, rawResponse: raw };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse content',
      rawResponse: raw,
    };
  }
}

/**
 * Get the Zod schema for a content type.
 */
export function getSchemaForType(contentType: string): z.ZodTypeAny | null {
  return CONTENT_SCHEMAS[contentType] || null;
}
