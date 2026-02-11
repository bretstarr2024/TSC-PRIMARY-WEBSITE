/**
 * Seed script: populates MongoDB with sample content for all types.
 * Uses the project's own DB layer — also validates the code.
 *
 * Usage: npx dotenv -e .env.local -- tsx scripts/seed-content.ts
 */

import { createBlogPost, ensureContentIndexes } from '../lib/content-db';
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
  ensureResourcesIndexes,
} from '../lib/resources-db';
import { closeConnection } from '../lib/mongodb';

async function seed() {
  console.log('[seed] Creating indexes...');
  await ensureContentIndexes();
  await ensureResourcesIndexes();
  console.log('[seed] Indexes created.');

  // =========================================
  // Blog Posts (3)
  // =========================================
  console.log('[seed] Seeding blog posts...');

  await createBlogPost({
    slug: 'why-b2b-companies-need-a-growth-engine-not-a-marketing-plan',
    title: 'Why B2B Companies Need a Growth Engine, Not a Marketing Plan',
    description: 'Marketing plans are static. Growth engines are self-sustaining. Here\'s why the distinction matters for B2B companies trying to scale.',
    content: `## The Problem with Marketing Plans\n\nMost B2B marketing plans share the same fatal flaw: they assume the world holds still while you execute. They're documents — static, linear, and outdated the moment they're approved.\n\nA growth engine is different. It's a system that compounds. Every piece of content, every campaign, every client interaction feeds back into the machine, making the next effort more effective.\n\n## What Makes a Growth Engine\n\nThree components separate a growth engine from a marketing plan:\n\n- **Feedback loops.** Data from campaigns informs content. Content performance informs targeting. Targeting results inform strategy. The system learns.\n- **Compounding assets.** Blog posts, research, case studies — content that continues to generate value long after the team has moved on to the next quarter.\n- **Integrated execution.** Brand, demand gen, and product marketing aren't silos. They're interconnected parts of the same machine.\n\n## Why This Matters Now\n\nAI is accelerating everything. Companies with growth engines are using AI to produce more content, analyze more data, and respond faster to market signals. Companies with marketing plans are using AI to make their static documents slightly more polished.\n\nThe gap between these two approaches widens every month.\n\n## Building Your Engine\n\nStart by auditing what you have. How many of your marketing activities create compounding value? How much of your data actually feeds back into decision-making?\n\nThe answers will tell you whether you have an engine or just a plan.`,
    date: '2026-02-01',
    author: 'Bret Starr',
    tags: ['growth-strategy', 'b2b-marketing', 'ai-transformation'],
    origin: 'manual',
    clusterName: 'Build Growth Engine',
    status: 'published',
    publishedAt: new Date('2026-02-01'),
  });

  await createBlogPost({
    slug: 'ai-native-marketing-what-it-actually-means',
    title: 'AI-Native Marketing: What It Actually Means',
    description: 'Everyone claims to use AI. Few have rebuilt their operations around it. Here\'s what truly AI-native marketing looks like.',
    content: `## Beyond the Buzzword\n\nEvery agency now claims to be "AI-powered." Most have bolted ChatGPT onto their existing processes and called it innovation. That's AI-assisted, not AI-native.\n\nAI-native marketing means the entire operation — from strategy through execution through measurement — is designed with AI as a core capability, not an add-on.\n\n## The Three Levels of AI in Marketing\n\n**Level 1: AI-Assisted.** Human-led processes with AI tools for specific tasks. Writing drafts, generating images, analyzing spreadsheets. This is where 90% of agencies operate.\n\n**Level 2: AI-Integrated.** AI embedded in workflows and decision-making. Automated content pipelines, predictive targeting, real-time optimization. Getting warmer.\n\n**Level 3: AI-Native.** Operations designed from the ground up around AI capabilities. Self-expanding content engines, autonomous market intelligence, adaptive campaign systems. This is the frontier.\n\n## What Level 3 Looks Like\n\nAn AI-native marketing operation might include:\n\n- Content systems that generate, optimize, and distribute without manual intervention\n- Market intelligence that monitors competitive signals and automatically adjusts positioning\n- Campaign optimization that runs continuous experiments across channels\n- Knowledge systems that compound — every insight makes the next one better\n\n## The Uncomfortable Truth\n\nMost companies aren't ready for Level 3. And that's fine. The mistake isn't being at Level 1 — it's staying there while pretending you're at Level 3.`,
    date: '2026-02-05',
    author: 'Bret Starr',
    tags: ['ai-transformation', 'marketing-strategy', 'ai-native'],
    origin: 'manual',
    clusterName: 'Navigate AI Transformation',
    status: 'published',
    publishedAt: new Date('2026-02-05'),
  });

  await createBlogPost({
    slug: 'the-fractional-cmo-question-when-it-makes-sense',
    title: 'The Fractional CMO Question: When It Makes Sense',
    description: 'Not every company needs a full-time CMO. But every company needs strategic marketing leadership. Here\'s how to think about the decision.',
    content: `## The Leadership Gap\n\nHere's a scenario we see constantly: a B2B company has grown to $10-50M in revenue. Their marketing team is executing tactics — running campaigns, managing social, producing content. But nobody is setting strategic direction.\n\nThe CEO knows they need marketing leadership. The question is what kind.\n\n## Three Options\n\n**Full-time CMO.** Base salary $200-400K plus equity. Makes sense when you have a large marketing team, complex go-to-market, and need daily strategic involvement.\n\n**Fractional CMO.** $10-25K per month for senior strategic leadership without the full-time commitment. Makes sense when you need strategy and direction but not daily operational management.\n\n**Agency partnership.** Strategic guidance plus execution capacity. Makes sense when you need both the thinking and the doing, and your internal team is lean.\n\n## When Fractional Works\n\n- You're between $5M and $50M in revenue\n- You have marketers who can execute but need strategic direction\n- Your go-to-market is evolving (new segments, new products, repositioning)\n- You can't justify or attract a $300K+ CMO hire\n\n## When It Doesn't\n\n- You need someone managing a team of 15+ every day\n- Your marketing challenges are primarily operational, not strategic\n- You're pre-product-market-fit and need a full-time builder\n\n## The Real Question\n\nThe choice isn't really about fractional vs. full-time. It's about what kind of strategic gap you're filling and how quickly you need it filled.`,
    date: '2026-02-08',
    author: 'JJ La Pata',
    tags: ['leadership', 'fractional-cmo', 'growth-strategy'],
    origin: 'manual',
    clusterName: 'Fill Leadership Gap',
    status: 'published',
    publishedAt: new Date('2026-02-08'),
  });

  // =========================================
  // FAQ Items (3)
  // =========================================
  console.log('[seed] Seeding FAQ items...');

  await createFaq({
    faqId: 'what-is-a-gtm-strategy',
    question: 'What is a go-to-market (GTM) strategy and why does it matter for B2B?',
    answer: 'A go-to-market strategy is the plan for how a company brings its product or service to customers. For B2B companies, a strong GTM strategy aligns your messaging, targeting, sales process, and marketing channels around specific buyer personas and their jobs-to-be-done. Without it, you\'re spending money on tactics that don\'t connect to revenue. A well-built GTM strategy ensures every marketing dollar contributes to pipeline, not just impressions.',
    category: 'Strategy',
    tags: ['gtm-strategy', 'b2b-marketing', 'growth-strategy'],
    relatedFaqs: ['what-is-demand-generation', 'fractional-cmo-vs-consultant'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-15'),
  });

  await createFaq({
    faqId: 'what-is-demand-generation',
    question: 'How is demand generation different from lead generation?',
    answer: 'Lead generation focuses on capturing existing demand — getting people who already know they need something to raise their hand. Demand generation creates demand that didn\'t exist before. It builds awareness, educates the market, and shapes buyer perception so that when prospects are ready to buy, your company is the obvious choice. In B2B, demand generation typically involves thought leadership content, market research, strategic events, and sustained brand building. Lead generation is a subset of demand generation, not a replacement for it.',
    category: 'Strategy',
    tags: ['demand-generation', 'lead-generation', 'b2b-marketing'],
    relatedFaqs: ['what-is-a-gtm-strategy'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-15'),
  });

  await createFaq({
    faqId: 'fractional-cmo-vs-consultant',
    question: 'What is the difference between a fractional CMO and a marketing consultant?',
    answer: 'A fractional CMO operates as a part-time member of your executive team. They own the marketing strategy, make decisions, and are accountable for results — just like a full-time CMO, but without the full-time cost. A marketing consultant advises. They analyze, recommend, and present options. But the decision-making and accountability stays with you. The key question is whether you need someone to tell you what to do or someone to actually do it. Most growth-stage B2B companies need the latter.',
    category: 'Leadership',
    tags: ['fractional-cmo', 'leadership', 'marketing-consulting'],
    relatedFaqs: ['what-is-a-gtm-strategy'],
    clusterName: 'Fill Leadership Gap',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-15'),
  });

  // =========================================
  // Glossary Terms (3)
  // =========================================
  console.log('[seed] Seeding glossary terms...');

  await createGlossaryTerm({
    termId: 'answer-engine-optimization',
    term: 'Answer Engine Optimization (AEO)',
    acronym: 'AEO',
    shortDefinition: 'The practice of optimizing content to appear in AI-generated answers, not just traditional search results.',
    fullDefinition: 'Answer Engine Optimization (AEO) is an emerging discipline that focuses on making content discoverable and authoritative within AI-powered answer engines like ChatGPT, Perplexity, Google AI Overviews, and other large language model interfaces. Unlike traditional SEO, which optimizes for search engine result page rankings, AEO optimizes for direct answer selection — ensuring your content is the source that AI systems cite when generating responses to user queries. Key AEO factors include content structure, claim specificity, source authority, and topical coverage depth.',
    examples: ['Structuring FAQ content so AI assistants cite it directly', 'Building topical authority across a content cluster so AI models prefer your domain'],
    synonyms: ['AI Search Optimization', 'LLM Optimization'],
    relatedTerms: ['seo', 'content-strategy', 'topical-authority'],
    category: 'AI & Search',
    tags: ['aeo', 'ai-search', 'content-strategy'],
    clusterName: 'Navigate AI Transformation',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-20'),
  });

  await createGlossaryTerm({
    termId: 'go-to-market-strategy',
    term: 'Go-to-Market Strategy (GTM)',
    acronym: 'GTM',
    shortDefinition: 'A comprehensive plan for how a company delivers its product or service to customers, encompassing pricing, distribution, positioning, and sales strategy.',
    fullDefinition: 'A go-to-market (GTM) strategy is the comprehensive plan that defines how a company will reach its target audience and achieve competitive advantage. In B2B contexts, a GTM strategy typically includes: ideal customer profile (ICP) definition, buyer persona development, jobs-to-be-done analysis, competitive positioning, messaging framework, channel strategy, sales enablement, and success metrics. A strong GTM strategy connects every marketing and sales activity to specific business outcomes, ensuring resource allocation is driven by data rather than intuition.',
    examples: ['A SaaS company launching a new product vertical with a dedicated GTM playbook', 'A B2B services firm repositioning from generalist to specialist with a focused GTM approach'],
    synonyms: ['Market Strategy', 'Market Entry Strategy'],
    relatedTerms: ['icp', 'demand-generation', 'product-market-fit'],
    category: 'Strategy',
    tags: ['gtm-strategy', 'b2b-strategy', 'growth-strategy'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-20'),
  });

  await createGlossaryTerm({
    termId: 'demand-generation',
    term: 'Demand Generation',
    shortDefinition: 'Marketing activities focused on creating awareness and interest in a product or service before buyers enter an active purchasing cycle.',
    fullDefinition: 'Demand generation encompasses all marketing programs designed to drive awareness, interest, and engagement with a company\'s brand and solutions. Unlike lead generation (which captures existing demand), demand generation creates new demand by educating the market, building brand authority, and nurturing relationships before prospects have an identified need. In B2B, effective demand generation combines content marketing, thought leadership, events, research, brand campaigns, and account-based programs to build pipeline over time rather than relying solely on immediate conversion tactics.',
    examples: ['Publishing original research that reshapes industry thinking', 'Running an executive roundtable series that builds relationships with future buyers'],
    synonyms: ['Demand Gen', 'Demand Creation'],
    relatedTerms: ['lead-generation', 'content-marketing', 'brand-building'],
    category: 'Strategy',
    tags: ['demand-generation', 'b2b-marketing', 'pipeline'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-20'),
  });

  // =========================================
  // Comparisons (2)
  // =========================================
  console.log('[seed] Seeding comparisons...');

  await createComparison({
    comparisonId: 'seo-vs-aeo',
    title: 'SEO vs. AEO: What B2B Companies Need to Know',
    introduction: 'Traditional search engine optimization and answer engine optimization serve different purposes in the modern content landscape. Here\'s how they compare and why you probably need both.',
    items: [
      {
        name: 'SEO (Search Engine Optimization)',
        description: 'Optimizing content and websites to rank higher in traditional search engine results pages.',
        scores: { reach: 8, futureProof: 5, effort: 7, measurability: 9 },
        pros: ['Established methodology with proven ROI', 'Well-understood metrics and tools', 'Still drives majority of organic traffic'],
        cons: ['Declining click-through as AI answers emerge', 'Increasingly competitive for high-value terms', 'Algorithm dependency and volatility'],
      },
      {
        name: 'AEO (Answer Engine Optimization)',
        description: 'Optimizing content to be cited by AI answer engines like ChatGPT, Perplexity, and Google AI Overviews.',
        scores: { reach: 6, futureProof: 9, effort: 6, measurability: 4 },
        pros: ['Positions you for the future of search', 'Builds deep topical authority', 'Less competitive — most companies haven\'t started'],
        cons: ['Measurement tools still emerging', 'Smaller current audience than traditional search', 'Rapidly evolving best practices'],
      },
    ],
    criteria: [
      { name: 'Reach', description: 'Current ability to reach target audiences at scale', weight: 0.25 },
      { name: 'Future-Proof', description: 'Likelihood of continued relevance as search evolves', weight: 0.35 },
      { name: 'Effort', description: 'Resources required for meaningful results', weight: 0.2 },
      { name: 'Measurability', description: 'Ability to track and attribute results', weight: 0.2 },
    ],
    verdict: 'SEO remains essential for current traffic, but AEO is where the puck is heading. B2B companies should invest in SEO fundamentals while building AEO capabilities — the content strategies overlap significantly. Companies that wait to start AEO until it\'s mainstream will find themselves years behind.',
    bestFor: [
      { useCase: 'Immediate traffic growth', recommendation: 'SEO — it still drives the most organic traffic today' },
      { useCase: 'Long-term competitive advantage', recommendation: 'AEO — early movers are building moats right now' },
      { useCase: 'Comprehensive content strategy', recommendation: 'Both — well-structured content serves both channels' },
    ],
    tags: ['seo', 'aeo', 'content-strategy', 'ai-search'],
    clusterName: 'Navigate AI Transformation',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-25'),
  });

  await createComparison({
    comparisonId: 'in-house-vs-agency-vs-fractional',
    title: 'In-House Team vs. Agency vs. Fractional CMO: Which Is Right?',
    introduction: 'Every growing B2B company faces this question: build an internal marketing team, hire an agency, or bring in fractional leadership? The right answer depends on your stage, budget, and what kind of marketing gap you\'re filling.',
    items: [
      {
        name: 'In-House Marketing Team',
        description: 'Full-time employees dedicated to your company\'s marketing efforts.',
        scores: { control: 9, costEfficiency: 4, expertise: 5, scalability: 6 },
        pros: ['Full alignment with company culture and goals', 'Deep product and market knowledge over time', 'Available full-time for daily needs'],
        cons: ['High fixed costs (salaries, benefits, tools)', 'Hard to hire across all needed specialties', 'Training and management overhead'],
      },
      {
        name: 'Agency Partnership',
        description: 'External firm providing strategic guidance and execution across marketing disciplines.',
        scores: { control: 5, costEfficiency: 7, expertise: 9, scalability: 8 },
        pros: ['Access to diverse specialists and capabilities', 'Cross-industry insights and best practices', 'Scalable — ramp up or down as needed'],
        cons: ['Less embedded in daily operations', 'Requires clear communication and expectations', 'Agency priorities may differ from yours'],
      },
      {
        name: 'Fractional CMO',
        description: 'Part-time senior marketing executive providing strategic leadership.',
        scores: { control: 7, costEfficiency: 8, expertise: 8, scalability: 4 },
        pros: ['C-suite strategy at a fraction of full-time cost', 'Focused on outcomes, not hours', 'Bridges the gap between execution team and board'],
        cons: ['Limited hours mean limited operational involvement', 'Success depends on having a team to execute', 'Finding the right fit is challenging'],
      },
    ],
    criteria: [
      { name: 'Control', description: 'Direct oversight and integration with daily operations', weight: 0.2 },
      { name: 'Cost Efficiency', description: 'Value relative to investment', weight: 0.3 },
      { name: 'Expertise', description: 'Access to specialized knowledge and experience', weight: 0.3 },
      { name: 'Scalability', description: 'Ability to grow or shrink with business needs', weight: 0.2 },
    ],
    verdict: 'There\'s no universal answer. Early-stage companies ($1-10M) often start with agency partnerships. Growth-stage companies ($10-50M) benefit most from fractional CMO leadership combined with targeted agency support. Enterprise companies ($50M+) typically need in-house teams with agency augmentation. The worst choice is building a big in-house team without strategic direction — you end up with expensive tactical execution.',
    bestFor: [
      { useCase: 'Early-stage B2B ($1-10M)', recommendation: 'Agency — get strategy and execution without fixed overhead' },
      { useCase: 'Growth-stage B2B ($10-50M)', recommendation: 'Fractional CMO + agency — strategic leadership with scalable execution' },
      { useCase: 'Enterprise B2B ($50M+)', recommendation: 'In-house team + agency — dedicated team with specialized support' },
    ],
    tags: ['leadership', 'fractional-cmo', 'agency', 'marketing-team'],
    clusterName: 'Fill Leadership Gap',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-28'),
  });

  // =========================================
  // Expert Q&A (3 — one per leader)
  // =========================================
  console.log('[seed] Seeding expert Q&A...');

  await createExpertQa({
    qaId: 'bret-starr-on-growth-engines',
    question: 'What\'s the biggest mistake B2B companies make when trying to build a growth engine?',
    answer: 'They confuse activity with progress. I see it all the time — companies running campaigns, producing content, attending events, posting on social. They\'re busy. But when you ask what all that activity is building toward, you get vague answers about "brand awareness" or "thought— sorry, I mean expertise building."\n\nA real growth engine has intentional architecture. Every piece of content serves a purpose in a larger system. Every campaign connects to measurable pipeline outcomes. Every interaction compounds into something bigger than the sum of its parts.\n\nThe companies that get this right start by defining what "growth" actually means for their specific business. Not generic growth — their growth. Their ICP, their buyer journey, their competitive position. Then they build the engine to serve that specific definition.\n\nThe ones that struggle try to copy what worked for someone else without understanding why it worked.',
    expert: { name: 'Bret Starr', title: 'Founder & CEO', organization: 'The Starr Conspiracy' },
    quotableSnippets: [
      'They confuse activity with progress.',
      'A real growth engine has intentional architecture.',
      'Every piece of content serves a purpose in a larger system.',
    ],
    tags: ['growth-strategy', 'b2b-marketing', 'strategic-planning'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-22'),
  });

  await createExpertQa({
    qaId: 'racheal-bates-on-client-experience',
    question: 'How do you ensure agency engagements actually deliver strategic value, not just deliverables?',
    answer: 'It starts before the engagement begins. Most agency relationships fail because expectations weren\'t aligned upfront. The client thinks they\'re buying strategy. The agency thinks they\'re selling execution. Six months later, everyone\'s frustrated.\n\nWe solve this by being explicit about outcomes from day one. Not deliverables — outcomes. What will be different about your business in six months? What decisions will you be able to make that you can\'t make today? What capabilities will you have that you don\'t have now?\n\nThen we design the engagement backward from those outcomes. If the outcome requires a rebrand, we do a rebrand. If it requires a content engine, we build one. If it requires fixing your sales enablement, we fix it.\n\nThe deliverable isn\'t the point. The deliverable is evidence that the outcome happened.',
    expert: { name: 'Racheal Bates', title: 'Chief Experience Officer', organization: 'The Starr Conspiracy' },
    quotableSnippets: [
      'Most agency relationships fail because expectations weren\'t aligned upfront.',
      'Not deliverables — outcomes.',
      'The deliverable isn\'t the point. The deliverable is evidence that the outcome happened.',
    ],
    tags: ['client-experience', 'agency', 'engagement-strategy'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-22'),
  });

  await createExpertQa({
    qaId: 'jj-lapata-on-demand-gen',
    question: 'How should B2B companies think about demand generation in an AI-driven market?',
    answer: 'The fundamentals haven\'t changed — you still need to reach the right people with the right message at the right time. What\'s changed is the speed, the channels, and the sophistication of what "right" means.\n\nAI is making it possible to be more precise in targeting, more personalized in messaging, and more responsive in execution. But it\'s also making it easier for everyone else to do the same thing. So the advantage doesn\'t come from using AI — it comes from using AI in service of a differentiated strategy.\n\nHere\'s what I tell our clients: Don\'t ask "How do we use AI for demand gen?" Ask "What demand generation strategy would be impossible without AI?" That\'s where the real opportunities are.\n\nFor example, building a content corpus that automatically identifies coverage gaps and generates content to fill them. Or running continuous multivariate experiments across channels without human bottlenecks. Or scoring and routing leads in real-time based on behavioral signals that would take a human team weeks to analyze.\n\nThe companies winning at demand gen in 2026 aren\'t just using AI tools. They\'re building AI-native demand systems.',
    expert: { name: 'JJ La Pata', title: 'Chief Strategy Officer', organization: 'The Starr Conspiracy' },
    quotableSnippets: [
      'The advantage doesn\'t come from using AI — it comes from using AI in service of a differentiated strategy.',
      'Don\'t ask "How do we use AI for demand gen?" Ask "What demand generation strategy would be impossible without AI?"',
      'They\'re building AI-native demand systems.',
    ],
    tags: ['demand-generation', 'ai-transformation', 'b2b-strategy'],
    clusterName: 'Navigate AI Transformation',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-22'),
  });

  // =========================================
  // News Items (2)
  // =========================================
  console.log('[seed] Seeding news items...');

  await createNewsItem({
    newsId: 'google-ai-overviews-expansion-2026',
    headline: 'Google Expands AI Overviews to 40+ Countries, Reshaping B2B Content Strategy',
    summary: 'Google\'s AI Overviews feature, which summarizes search results using generative AI, has expanded to more than 40 countries and now appears in an estimated 30% of B2B-related queries.',
    commentary: 'This expansion confirms what we\'ve been saying: B2B companies that haven\'t started optimizing for AI-generated answers are already behind. The companies being cited in AI Overviews built deep topical authority and structured their content for machine readability months or years ago. The window for early-mover advantage is closing fast. If your content strategy is still purely SEO-focused, it\'s time to integrate AEO principles — specifically structured data, comprehensive topic coverage, and clear claim statements that AI systems can extract and cite.',
    source: {
      name: 'Search Engine Land',
      url: 'https://searchengineland.com',
      publishedAt: new Date('2026-01-20'),
    },
    category: 'ai',
    sentiment: 'neutral',
    impact: 'high',
    tags: ['google', 'ai-overviews', 'aeo', 'content-strategy'],
    status: 'published',
    origin: 'manual',
    autoPublished: false,
    publishedAt: new Date('2026-01-21'),
  });

  await createNewsItem({
    newsId: 'hrtech-ai-marketing-spend-report',
    headline: 'HRTech Companies Increasing AI Marketing Spend by 45% in 2026',
    summary: 'A new industry report shows HRTech companies are dramatically increasing investment in AI-powered marketing tools and strategies, with average spending up 45% year-over-year.',
    commentary: 'This tracks with what we\'re seeing across our HRTech clients. The smart ones aren\'t just buying AI tools — they\'re fundamentally rethinking how marketing operates. The biggest spend increases are in content automation, predictive analytics for demand generation, and AI-powered ABM platforms. But spending more doesn\'t automatically mean spending better. The companies getting real ROI from this investment are the ones who built strategic foundations first — clear ICPs, differentiated positioning, and measurable pipeline goals — then applied AI to accelerate execution against that foundation. The ones struggling spent on AI tools before they had a strategy for the tools to execute.',
    source: {
      name: 'HR Executive',
      url: 'https://hrexecutive.com',
      publishedAt: new Date('2026-02-03'),
    },
    category: 'industry',
    sentiment: 'positive',
    impact: 'medium',
    tags: ['hrtech', 'ai-spend', 'marketing-investment', 'industry-trends'],
    status: 'published',
    origin: 'manual',
    autoPublished: false,
    publishedAt: new Date('2026-02-04'),
  });

  // =========================================
  // Case Studies (2)
  // =========================================
  console.log('[seed] Seeding case studies...');

  await createCaseStudy({
    caseStudyId: 'saas-growth-engine-buildout',
    title: 'Building a Growth Engine for a Mid-Market SaaS Company',
    client: 'A mid-market B2B SaaS company in the employee engagement space',
    industry: 'HRTech / SaaS',
    challenge: 'The company had plateaued at $15M ARR after rapid early growth. Their marketing was a collection of disconnected tactics — paid campaigns, occasional blog posts, trade shows, and a sales team running their own outreach. There was no cohesive strategy connecting these activities to pipeline, and the CEO was frustrated by the inability to predict or scale growth.',
    approach: 'We started with a complete go-to-market audit, mapping every marketing activity to its pipeline impact (or lack thereof). We then defined their ICP with precision — not just industry and company size, but specific buyer personas, their jobs-to-be-done, and the triggers that move them from status quo to active buying. From there, we built a content engine targeting their three JTBD clusters, launched an account-based program focused on their top 200 target accounts, and redesigned their lead scoring to reflect actual buying signals rather than vanity metrics.',
    results: 'Over 12 months, the compounding content engine produced 150+ assets across blogs, research briefs, and expert Q&A. Pipeline from marketing-sourced leads increased 180%. The sales team reported significantly higher quality conversations because prospects were arriving pre-educated by the content. Most importantly, growth became predictable — the engine produced consistent results month over month rather than the boom-bust pattern of campaign-driven marketing.',
    metrics: [
      { label: 'Pipeline Growth', value: '+180%' },
      { label: 'Content Assets Created', value: '150+' },
      { label: 'Marketing-Sourced Revenue', value: '+125%' },
      { label: 'Time to Predictable Pipeline', value: '6 months' },
    ],
    testimonial: {
      quote: 'For the first time, I can actually forecast what marketing will deliver next quarter. That confidence changes how we invest.',
      attribution: 'CEO, Mid-Market SaaS Company',
    },
    tags: ['saas', 'growth-engine', 'hrtech', 'content-strategy'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-18'),
  });

  await createCaseStudy({
    caseStudyId: 'hrtech-repositioning-engagement',
    title: 'Repositioning an HRTech Company for the AI Era',
    client: 'An established HRTech platform serving enterprise HR departments',
    industry: 'HRTech',
    challenge: 'The company had been a market leader in their category for a decade, but the narrative was shifting. New AI-native competitors were positioning themselves as the future, and this client\'s brand was increasingly perceived as "legacy" despite having integrated AI capabilities for three years. Sales cycles were lengthening, and they were being excluded from consideration sets they used to dominate.',
    approach: 'We conducted a comprehensive brand audit including analyst interviews, customer perception research, and competitive positioning analysis. The core finding: their AI capabilities were real but invisible. Their messaging, website, and sales materials still led with pre-AI value propositions. We developed a repositioning strategy that didn\'t abandon their heritage but reframed it as a strength — deep domain expertise combined with modern AI capabilities. We rebuilt their narrative framework, redesigned their digital presence, created an AI-focused content program, and equipped their sales team with new competitive battle cards.',
    results: 'Within six months, analyst perception shifted measurably — two major analysts upgraded their position in competitive rankings. Pipeline velocity improved as sales cycles shortened by an average of 3 weeks. Their content program, focused on practical AI applications in HR rather than hype, became a go-to resource that analysts and buyers referenced regularly. They moved from being perceived as "legacy trying to catch up" to "experienced leader with AI-native capabilities."',
    metrics: [
      { label: 'Sales Cycle Reduction', value: '-3 weeks avg' },
      { label: 'Analyst Ranking Improvement', value: '+2 positions' },
      { label: 'Brand Perception (AI-Capable)', value: '32% → 78%' },
      { label: 'Content Engagement', value: '+210%' },
    ],
    tags: ['hrtech', 'repositioning', 'ai-transformation', 'brand-strategy'],
    clusterName: 'Navigate AI Transformation',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-02-01'),
  });

  // =========================================
  // Industry Briefs (2)
  // =========================================
  console.log('[seed] Seeding industry briefs...');

  await createIndustryBrief({
    briefId: 'ai-in-b2b-marketing-2026-benchmark',
    title: 'AI in B2B Marketing: 2026 Benchmark Report',
    summary: 'Where B2B marketers actually stand with AI adoption — based on data, not hype.',
    content: `## Executive Summary\n\nAI in B2B marketing has moved from experimental to operational, but adoption is uneven. Our analysis of 200+ B2B companies reveals a widening gap between AI-native operations and AI-assisted bolt-ons.\n\n## Key Findings\n\n### Adoption is Broad but Shallow\n- 87% of B2B marketing teams use AI tools in some capacity\n- Only 12% have what we'd classify as "AI-native" marketing operations\n- The remaining 75% are at Level 1 (AI-assisted) — using tools for individual tasks without systemic integration\n\n### Content Generation Leads, Strategy Lags\n- 73% use AI for content drafting\n- 45% use AI for data analysis and reporting\n- 28% use AI for campaign optimization\n- Only 9% use AI for strategic decision-making\n\n### ROI Varies Dramatically\n- AI-native operations report 3.2x higher marketing ROI than non-AI operations\n- AI-assisted operations report 1.4x higher ROI\n- The difference? AI-native companies redesigned processes around AI capabilities. AI-assisted companies added AI to existing processes.\n\n## Recommendations\n\n1. **Audit your AI maturity honestly.** Most companies overestimate their AI sophistication by at least one level.\n2. **Invest in integration, not tools.** The bottleneck isn't technology — it's connecting AI capabilities to strategic workflows.\n3. **Build compounding systems.** The highest-ROI AI investments are systems that improve over time, not one-off tool deployments.`,
    industry: 'B2B Marketing',
    keyFindings: [
      '87% of B2B teams use AI tools, but only 12% are truly AI-native',
      'AI-native operations report 3.2x higher marketing ROI',
      'Content generation is the top use case (73%), but strategic AI use is rare (9%)',
      'The ROI gap comes from system design, not tool selection',
    ],
    recommendations: [
      'Honestly assess your current AI maturity level',
      'Prioritize workflow integration over new tool adoption',
      'Build systems that compound — every insight should make the next one better',
      'Start with one high-impact area rather than spreading AI across everything',
    ],
    author: 'Bret Starr',
    tags: ['ai-transformation', 'b2b-marketing', 'benchmark', 'research'],
    clusterName: 'Navigate AI Transformation',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-30'),
  });

  await createIndustryBrief({
    briefId: 'hrtech-buyer-behavior-2026',
    title: 'HRTech Buyer Behavior: How Purchase Decisions Are Changing in 2026',
    summary: 'Enterprise HR buyers are making decisions differently than even two years ago. Here\'s what the data shows.',
    content: `## Executive Summary\n\nThe HRTech buying process has fundamentally shifted. Buyers are more informed, more skeptical, and more likely to involve cross-functional stakeholders than ever before. Understanding these shifts is critical for HRTech companies trying to build pipeline.\n\n## Key Findings\n\n### The Research Phase Has Expanded\n- Average HRTech evaluation now involves 7.2 stakeholders (up from 4.8 in 2024)\n- Buyers consume an average of 13 content pieces before engaging with sales\n- 62% of the buying journey is complete before first sales contact\n\n### Trust Sources Have Shifted\n- Peer recommendations remain #1 (89% weight heavily)\n- Independent analyst reports gained ground (67%, up from 52%)\n- Vendor content credibility is dropping (41%, down from 58%)\n- AI-generated summaries are emerging as a new research channel (34% report using AI to evaluate vendors)\n\n### AI Capability is Now Table Stakes\n- 78% of enterprise HR buyers require AI capabilities in new purchases\n- But only 23% can articulate what specific AI capabilities they need\n- This creates an opportunity for vendors who educate rather than just promote\n\n## Implications for HRTech Marketers\n\nThe data points to three strategic imperatives:\n\n1. **Invest in mid-funnel content.** Buyers are doing more research before talking to sales. If your content only serves top-of-funnel awareness and bottom-of-funnel demos, you're invisible during the critical evaluation phase.\n2. **Build for the committee.** With 7+ stakeholders involved, your content needs to address multiple perspectives — IT security concerns, finance ROI questions, HR operations workflows, and C-suite strategic vision.\n3. **Educate on AI, don't hype it.** Buyers want AI capabilities but can't define them. The vendor that helps them understand what AI can actually do for their specific use cases builds trust and shapes the evaluation criteria in their favor.`,
    industry: 'HRTech',
    keyFindings: [
      'Average HRTech evaluation involves 7.2 stakeholders (up from 4.8)',
      '62% of buying journey complete before first sales contact',
      'Vendor content credibility is declining while peer recommendations dominate',
      '78% require AI capabilities but only 23% can articulate what they need',
    ],
    recommendations: [
      'Invest heavily in mid-funnel evaluation content',
      'Create stakeholder-specific content paths (IT, Finance, HR Ops, C-suite)',
      'Lead with AI education rather than AI promotion',
      'Optimize for AI research channels — buyers are using AI to evaluate vendors',
    ],
    author: 'JJ La Pata',
    tags: ['hrtech', 'buyer-behavior', 'enterprise-sales', 'research'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-02-06'),
  });

  // =========================================
  // Videos (2)
  // =========================================
  console.log('[seed] Seeding videos...');

  await createVideo({
    videoId: 'growth-engine-fundamentals',
    title: 'Growth Engine Fundamentals: Why Marketing Plans Fail and Systems Win',
    description: 'Bret Starr breaks down why most B2B marketing plans collect dust — and what to build instead. This talk covers the three components of a self-sustaining growth engine: feedback loops, compounding assets, and integrated execution.',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    embedUrl: 'https://www.youtube.com/embed/example1',
    duration: '18:42',
    transcript: 'Every B2B company I talk to has a marketing plan. Beautiful slide decks, detailed timelines, impressive budgets. And about six months later, most of those plans are sitting in a folder somewhere, untouched. Here\'s why: marketing plans assume the world holds still while you execute them. Growth engines don\'t make that assumption. A growth engine is a system that compounds — every piece of content, every campaign, every client interaction feeds back into the machine. Let me walk you through the three components that separate an engine from a plan...',
    answerCapsule: 'A growth engine differs from a marketing plan because it compounds — feedback loops, compounding assets, and integrated execution create self-sustaining momentum rather than static tactical checklists.',
    speaker: 'Bret Starr',
    tags: ['growth-strategy', 'b2b-marketing', 'marketing-strategy'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-01-28'),
  });

  await createVideo({
    videoId: 'ai-native-marketing-reality-check',
    title: 'AI-Native Marketing: A Reality Check for B2B Leaders',
    description: 'JJ La Pata separates AI marketing hype from practical application. Learn the three levels of AI maturity in marketing operations and how to identify where your organization actually stands — not where you think you stand.',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    embedUrl: 'https://www.youtube.com/embed/example2',
    duration: '22:15',
    transcript: 'I want to start with an uncomfortable truth: most companies claiming to be AI-powered in their marketing are really just using ChatGPT to write blog posts. And that\'s fine — it\'s a start. But it\'s Level 1 out of 3, and calling it AI-native is like calling a calculator a computer. Let me walk you through what each level actually looks like, and more importantly, how to know which level you\'re really at...',
    answerCapsule: 'AI-native marketing has three maturity levels — assisted, integrated, and native — and most B2B companies overestimate their position by at least one level.',
    speaker: 'JJ La Pata',
    tags: ['ai-transformation', 'marketing-strategy', 'ai-native'],
    clusterName: 'Navigate AI Transformation',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-02-03'),
  });

  // =========================================
  // Tools (2 — one checklist, one assessment)
  // =========================================
  console.log('[seed] Seeding tools...');

  await createTool({
    toolId: 'growth-engine-readiness-checklist',
    title: 'Growth Engine Readiness Checklist',
    description: 'Assess whether your B2B marketing operation has the foundations in place to build a self-sustaining growth engine. This checklist covers strategy, content, data, and team readiness across 15 critical dimensions.',
    toolType: 'checklist',
    checklistItems: [
      { id: 'strat-1', text: 'Documented ICP with specific buyer personas and jobs-to-be-done', category: 'Strategy Foundation', description: 'Your ICP should be specific enough that your sales team can name real companies that fit.', order: 1 },
      { id: 'strat-2', text: 'Clear competitive positioning that differentiates from top 3 competitors', category: 'Strategy Foundation', description: 'If your positioning could apply to any competitor, it\'s not positioning.', order: 2 },
      { id: 'strat-3', text: 'Defined pipeline goals with marketing attribution model', category: 'Strategy Foundation', description: 'Multi-touch attribution is ideal, but even first-touch/last-touch is better than nothing.', order: 3 },
      { id: 'content-1', text: 'Content strategy mapped to buyer journey stages', category: 'Content Engine', description: 'Most companies over-invest in top-of-funnel and under-invest in mid-funnel evaluation content.', order: 4 },
      { id: 'content-2', text: 'Regular content production cadence (minimum weekly)', category: 'Content Engine', description: 'Consistency matters more than volume. One great piece per week beats five mediocre ones.', order: 5 },
      { id: 'content-3', text: 'Content performance tracking with clear success metrics', category: 'Content Engine', description: 'Track leading indicators (engagement, shares) and lagging indicators (pipeline influenced).', order: 6 },
      { id: 'content-4', text: 'SEO and AEO optimization process in place', category: 'Content Engine', description: 'Structure content for both traditional search engines and AI answer engines.', order: 7 },
      { id: 'data-1', text: 'CRM with clean, current data and regular hygiene process', category: 'Data & Infrastructure', description: 'Bad data in = bad decisions out. Schedule monthly data quality reviews.', order: 8 },
      { id: 'data-2', text: 'Marketing automation platform configured and actively used', category: 'Data & Infrastructure', description: 'An unused marketing automation platform is an expensive email tool.', order: 9 },
      { id: 'data-3', text: 'Lead scoring model based on behavioral signals', category: 'Data & Infrastructure', description: 'Score based on what prospects do (pages visited, content consumed), not just who they are.', order: 10 },
      { id: 'data-4', text: 'Dashboard connecting marketing activity to pipeline metrics', category: 'Data & Infrastructure', description: 'Your CEO should be able to see marketing\'s pipeline impact in under 60 seconds.', order: 11 },
      { id: 'team-1', text: 'Marketing team has strategic leadership (CMO, VP, or equivalent)', category: 'Team & Process', description: 'Execution without strategy is expensive. A fractional CMO can fill this gap cost-effectively.', order: 12 },
      { id: 'team-2', text: 'Cross-functional alignment between marketing and sales', category: 'Team & Process', description: 'Regular pipeline review meetings with shared metrics are the minimum.', order: 13 },
      { id: 'team-3', text: 'Documented marketing processes that don\'t depend on tribal knowledge', category: 'Team & Process', description: 'If a key team member left tomorrow, could someone else run the campaigns?', order: 14 },
      { id: 'team-4', text: 'Budget allocated for experimentation (10-20% of total)', category: 'Team & Process', description: 'Growth engines need fuel for testing. Companies that only fund "proven" tactics stop growing.', order: 15 },
    ],
    downloadable: false,
    tags: ['growth-strategy', 'marketing-audit', 'b2b-marketing', 'readiness'],
    clusterName: 'Build Growth Engine',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-02-01'),
  });

  await createTool({
    toolId: 'ai-marketing-maturity-assessment',
    title: 'AI Marketing Maturity Assessment',
    description: 'Discover where your marketing organization falls on the AI maturity spectrum — from AI-curious to AI-native. Answer 8 questions to get your score, personalized insights, and a recommended next step.',
    toolType: 'assessment',
    assessmentQuestions: [
      {
        id: 'q1', order: 1,
        question: 'How does your team primarily use AI in marketing today?',
        options: [
          { text: 'We don\'t use AI tools yet', value: 0 },
          { text: 'Individual team members use AI for specific tasks (writing, research)', value: 1 },
          { text: 'AI is embedded in our workflows with defined processes', value: 2 },
          { text: 'Our marketing operations are designed around AI capabilities', value: 3 },
        ],
      },
      {
        id: 'q2', order: 2,
        question: 'How do you approach content creation with AI?',
        options: [
          { text: 'All content is human-created', value: 0 },
          { text: 'AI assists with drafts that humans heavily edit', value: 1 },
          { text: 'AI generates content within brand voice guidelines with human review', value: 2 },
          { text: 'Automated content pipelines produce and optimize content at scale', value: 3 },
        ],
      },
      {
        id: 'q3', order: 3,
        question: 'How does AI factor into your marketing strategy decisions?',
        options: [
          { text: 'It doesn\'t — strategy is entirely human-driven', value: 0 },
          { text: 'We use AI for data analysis that informs human decisions', value: 1 },
          { text: 'AI provides recommendations that we evaluate and act on', value: 2 },
          { text: 'AI continuously optimizes campaigns and resource allocation', value: 3 },
        ],
      },
      {
        id: 'q4', order: 4,
        question: 'What best describes your AI governance approach?',
        options: [
          { text: 'No formal AI governance or guidelines', value: 0 },
          { text: 'Basic usage guidelines exist', value: 1 },
          { text: 'Comprehensive AI policy with brand voice rules and review processes', value: 2 },
          { text: 'Automated guardrails with quality monitoring and continuous improvement', value: 3 },
        ],
      },
      {
        id: 'q5', order: 5,
        question: 'How do you measure AI\'s impact on marketing performance?',
        options: [
          { text: 'We don\'t measure AI impact specifically', value: 0 },
          { text: 'We track time saved and output volume', value: 1 },
          { text: 'We measure quality, efficiency, and business outcomes', value: 2 },
          { text: 'AI impact is embedded in all marketing KPIs with A/B testing', value: 3 },
        ],
      },
      {
        id: 'q6', order: 6,
        question: 'What is your team\'s AI skill level?',
        options: [
          { text: 'Most team members are unfamiliar with AI tools', value: 0 },
          { text: 'A few champions use AI; others are learning', value: 1 },
          { text: 'Most team members are proficient with AI tools for their role', value: 2 },
          { text: 'Team builds custom AI workflows and contributes to tool development', value: 3 },
        ],
      },
      {
        id: 'q7', order: 7,
        question: 'How does AI integrate with your marketing technology stack?',
        options: [
          { text: 'Standalone AI tools not connected to our stack', value: 0 },
          { text: 'Some AI tools connect to our CRM or automation platform', value: 1 },
          { text: 'AI is integrated across major platforms with data flowing between them', value: 2 },
          { text: 'AI-native architecture where systems learn from each other', value: 3 },
        ],
      },
      {
        id: 'q8', order: 8,
        question: 'How do you approach AI experimentation?',
        options: [
          { text: 'We haven\'t experimented with AI', value: 0 },
          { text: 'Ad hoc experiments when someone tries a new tool', value: 1 },
          { text: 'Structured experimentation program with budget allocation', value: 2 },
          { text: 'Continuous experimentation is built into operations', value: 3 },
        ],
      },
    ],
    assessmentResults: [
      {
        minScore: 0, maxScore: 6,
        title: 'AI Curious',
        description: 'Your organization is in the early stages of AI adoption. This is a fine place to start — but the gap between you and AI-native competitors is widening.',
        recommendations: [
          'Start with a single high-impact use case (content drafting or data analysis)',
          'Identify 2-3 AI champions on your team and invest in their training',
          'Set aside 10% of marketing budget for AI tool experimentation',
          'Book a strategy session to map your AI transformation roadmap',
        ],
      },
      {
        minScore: 7, maxScore: 12,
        title: 'AI Assisted',
        description: 'You\'re using AI tools but haven\'t yet transformed how marketing operates. You\'re at Level 1 — which is where 75% of B2B companies are.',
        recommendations: [
          'Move from individual tool usage to team-wide AI workflows',
          'Implement brand voice guidelines and quality frameworks for AI content',
          'Connect AI tools to your CRM and automation platform',
          'Build a measurement framework that tracks AI\'s impact on business outcomes',
        ],
      },
      {
        minScore: 13, maxScore: 18,
        title: 'AI Integrated',
        description: 'AI is embedded in your marketing operations and informing decisions. You\'re ahead of most competitors. The next step is making AI foundational, not supplemental.',
        recommendations: [
          'Identify workflows that could be fully automated with AI',
          'Build compounding systems where AI outputs improve AI inputs',
          'Invest in custom AI models trained on your brand voice and market data',
          'Develop an AI center of excellence to share learnings across the organization',
        ],
      },
      {
        minScore: 19, maxScore: 24,
        title: 'AI Native',
        description: 'Your marketing operation is designed around AI capabilities. You\'re in the top 12% of B2B organizations. Focus on maintaining your lead and pushing the frontier.',
        recommendations: [
          'Share your learnings — write about what\'s working (it builds authority)',
          'Explore emerging AI capabilities (agents, multi-modal, reasoning)',
          'Help your sales and product teams reach AI-native maturity',
          'Consider productizing your AI marketing capabilities as a competitive moat',
        ],
      },
    ],
    downloadable: false,
    tags: ['ai-transformation', 'marketing-assessment', 'ai-maturity', 'readiness'],
    clusterName: 'Navigate AI Transformation',
    status: 'published',
    origin: 'manual',
    publishedAt: new Date('2026-02-05'),
  });

  console.log('[seed] All content seeded successfully!');
}

async function main() {
  try {
    await seed();
  } catch (err) {
    console.error('[seed] Error:', err);
    process.exit(1);
  } finally {
    await closeConnection();
    console.log('[seed] Connection closed.');
  }
}

main();
