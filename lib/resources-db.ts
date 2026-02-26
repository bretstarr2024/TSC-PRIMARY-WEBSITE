/**
 * MongoDB helpers for resource types.
 * Manages: faq_items, glossary_terms, comparisons, expert_qa,
 *          news_items, case_studies, industry_briefs, videos, tools, query_coverage
 * Multi-tenant: all documents include clientId, all queries filter by it.
 * Adapted from AEO donor codebase (lib/resources-db.ts) + 2 new types.
 */

import { Collection, ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { getClientId } from './kernel/client';

// ===========================================
// Shared Types
// ===========================================

export type ResourceStatus = 'draft' | 'published' | 'archived';
export type ResourceOrigin = 'manual' | 'autonomous';

// ===========================================
// Query Coverage (JTBD cross-linking)
// ===========================================

export interface QueryCoverage {
  _id?: ObjectId;
  clientId: string;
  seedId: number;
  clusterName: string;
  query: string;
  queryNormalized: string;
  coverage: {
    faqItems: string[];
    glossaryTerms: string[];
    blogPosts: string[];
    comparisons: string[];
    expertQa: string[];
    newsItems: string[];
    caseStudies: string[];
    industryBriefs: string[];
    videos: string[];
    tools: string[];
  };
  coverageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// FAQ Items
// ===========================================

export interface FaqItem {
  _id?: ObjectId;
  clientId: string;
  faqId: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  relatedFaqs: string[];
  seedId?: number;
  clusterName?: string;
  targetQueries?: string[];
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Glossary Terms
// ===========================================

export interface GlossaryTerm {
  _id?: ObjectId;
  clientId: string;
  termId: string;
  term: string;
  acronym?: string;
  shortDefinition: string;
  fullDefinition: string;
  examples: string[];
  synonyms: string[];
  relatedTerms: string[];
  category: string;
  tags: string[];
  seedId?: number;
  clusterName?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Comparisons
// ===========================================

export interface ComparisonItem {
  name: string;
  description: string;
  scores: Record<string, number>;
  pros: string[];
  cons: string[];
}

export interface ComparisonCriterion {
  name: string;
  description: string;
  weight: number;
}

export interface Comparison {
  _id?: ObjectId;
  clientId: string;
  comparisonId: string;
  title: string;
  introduction: string;
  items: ComparisonItem[];
  criteria: ComparisonCriterion[];
  verdict: string;
  bestFor?: Array<{ useCase: string; recommendation: string }>;
  tags: string[];
  seedId?: number;
  clusterName?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Expert Q&A
// ===========================================

export interface ExpertQaItem {
  _id?: ObjectId;
  clientId: string;
  qaId: string;
  question: string;
  answer: string;
  expert: {
    name: string;
    title: string;
    organization: string;
  };
  quotableSnippets: string[];
  tags: string[];
  seedId?: number;
  clusterName?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// News Items
// ===========================================

export type NewsCategory = 'marketing' | 'ai' | 'industry' | 'research';
export type NewsSentiment = 'positive' | 'neutral' | 'negative';
export type NewsImpact = 'high' | 'medium' | 'low';

export interface NewsItem {
  _id?: ObjectId;
  clientId: string;
  newsId: string;
  headline: string;
  summary: string;
  commentary: string; // Client perspective
  source: {
    name: string;
    url: string;
    publishedAt: Date;
  };
  category: NewsCategory;
  sentiment: NewsSentiment;
  impact: NewsImpact;
  tags: string[];
  status: ResourceStatus;
  origin: ResourceOrigin;
  autoPublished: boolean;
  expiresAt?: Date;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Case Studies (NEW — not in AEO)
// ===========================================

export interface CaseStudy {
  _id?: ObjectId;
  clientId: string;
  caseStudyId: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  approach: string;
  results: string;
  metrics: Array<{ label: string; value: string }>;
  testimonial?: { quote: string; attribution: string };
  tags: string[];
  seedId?: number;
  clusterName?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Industry Briefs (NEW — not in AEO)
// ===========================================

export interface IndustryBrief {
  _id?: ObjectId;
  clientId: string;
  briefId: string;
  title: string;
  summary: string;
  content: string; // Markdown body
  industry: string;
  keyFindings: string[];
  recommendations: string[];
  author: string;
  tags: string[];
  seedId?: number;
  clusterName?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Videos
// ===========================================

export interface Video {
  _id?: ObjectId;
  clientId: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  embedUrl?: string;
  duration?: string;
  transcript?: string;
  answerCapsule?: string;
  speaker?: string;
  tags: string[];
  seedId?: number;
  clusterName?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Tools
// ===========================================

export type ToolType = 'checklist' | 'assessment' | 'calculator';

export interface ChecklistItem {
  id: string;
  text: string;
  description?: string;
  category?: string;
  order: number;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: { text: string; value: number }[];
  category?: string;
  order: number;
}

export interface AssessmentResult {
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
  recommendations: string[];
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'range';
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: number }[];
}

export interface CalculatorConfig {
  inputs: CalculatorInput[];
  formula: string;
  outputLabel: string;
  outputFormat: 'number' | 'currency' | 'percentage';
}

export interface Tool {
  _id?: ObjectId;
  clientId: string;
  toolId: string;
  title: string;
  description: string;
  toolType: ToolType;
  checklistItems?: ChecklistItem[];
  assessmentQuestions?: AssessmentQuestion[];
  assessmentResults?: AssessmentResult[];
  calculatorConfig?: CalculatorConfig;
  downloadable: boolean;
  downloadUrl?: string;
  tags: string[];
  seedId?: number;
  clusterName?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Infographics
// ===========================================

export interface Infographic {
  _id?: ObjectId;
  clientId: string;
  infographicId: string;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  category?: string;
  tags: string[];
  seedId?: number;
  clusterName?: string;
  status: ResourceStatus;
  origin: ResourceOrigin;
  createdAt: Date;
  publishedAt?: Date;
  updatedAt: Date;
}

// ===========================================
// Collection Helpers
// ===========================================

async function getCollection<T extends { _id?: ObjectId }>(name: string): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(name);
}

export const getFaqCollection = () => getCollection<FaqItem>('faq_items');
export const getGlossaryCollection = () => getCollection<GlossaryTerm>('glossary_terms');
export const getComparisonCollection = () => getCollection<Comparison>('comparisons');
export const getExpertQaCollection = () => getCollection<ExpertQaItem>('expert_qa');
export const getNewsCollection = () => getCollection<NewsItem>('news_items');
export const getCaseStudyCollection = () => getCollection<CaseStudy>('case_studies');
export const getIndustryBriefCollection = () => getCollection<IndustryBrief>('industry_briefs');
export const getVideoCollection = () => getCollection<Video>('videos');
export const getToolCollection = () => getCollection<Tool>('tools');
export const getInfographicCollection = () => getCollection<Infographic>('infographics');
export const getQueryCoverageCollection = () => getCollection<QueryCoverage>('query_coverage');

// ===========================================
// FAQ Operations
// ===========================================

export async function createFaq(item: Omit<FaqItem, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getFaqCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getFaqById(faqId: string): Promise<FaqItem | null> {
  const collection = await getFaqCollection();
  return collection.findOne({ clientId: getClientId(), faqId });
}

export async function getPublishedFaqById(faqId: string): Promise<FaqItem | null> {
  const collection = await getFaqCollection();
  return collection.findOne({ clientId: getClientId(), faqId, status: 'published' });
}

export async function getAllPublishedFaqs(): Promise<FaqItem[]> {
  const collection = await getFaqCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ category: 1, createdAt: -1 }).toArray();
}

export async function getAllFaqIds(): Promise<string[]> {
  const collection = await getFaqCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ faqId: 1 }).toArray();
  return items.map((i) => i.faqId);
}

// ===========================================
// Glossary Operations
// ===========================================

export async function createGlossaryTerm(item: Omit<GlossaryTerm, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getGlossaryCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getGlossaryTermById(termId: string): Promise<GlossaryTerm | null> {
  const collection = await getGlossaryCollection();
  return collection.findOne({ clientId: getClientId(), termId });
}

export async function getPublishedGlossaryTermById(termId: string): Promise<GlossaryTerm | null> {
  const collection = await getGlossaryCollection();
  return collection.findOne({ clientId: getClientId(), termId, status: 'published' });
}

export async function getAllPublishedGlossaryTerms(): Promise<GlossaryTerm[]> {
  const collection = await getGlossaryCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ term: 1 }).toArray();
}

export async function getAllGlossaryTermIds(): Promise<string[]> {
  const collection = await getGlossaryCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ termId: 1 }).toArray();
  return items.map((i) => i.termId);
}

// ===========================================
// Comparison Operations
// ===========================================

export async function createComparison(item: Omit<Comparison, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getComparisonCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getComparisonById(comparisonId: string): Promise<Comparison | null> {
  const collection = await getComparisonCollection();
  return collection.findOne({ clientId: getClientId(), comparisonId });
}

export async function getPublishedComparisonById(comparisonId: string): Promise<Comparison | null> {
  const collection = await getComparisonCollection();
  return collection.findOne({ clientId: getClientId(), comparisonId, status: 'published' });
}

export async function getAllPublishedComparisons(): Promise<Comparison[]> {
  const collection = await getComparisonCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ createdAt: -1 }).toArray();
}

export async function getAllComparisonIds(): Promise<string[]> {
  const collection = await getComparisonCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ comparisonId: 1 }).toArray();
  return items.map((i) => i.comparisonId);
}

// ===========================================
// Expert Q&A Operations
// ===========================================

export async function createExpertQa(item: Omit<ExpertQaItem, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getExpertQaCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getExpertQaById(qaId: string): Promise<ExpertQaItem | null> {
  const collection = await getExpertQaCollection();
  return collection.findOne({ clientId: getClientId(), qaId });
}

export async function getPublishedExpertQaById(qaId: string): Promise<ExpertQaItem | null> {
  const collection = await getExpertQaCollection();
  return collection.findOne({ clientId: getClientId(), qaId, status: 'published' });
}

export async function getAllPublishedExpertQa(): Promise<ExpertQaItem[]> {
  const collection = await getExpertQaCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ createdAt: -1 }).toArray();
}

export async function getAllExpertQaIds(): Promise<string[]> {
  const collection = await getExpertQaCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ qaId: 1 }).toArray();
  return items.map((i) => i.qaId);
}

// ===========================================
// News Operations
// ===========================================

export async function createNewsItem(item: Omit<NewsItem, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getNewsCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getNewsItemById(newsId: string): Promise<NewsItem | null> {
  const collection = await getNewsCollection();
  return collection.findOne({ clientId: getClientId(), newsId });
}

export async function getPublishedNewsItemById(newsId: string): Promise<NewsItem | null> {
  const collection = await getNewsCollection();
  return collection.findOne({ clientId: getClientId(), newsId, status: 'published' });
}

export async function getAllPublishedNews(): Promise<NewsItem[]> {
  const collection = await getNewsCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ 'source.publishedAt': -1 }).toArray();
}

export async function getAllNewsIds(): Promise<string[]> {
  const collection = await getNewsCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ newsId: 1 }).toArray();
  return items.map((i) => i.newsId);
}

// ===========================================
// Case Study Operations
// ===========================================

export async function createCaseStudy(item: Omit<CaseStudy, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getCaseStudyCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getCaseStudyById(caseStudyId: string): Promise<CaseStudy | null> {
  const collection = await getCaseStudyCollection();
  return collection.findOne({ clientId: getClientId(), caseStudyId });
}

export async function getPublishedCaseStudyById(caseStudyId: string): Promise<CaseStudy | null> {
  const collection = await getCaseStudyCollection();
  return collection.findOne({ clientId: getClientId(), caseStudyId, status: 'published' });
}

export async function getAllPublishedCaseStudies(): Promise<CaseStudy[]> {
  const collection = await getCaseStudyCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ createdAt: -1 }).toArray();
}

export async function getAllCaseStudyIds(): Promise<string[]> {
  const collection = await getCaseStudyCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ caseStudyId: 1 }).toArray();
  return items.map((i) => i.caseStudyId);
}

// ===========================================
// Industry Brief Operations
// ===========================================

export async function createIndustryBrief(item: Omit<IndustryBrief, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getIndustryBriefCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getIndustryBriefById(briefId: string): Promise<IndustryBrief | null> {
  const collection = await getIndustryBriefCollection();
  return collection.findOne({ clientId: getClientId(), briefId });
}

export async function getPublishedIndustryBriefById(briefId: string): Promise<IndustryBrief | null> {
  const collection = await getIndustryBriefCollection();
  return collection.findOne({ clientId: getClientId(), briefId, status: 'published' });
}

export async function getAllPublishedIndustryBriefs(): Promise<IndustryBrief[]> {
  const collection = await getIndustryBriefCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ createdAt: -1 }).toArray();
}

export async function getAllIndustryBriefIds(): Promise<string[]> {
  const collection = await getIndustryBriefCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ briefId: 1 }).toArray();
  return items.map((i) => i.briefId);
}

// ===========================================
// Video Operations
// ===========================================

export async function createVideo(item: Omit<Video, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getVideoCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getVideoById(videoId: string): Promise<Video | null> {
  const collection = await getVideoCollection();
  return collection.findOne({ clientId: getClientId(), videoId });
}

export async function getPublishedVideoById(videoId: string): Promise<Video | null> {
  const collection = await getVideoCollection();
  return collection.findOne({ clientId: getClientId(), videoId, status: 'published' });
}

export async function getAllPublishedVideos(): Promise<Video[]> {
  const collection = await getVideoCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ createdAt: -1 }).toArray();
}

export async function getAllVideoIds(): Promise<string[]> {
  const collection = await getVideoCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ videoId: 1 }).toArray();
  return items.map((i) => i.videoId);
}

// ===========================================
// Tool Operations
// ===========================================

export async function createTool(item: Omit<Tool, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getToolCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getToolById(toolId: string): Promise<Tool | null> {
  const collection = await getToolCollection();
  return collection.findOne({ clientId: getClientId(), toolId });
}

export async function getPublishedToolById(toolId: string): Promise<Tool | null> {
  const collection = await getToolCollection();
  return collection.findOne({ clientId: getClientId(), toolId, status: 'published' });
}

export async function getAllPublishedTools(): Promise<Tool[]> {
  const collection = await getToolCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ createdAt: -1 }).toArray();
}

export async function getAllToolIds(): Promise<string[]> {
  const collection = await getToolCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ toolId: 1 }).toArray();
  return items.map((i) => i.toolId);
}

export async function getToolsByType(toolType: ToolType): Promise<Tool[]> {
  const collection = await getToolCollection();
  return collection.find({ clientId: getClientId(), toolType, status: 'published' }).sort({ createdAt: -1 }).toArray();
}

// ===========================================
// Infographic Operations
// ===========================================

export async function createInfographic(item: Omit<Infographic, '_id' | 'clientId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collection = await getInfographicCollection();
  const clientId = getClientId();
  const result = await collection.insertOne({ ...item, clientId, createdAt: new Date(), updatedAt: new Date() });
  return result.insertedId.toString();
}

export async function getInfographicById(infographicId: string): Promise<Infographic | null> {
  const collection = await getInfographicCollection();
  return collection.findOne({ clientId: getClientId(), infographicId });
}

export async function getPublishedInfographicById(infographicId: string): Promise<Infographic | null> {
  const collection = await getInfographicCollection();
  return collection.findOne({ clientId: getClientId(), infographicId, status: 'published' });
}

export async function getAllPublishedInfographics(): Promise<Infographic[]> {
  const collection = await getInfographicCollection();
  return collection.find({ clientId: getClientId(), status: 'published' }).sort({ createdAt: -1 }).toArray();
}

export async function getAllInfographicIds(): Promise<string[]> {
  const collection = await getInfographicCollection();
  const items = await collection.find({ clientId: getClientId(), status: 'published' }).project({ infographicId: 1 }).toArray();
  return items.map((i) => i.infographicId);
}

// ===========================================
// Resource Counts (for hub page)
// ===========================================

export async function getResourceCounts(): Promise<Record<string, number>> {
  const clientId = getClientId();

  const [faqs, glossary, comparisons, expertQa, news, caseStudies, industryBriefs, videos, tools, infographics] = await Promise.all([
    (await getFaqCollection()).countDocuments({ clientId, status: 'published' }),
    (await getGlossaryCollection()).countDocuments({ clientId, status: 'published' }),
    (await getComparisonCollection()).countDocuments({ clientId, status: 'published' }),
    (await getExpertQaCollection()).countDocuments({ clientId, status: 'published' }),
    (await getNewsCollection()).countDocuments({ clientId, status: 'published' }),
    (await getCaseStudyCollection()).countDocuments({ clientId, status: 'published' }),
    (await getIndustryBriefCollection()).countDocuments({ clientId, status: 'published' }),
    (await getVideoCollection()).countDocuments({ clientId, status: 'published' }),
    (await getToolCollection()).countDocuments({ clientId, status: 'published' }),
    (await getInfographicCollection()).countDocuments({ clientId, status: 'published' }),
  ]);

  return { faqs, glossary, comparisons, expertQa, news, caseStudies, industryBriefs, videos, tools, infographics };
}

// ===========================================
// Query Coverage Operations
// ===========================================

export async function upsertQueryCoverage(
  seedId: number,
  clusterName: string,
  query: string
): Promise<void> {
  const collection = await getQueryCoverageCollection();
  const clientId = getClientId();
  const queryNormalized = query.toLowerCase().trim();

  await collection.updateOne(
    { clientId, queryNormalized },
    {
      $set: { seedId, clusterName, query, updatedAt: new Date() },
      $setOnInsert: {
        clientId,
        queryNormalized,
        coverage: {
          faqItems: [], glossaryTerms: [], blogPosts: [], comparisons: [],
          expertQa: [], newsItems: [], caseStudies: [], industryBriefs: [], videos: [], tools: [],
        },
        coverageScore: 0,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function linkContentToQuery(
  queryNormalized: string,
  contentType: keyof QueryCoverage['coverage'],
  contentId: string
): Promise<void> {
  const collection = await getQueryCoverageCollection();
  const clientId = getClientId();

  await collection.updateOne(
    { clientId, queryNormalized },
    { $addToSet: { [`coverage.${contentType}`]: contentId }, $set: { updatedAt: new Date() } }
  );
}

export async function getUncoveredQueries(limit: number = 20): Promise<QueryCoverage[]> {
  const collection = await getQueryCoverageCollection();
  const clientId = getClientId();

  return collection
    .find({ clientId, coverageScore: { $lt: 50 } })
    .sort({ coverageScore: 1 })
    .limit(limit)
    .toArray();
}

// ===========================================
// Index Setup
// ===========================================

export async function ensureResourcesIndexes(): Promise<void> {
  const faq = await getFaqCollection();
  const glossary = await getGlossaryCollection();
  const comparison = await getComparisonCollection();
  const expertQa = await getExpertQaCollection();
  const news = await getNewsCollection();
  const caseStudy = await getCaseStudyCollection();
  const industryBrief = await getIndustryBriefCollection();
  const coverage = await getQueryCoverageCollection();

  // FAQ indexes
  await faq.createIndex({ clientId: 1, faqId: 1 }, { unique: true });
  await faq.createIndex({ clientId: 1, status: 1, category: 1 });
  await faq.createIndex({ clientId: 1, tags: 1 });

  // Glossary indexes
  await glossary.createIndex({ clientId: 1, termId: 1 }, { unique: true });
  await glossary.createIndex({ clientId: 1, status: 1, term: 1 });
  await glossary.createIndex({ clientId: 1, tags: 1 });

  // Comparison indexes
  await comparison.createIndex({ clientId: 1, comparisonId: 1 }, { unique: true });
  await comparison.createIndex({ clientId: 1, status: 1 });
  await comparison.createIndex({ clientId: 1, tags: 1 });

  // Expert Q&A indexes
  await expertQa.createIndex({ clientId: 1, qaId: 1 }, { unique: true });
  await expertQa.createIndex({ clientId: 1, status: 1 });
  await expertQa.createIndex({ clientId: 1, tags: 1 });

  // News indexes
  await news.createIndex({ clientId: 1, newsId: 1 }, { unique: true });
  await news.createIndex({ clientId: 1, status: 1, 'source.publishedAt': -1 });
  await news.createIndex({ clientId: 1, tags: 1 });

  // Case study indexes
  await caseStudy.createIndex({ clientId: 1, caseStudyId: 1 }, { unique: true });
  await caseStudy.createIndex({ clientId: 1, status: 1 });
  await caseStudy.createIndex({ clientId: 1, tags: 1 });

  // Industry brief indexes
  await industryBrief.createIndex({ clientId: 1, briefId: 1 }, { unique: true });
  await industryBrief.createIndex({ clientId: 1, status: 1 });
  await industryBrief.createIndex({ clientId: 1, tags: 1 });

  // Video indexes
  const video = await getVideoCollection();
  await video.createIndex({ clientId: 1, videoId: 1 }, { unique: true });
  await video.createIndex({ clientId: 1, status: 1 });
  await video.createIndex({ clientId: 1, tags: 1 });

  // Tool indexes
  const tool = await getToolCollection();
  await tool.createIndex({ clientId: 1, toolId: 1 }, { unique: true });
  await tool.createIndex({ clientId: 1, status: 1 });
  await tool.createIndex({ clientId: 1, toolType: 1, status: 1 });
  await tool.createIndex({ clientId: 1, tags: 1 });

  // Infographic indexes
  const infographic = await getInfographicCollection();
  await infographic.createIndex({ clientId: 1, infographicId: 1 }, { unique: true });
  await infographic.createIndex({ clientId: 1, status: 1 });
  await infographic.createIndex({ clientId: 1, tags: 1 });

  // Query coverage indexes
  await coverage.createIndex({ clientId: 1, queryNormalized: 1 }, { unique: true });
  await coverage.createIndex({ clientId: 1, clusterName: 1, coverageScore: 1 });

  console.log('[Resources DB] Indexes created successfully');
}
