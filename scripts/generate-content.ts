/**
 * Kernel-driven content generation script.
 * Reads TSC kernel data and uses OpenAI to generate content for all 10 types.
 * Uses pure fetch (no SDK) per project constraint.
 *
 * Usage: npm run generate-content
 * Requires: OPENAI_API_KEY and MONGODB_URI in .env.local
 */

import * as fs from 'fs';
import * as path from 'path';

// Import DB functions
import {
  createFaq, getFaqById,
  createGlossaryTerm, getGlossaryTermById,
  createComparison, getComparisonById,
  createExpertQa, getExpertQaById,
  createNewsItem, getNewsItemById,
  createCaseStudy, getCaseStudyById,
  createIndustryBrief, getIndustryBriefById,
  createVideo, getVideoById,
  createTool, getToolById,
} from '../lib/resources-db';
import { createBlogPost, getBlogPostBySlug } from '../lib/content-db';

// Import prompt generators
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
} from '../lib/pipeline/content-prompts';

// ===================================================
// OpenAI API (pure fetch)
// ===================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ===================================================
// Forbidden term check
// ===================================================

const FORBIDDEN = ['thought leader', 'synergy', 'pioneers of aeo'];

function checkForbiddenTerms(text: string): string[] {
  const lower = text.toLowerCase();
  return FORBIDDEN.filter(term => lower.includes(term));
}

// ===================================================
// Load kernel
// ===================================================

const kernelPath = path.join(process.cwd(), 'lib/kernel/generated/tsc.json');
const kernel = JSON.parse(fs.readFileSync(kernelPath, 'utf-8'));

// Expert rotation
const EXPERTS = kernel.leaders as Array<{ name: string; title: string; shortBio: string }>;
let expertIndex = 0;
function nextExpert() {
  const expert = EXPERTS[expertIndex % EXPERTS.length];
  expertIndex++;
  return expert;
}

// ===================================================
// Generation helpers
// ===================================================

let generated = 0;
let skipped = 0;
let failed = 0;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================================================
// Content Generation Plan
// ===================================================

async function generateFaqs() {
  console.log('\n--- Generating FAQs from ICP pain points ---');
  const painPoints = kernel.icp.primary.painPoints as string[];

  for (const painPoint of painPoints) {
    const faqId = painPoint
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

    const existing = await getFaqById(faqId);
    if (existing) {
      console.log(`  SKIP: ${faqId} (already exists)`);
      skipped++;
      continue;
    }

    const context = `
Pain point: ${painPoint}
ICP: ${kernel.icp.primary.label}
Success metrics: ${kernel.icp.primary.successMetrics.join(', ')}
Brand promise: ${kernel.brand.brandPromise}`;

    const question = `How can B2B CMOs address: ${painPoint}?`;
    const { system, user } = getFaqPrompts(question, context);

    try {
      console.log(`  Generating FAQ: ${faqId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      const violations = checkForbiddenTerms(data.answer || '');
      if (violations.length > 0) {
        console.log(`  WARNING: Forbidden terms found: ${violations.join(', ')} — skipping`);
        failed++;
        continue;
      }

      await createFaq({
        faqId: data.faqId || faqId,
        question: data.question || question,
        answer: data.answer,
        category: data.category || 'strategy',
        tags: data.tags || [],
        relatedFaqs: [],
        clusterName: 'Build Growth Engine',
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.faqId || faqId}`);
      generated++;
      await delay(1500);
    } catch (err) {
      console.log(`  FAIL: ${faqId} — ${err}`);
      failed++;
    }
  }
}

async function generateGlossary() {
  console.log('\n--- Generating Glossary from offerings ---');
  const terms: string[] = [];
  for (const cat of kernel.offerings) {
    for (const svc of cat.services) {
      terms.push(svc.name);
    }
  }
  // Add proprietary terms
  terms.push('GTM Kernel', 'Answer Engine Optimization');

  // Filter out Fractional CMO — user directive
  const filteredTerms = terms.filter(t => !t.toLowerCase().includes('fractional cmo'));

  for (const term of filteredTerms) {
    const termId = term
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await getGlossaryTermById(termId);
    if (existing) {
      console.log(`  SKIP: ${termId} (already exists)`);
      skipped++;
      continue;
    }

    const svc = kernel.offerings
      .flatMap((c: { services: Array<{ name: string; description: string }> }) => c.services)
      .find((s: { name: string }) => s.name === term);

    const context = svc
      ? `Service: ${svc.name}\nDescription: ${svc.description}\nDelivery: ${svc.deliveryModel}\nScope: ${svc.typicalScope}`
      : `Proprietary term from The Starr Conspiracy's methodology`;

    const { system, user } = getGlossaryPrompts(term, context);

    try {
      console.log(`  Generating glossary: ${termId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      await createGlossaryTerm({
        termId: data.termId || termId,
        term: data.term || term,
        acronym: data.acronym || undefined,
        shortDefinition: data.shortDefinition,
        fullDefinition: data.fullDefinition,
        examples: data.examples || [],
        synonyms: data.synonyms || [],
        relatedTerms: data.relatedTerms || [],
        category: data.category || 'marketing',
        tags: data.tags || [],
        clusterName: 'Build Growth Engine',
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.termId || termId}`);
      generated++;
      await delay(1500);
    } catch (err) {
      console.log(`  FAIL: ${termId} — ${err}`);
      failed++;
    }
  }
}

async function generateBlogs() {
  console.log('\n--- Generating Blog posts from JTBD + values ---');

  const topics: Array<{ topic: string; context: string; author: string }> = [];

  // From JTBD clusters
  for (const job of kernel.jtbd) {
    topics.push({
      topic: `Building a ${job.jobName.toLowerCase()}: what B2B companies get wrong`,
      context: `JTBD: ${job.jobName}\nStarting state: ${job.startingState}\nDesired state: ${job.desiredState}\nObstacles: ${job.obstacles.join(', ')}\nHiring criteria: ${job.hiringCriteria.join(', ')}`,
      author: nextExpert().name,
    });
    topics.push({
      topic: `The obstacles to ${job.jobName.toLowerCase()} — and how to overcome them`,
      context: `JTBD: ${job.jobName}\nObstacles: ${job.obstacles.join(', ')}\nDesired state: ${job.desiredState}`,
      author: nextExpert().name,
    });
  }

  // From brand values
  for (const val of kernel.brand.values) {
    topics.push({
      topic: `${val.value}: why ${val.definition.toLowerCase()}`,
      context: `Brand value: ${val.value}\nDefinition: ${val.definition}\nBrand promise: ${kernel.brand.brandPromise}\nVision: ${kernel.brand.purpose.vision}`,
      author: nextExpert().name,
    });
  }

  for (const item of topics) {
    const slug = item.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80);

    const existing = await getBlogPostBySlug(slug);
    if (existing) {
      console.log(`  SKIP: ${slug} (already exists)`);
      skipped++;
      continue;
    }

    const { system, user } = getBlogPrompts(item.topic, item.context);

    try {
      console.log(`  Generating blog: ${slug}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      const content = data.content || '';
      const violations = checkForbiddenTerms(content);
      if (violations.length > 0) {
        console.log(`  WARNING: Forbidden terms found: ${violations.join(', ')} — skipping`);
        failed++;
        continue;
      }

      await createBlogPost({
        slug: data.slug || slug,
        title: data.title || item.topic,
        description: data.description || '',
        content,
        date: new Date().toISOString(),
        author: item.author,
        tags: data.tags || [],
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.slug || slug}`);
      generated++;
      await delay(2000);
    } catch (err) {
      console.log(`  FAIL: ${slug} — ${err}`);
      failed++;
    }
  }
}

async function generateComparisons() {
  console.log('\n--- Generating Comparisons ---');

  const topics = [
    {
      topic: 'Agency vs. In-House Marketing Team: Total Cost of Ownership',
      context: `TSC value prop: Strategy + execution integrated\nCore claim: ${kernel.message.coreClaims[0].claim}\nNarrative: ${kernel.message.narrativeFrames[1].name} — from ${kernel.message.narrativeFrames[1].before} to ${kernel.message.narrativeFrames[1].after}`,
    },
    {
      topic: 'Brand Strategy vs. Demand Generation: Where Should B2B Companies Invest First?',
      context: `TSC POV: You need both, but sequencing matters\nBrand strategy: ${kernel.offerings[0].services[0].description}\nDemand gen: ${kernel.offerings[1].services[0].description}\nNarrative: ${kernel.message.narrativeFrames[0].name} — from ${kernel.message.narrativeFrames[0].before} to ${kernel.message.narrativeFrames[0].after}`,
    },
    {
      topic: 'Traditional SEO vs. Answer Engine Optimization (AEO)',
      context: `AEO service: ${kernel.offerings[5].services[2].description}\nPropriety term: Answer Engine Optimization\nCore claim: ${kernel.message.coreClaims[1].claim}`,
    },
  ];

  for (const item of topics) {
    const comparisonId = item.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

    const existing = await getComparisonById(comparisonId);
    if (existing) {
      console.log(`  SKIP: ${comparisonId} (already exists)`);
      skipped++;
      continue;
    }

    const { system, user } = getComparisonPrompts(item.topic, item.context);

    try {
      console.log(`  Generating comparison: ${comparisonId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      await createComparison({
        comparisonId: data.comparisonId || comparisonId,
        title: data.title || item.topic,
        introduction: data.introduction || '',
        items: data.items || [],
        criteria: data.criteria || [],
        verdict: data.verdict || '',
        bestFor: data.bestFor || [],
        tags: data.tags || [],
        clusterName: 'Build Growth Engine',
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.comparisonId || comparisonId}`);
      generated++;
      await delay(2000);
    } catch (err) {
      console.log(`  FAIL: ${comparisonId} — ${err}`);
      failed++;
    }
  }
}

async function generateExpertQa() {
  console.log('\n--- Generating Expert Q&A from leaders x JTBD ---');

  const topics: Array<{ expert: typeof EXPERTS[0]; topic: string; context: string }> = [];

  for (let i = 0; i < kernel.jtbd.length; i++) {
    const job = kernel.jtbd[i];
    const expert1 = EXPERTS[i % EXPERTS.length];
    const expert2 = EXPERTS[(i + 1) % EXPERTS.length];

    topics.push({
      expert: expert1,
      topic: `${expert1.name} on ${job.jobName.toLowerCase()}: what most companies get wrong`,
      context: `JTBD: ${job.jobName}\nStarting: ${job.startingState}\nDesired: ${job.desiredState}\nObstacles: ${job.obstacles.join(', ')}\nExpert bio: ${expert1.shortBio}`,
    });
    topics.push({
      expert: expert2,
      topic: `${expert2.name}'s advice for CMOs trying to ${job.jobName.toLowerCase()}`,
      context: `JTBD: ${job.jobName}\nHiring criteria: ${job.hiringCriteria.join(', ')}\nExpert bio: ${expert2.shortBio}`,
    });
  }

  for (const item of topics) {
    const qaId = item.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

    const existing = await getExpertQaById(qaId);
    if (existing) {
      console.log(`  SKIP: ${qaId} (already exists)`);
      skipped++;
      continue;
    }

    const { system, user } = getExpertQaPrompts(item.expert, item.topic, item.context);

    try {
      console.log(`  Generating expert Q&A: ${qaId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      await createExpertQa({
        qaId: data.qaId || qaId,
        question: data.question || item.topic,
        answer: data.answer || '',
        expert: data.expert || { name: item.expert.name, title: item.expert.title, organization: 'The Starr Conspiracy' },
        quotableSnippets: data.quotableSnippets || [],
        tags: data.tags || [],
        clusterName: kernel.jtbd[Math.floor(topics.indexOf(item) / 2)]?.jobName,
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.qaId || qaId}`);
      generated++;
      await delay(1500);
    } catch (err) {
      console.log(`  FAIL: ${qaId} — ${err}`);
      failed++;
    }
  }
}

async function generateNews() {
  console.log('\n--- Generating News commentary from market forces ---');

  const topics = [
    {
      topic: 'AI is reshaping how B2B buyers research agencies — here\'s what it means for marketing leaders',
      context: `Market force: AI disruption of buyer behavior\nTSC POV: AI will transform B2B marketing, but only when grounded in fundamentals\nNarrative: ${kernel.message.narrativeFrames[0].name}`,
    },
    {
      topic: 'Economic uncertainty is forcing CMOs to prove ROI like never before',
      context: `Market force: Economic uncertainty\nPain point: ${kernel.icp.primary.painPoints[0]}\nPain point: ${kernel.icp.primary.painPoints[1]}`,
    },
    {
      topic: 'B2B companies are rethinking agency relationships — and demanding integrated strategy plus execution',
      context: `JTBD: Build Growth Engine\nCore claim: ${kernel.message.coreClaims[0].claim}\nPain points: ${kernel.icp.primary.painPoints.slice(0, 3).join(', ')}`,
    },
  ];

  for (const item of topics) {
    const newsId = item.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

    const existing = await getNewsItemById(newsId);
    if (existing) {
      console.log(`  SKIP: ${newsId} (already exists)`);
      skipped++;
      continue;
    }

    const { system, user } = getNewsPrompts(item.topic, item.context);

    try {
      console.log(`  Generating news: ${newsId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      await createNewsItem({
        newsId: data.newsId || newsId,
        headline: data.headline || item.topic,
        summary: data.summary || '',
        commentary: data.commentary || '',
        source: data.source || { name: 'TSC Analysis', url: '', publishedAt: new Date() },
        category: data.category || 'marketing',
        sentiment: data.sentiment || 'neutral',
        impact: data.impact || 'medium',
        tags: data.tags || [],
        status: 'published',
        origin: 'autonomous',
        autoPublished: true,
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.newsId || newsId}`);
      generated++;
      await delay(1500);
    } catch (err) {
      console.log(`  FAIL: ${newsId} — ${err}`);
      failed++;
    }
  }
}

async function generateCaseStudies() {
  console.log('\n--- Generating Case Studies from JTBD outcomes ---');

  for (const job of kernel.jtbd) {
    const caseStudyId = `illustrative-${job.jobName.toLowerCase().replace(/\s+/g, '-')}`;

    const existing = await getCaseStudyById(caseStudyId);
    if (existing) {
      console.log(`  SKIP: ${caseStudyId} (already exists)`);
      skipped++;
      continue;
    }

    const context = `JTBD: ${job.jobName}\nStarting: ${job.startingState}\nDesired: ${job.desiredState}\nObstacles: ${job.obstacles.join(', ')}\nHiring criteria: ${job.hiringCriteria.join(', ')}\nTSC services: ${kernel.offerings.flatMap((c: { services: Array<{ name: string }> }) => c.services.map((s: { name: string }) => s.name)).join(', ')}`;

    const { system, user } = getCaseStudyPrompts(`Illustrative case study: ${job.jobName}`, context);

    try {
      console.log(`  Generating case study: ${caseStudyId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      await createCaseStudy({
        caseStudyId: data.caseStudyId || caseStudyId,
        title: data.title || `${job.jobName}: A Case Study`,
        client: data.client || 'Illustrative Example',
        industry: data.industry || 'B2B Tech',
        challenge: data.challenge || '',
        approach: data.approach || '',
        results: data.results || '',
        metrics: data.metrics || [],
        testimonial: data.testimonial || undefined,
        tags: data.tags || [],
        clusterName: job.jobName,
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.caseStudyId || caseStudyId}`);
      generated++;
      await delay(2000);
    } catch (err) {
      console.log(`  FAIL: ${caseStudyId} — ${err}`);
      failed++;
    }
  }
}

async function generateIndustryBriefs() {
  console.log('\n--- Generating Industry Briefs from context triggers ---');

  const triggers = [
    'Post-funding growth mandate: What B2B companies should do in the first 90 days',
    'Growth plateau in B2B tech: Why marketing stalls and how to restart the engine',
    'The AI transformation imperative: A 2026 benchmark for B2B marketing teams',
  ];

  for (let i = 0; i < triggers.length; i++) {
    const topic = triggers[i];
    const briefId = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

    const existing = await getIndustryBriefById(briefId);
    if (existing) {
      console.log(`  SKIP: ${briefId} (already exists)`);
      skipped++;
      continue;
    }

    const context = `JTBD clusters: ${kernel.jtbd.map((j: { jobName: string }) => j.jobName).join(', ')}\nICP industries: ${kernel.icp.companyProfile.industries.join(', ')}\nPain points: ${kernel.icp.primary.painPoints.slice(0, 5).join(', ')}`;

    const { system, user } = getIndustryBriefPrompts(topic, context);

    try {
      console.log(`  Generating industry brief: ${briefId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      await createIndustryBrief({
        briefId: data.briefId || briefId,
        title: data.title || topic,
        summary: data.summary || '',
        content: data.content || '',
        industry: data.industry || 'B2B Technology',
        keyFindings: data.keyFindings || [],
        recommendations: data.recommendations || [],
        author: nextExpert().name,
        tags: data.tags || [],
        clusterName: kernel.jtbd[i % kernel.jtbd.length].jobName,
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.briefId || briefId}`);
      generated++;
      await delay(2000);
    } catch (err) {
      console.log(`  FAIL: ${briefId} — ${err}`);
      failed++;
    }
  }
}

async function generateVideos() {
  console.log('\n--- Generating Video descriptions from JTBD ---');

  for (const job of kernel.jtbd) {
    const videoId = `${job.jobName.toLowerCase().replace(/\s+/g, '-')}-overview`;

    const existing = await getVideoById(videoId);
    if (existing) {
      console.log(`  SKIP: ${videoId} (already exists)`);
      skipped++;
      continue;
    }

    const context = `JTBD: ${job.jobName}\nStarting: ${job.startingState}\nDesired: ${job.desiredState}\nObstacles: ${job.obstacles.join(', ')}\nBrand promise: ${kernel.brand.brandPromise}`;

    const { system, user } = getVideoPrompts(`${job.jobName}: What every B2B CMO needs to know`, context);

    try {
      console.log(`  Generating video: ${videoId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      await createVideo({
        videoId: data.videoId || videoId,
        title: data.title || `${job.jobName} Overview`,
        description: data.description || '',
        duration: data.duration || '10:00',
        answerCapsule: data.answerCapsule || undefined,
        speaker: data.speaker || nextExpert().name,
        tags: data.tags || [],
        clusterName: job.jobName,
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.videoId || videoId}`);
      generated++;
      await delay(1500);
    } catch (err) {
      console.log(`  FAIL: ${videoId} — ${err}`);
      failed++;
    }
  }
}

async function generateTools() {
  console.log('\n--- Generating Tools from JTBD ---');

  const toolTopics = [
    { job: kernel.jtbd[0], type: 'checklist' as const, topic: 'Growth Engine Readiness Checklist' },
    { job: kernel.jtbd[1], type: 'assessment' as const, topic: 'AI Marketing Maturity Assessment' },
  ];

  for (const item of toolTopics) {
    const toolId = item.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await getToolById(toolId);
    if (existing) {
      console.log(`  SKIP: ${toolId} (already exists)`);
      skipped++;
      continue;
    }

    const context = `JTBD: ${item.job.jobName}\nStarting: ${item.job.startingState}\nDesired: ${item.job.desiredState}\nObstacles: ${item.job.obstacles.join(', ')}\nHiring criteria: ${item.job.hiringCriteria.join(', ')}\nICP pain points: ${kernel.icp.primary.painPoints.slice(0, 5).join(', ')}`;

    const { system, user } = getToolPrompts(item.topic, item.type, context);

    try {
      console.log(`  Generating tool: ${toolId}...`);
      const raw = await callOpenAI(system, user);
      const data = JSON.parse(raw);

      await createTool({
        toolId: data.toolId || toolId,
        title: data.title || item.topic,
        description: data.description || '',
        toolType: item.type,
        checklistItems: data.checklistItems || undefined,
        assessmentQuestions: data.assessmentQuestions || undefined,
        assessmentResults: data.assessmentResults || undefined,
        downloadable: false,
        tags: data.tags || [],
        clusterName: item.job.jobName,
        status: 'published',
        origin: 'autonomous',
        publishedAt: new Date(),
      });
      console.log(`  OK: ${data.toolId || toolId}`);
      generated++;
      await delay(2000);
    } catch (err) {
      console.log(`  FAIL: ${toolId} — ${err}`);
      failed++;
    }
  }
}

// ===================================================
// Main
// ===================================================

async function main() {
  console.log('=== TSC Content Generation from GTM Kernel ===');
  console.log(`Kernel: ${kernel.brand.name.full} (${kernel.clientId})`);
  console.log(`JTBD clusters: ${kernel.jtbd.length}`);
  console.log(`Services: ${kernel.offerings.reduce((n: number, c: { services: unknown[] }) => n + c.services.length, 0)}`);
  console.log(`Leaders: ${kernel.leaders.length}`);
  console.log(`Pain points: ${kernel.icp.primary.painPoints.length}`);
  console.log('');

  // Generate in order: cheapest/fastest first
  await generateFaqs();
  await generateGlossary();
  await generateBlogs();
  await generateComparisons();
  await generateExpertQa();
  await generateNews();
  await generateCaseStudies();
  await generateIndustryBriefs();
  await generateVideos();
  await generateTools();

  console.log('\n=== Generation Complete ===');
  console.log(`Generated: ${generated}`);
  console.log(`Skipped (existing): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total attempted: ${generated + skipped + failed}`);

  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
