export interface Service {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  deliveryModel: string;
  typicalScope: string;
  outcomes: string[];
  whoItsFor: string;
}

export interface ServiceCategory {
  name: string;
  slug: string;
  universe: 'strategic' | 'ai-native';
  tagline: string;
  description: string;
  color: string;
  colorName: string;
  borderClass: string;
  services: Service[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // ─── STRATEGIC B2B MARKETING SERVICES ───────────────────────────
  {
    name: 'Brand & Positioning',
    slug: 'brand-strategy',
    universe: 'strategic',
    tagline: 'The foundation everything else is built on.',
    description:
      'Market positioning, brand architecture, and messaging frameworks that carve space in crowded B2B markets. We built half these frameworks. We know what actually works — and what\'s just consultant theater.',
    color: '#FF5910',
    colorName: 'atomic-tangerine',
    borderClass: 'border-atomic-tangerine/30',
    services: [
      {
        name: 'Brand Strategy & Positioning',
        slug: 'brand-strategy-positioning',
        tagline: 'Own a space in the market nobody else can claim.',
        description:
          'Market positioning, brand architecture, and messaging frameworks that make your company unmistakable. Not cosmetic rebrands — strategic positioning that changes how markets perceive you and how buyers choose you.',
        deliveryModel: 'Project-based or embedded',
        typicalScope: '8–12 weeks',
        outcomes: [
          'Market positioning framework with competitive differentiation',
          'Brand architecture and hierarchy documentation',
          'Messaging framework: value props, proof points, persona messaging',
          'Internal alignment workshop and activation playbook',
          'Competitive positioning map with whitespace analysis',
        ],
        whoItsFor:
          'B2B tech companies entering new markets, repositioning after acquisitions, or preparing for a major growth phase where the old story no longer fits.',
      },
      {
        name: 'Go-to-Market Strategy',
        slug: 'go-to-market-strategy',
        tagline: 'Turn marketing from cost center to growth engine.',
        description:
          'The strategic blueprint that aligns product, marketing, and sales around a shared growth thesis. GTM planning, ICP development, competitive positioning, and channel strategy — all built to generate pipeline, not just awareness.',
        deliveryModel: 'Project-based',
        typicalScope: '6–10 weeks',
        outcomes: [
          'ICP definition with firmographic and psychographic profiles',
          'Competitive landscape analysis and positioning',
          'Channel strategy and prioritization matrix',
          'GTM launch timeline with milestones and owners',
          'Marketing-to-revenue model with measurable KPIs',
        ],
        whoItsFor:
          'B2B tech companies launching new products, entering new segments, or restructuring their marketing function to actually drive revenue.',
      },
      {
        name: 'Thought Leadership Strategy',
        slug: 'thought-leadership-strategy',
        tagline: 'Make your executives the ones the industry listens to.',
        description:
          'Structured programs that turn your leadership team into the experts media, analysts, and buyers seek out. Executive visibility, POV development, and authority building — not ghostwritten fluff, but real intellectual property that compounds.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'Executive POV platforms per leader',
          'Speaking and media opportunity pipeline',
          'Ghost-authored articles, op-eds, and research',
          'Social authority building program (LinkedIn + beyond)',
          'Analyst relations strategy and briefing prep',
        ],
        whoItsFor:
          'Executives and founders who need to build personal authority in their category — especially in competitive markets where expertise is the differentiator.',
      },
    ],
  },
  {
    name: 'Demand & Pipeline',
    slug: 'demand-generation',
    universe: 'strategic',
    tagline: 'Marketing that fills pipeline, not just dashboards.',
    description:
      'Full-funnel demand generation, ABM programs, and marketing automation that turns spend into predictable pipeline. We measure in revenue influence, not vanity metrics. If it doesn\'t move pipeline, we don\'t do it.',
    color: '#73F5FF',
    colorName: 'tidal-wave',
    borderClass: 'border-tidal-wave/30',
    services: [
      {
        name: 'Demand Generation',
        slug: 'demand-generation',
        tagline: 'Pipeline is the only metric that matters.',
        description:
          'Full-funnel demand generation programs that create, capture, and convert demand. We build the systems that turn market awareness into qualified pipeline — integrating content, channels, and conversion infrastructure into a single growth engine.',
        deliveryModel: 'Retainer',
        typicalScope: '6+ months',
        outcomes: [
          'Demand generation strategy aligned to revenue targets',
          'Multi-channel campaign architecture and execution',
          'Lead scoring model and qualification framework',
          'Content-to-pipeline mapping with conversion tracking',
          'Monthly pipeline contribution reporting',
        ],
        whoItsFor:
          'B2B tech companies that need predictable pipeline growth — not one-off campaigns, but a marketing engine that compounds over time.',
      },
      {
        name: 'Account-Based Marketing',
        slug: 'account-based-marketing',
        tagline: 'Precision over volume. Named accounts, not spray-and-pray.',
        description:
          'ABM strategy and execution for companies selling into defined target accounts. We build programs that coordinate marketing and sales around the accounts that actually matter — with personalized messaging, targeted channels, and deal-level intelligence.',
        deliveryModel: 'Retainer',
        typicalScope: 'Annual programs',
        outcomes: [
          'Target account list with tiering and prioritization',
          'Account-specific messaging and content',
          'Multi-channel orchestration (ads, email, direct mail, events)',
          'Sales enablement materials per account tier',
          'Account engagement scoring and pipeline influence tracking',
        ],
        whoItsFor:
          'Companies with high ACV products selling into enterprise accounts where every deal matters and generic marketing wastes budget.',
      },
      {
        name: 'Marketing Automation',
        slug: 'marketing-automation',
        tagline: 'Systems that nurture, score, and convert — while you sleep.',
        description:
          'Lifecycle marketing, nurture programs, and lead scoring that turn your marketing stack into a revenue machine. We design the workflows, build the logic, and optimize the sequences — so your tech stack actually earns its license fees.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing optimization',
        outcomes: [
          'Lifecycle stage definitions and lead scoring model',
          'Automated nurture sequences by persona and stage',
          'Marketing-to-sales handoff workflows',
          'Campaign performance dashboards',
          'Quarterly optimization based on conversion data',
        ],
        whoItsFor:
          'Companies that invested in HubSpot, Marketo, or Pardot but aren\'t getting the ROI — because the tool is only as good as the strategy behind it.',
      },
    ],
  },
  {
    name: 'Digital Performance',
    slug: 'digital-performance',
    universe: 'strategic',
    tagline: 'Every dollar accountable. Every channel optimized.',
    description:
      'Paid media, SEO, and social media programs run by people who understand B2B buying cycles — not consumer click-through rates. We optimize for pipeline influence, not impressions.',
    color: '#E1FF00',
    colorName: 'neon-cactus',
    borderClass: 'border-neon-cactus/30',
    services: [
      {
        name: 'Paid Media',
        slug: 'paid-media',
        tagline: 'B2B media buying that actually understands B2B.',
        description:
          'Google Ads, LinkedIn Ads, programmatic, and retargeting managed by strategists who know that B2B buying cycles are long, committees are real, and impressions mean nothing without downstream conversion.',
        deliveryModel: 'Retainer + media spend',
        typicalScope: 'Ongoing management',
        outcomes: [
          'Channel strategy aligned to buyer journey stages',
          'Campaign architecture with audience segmentation',
          'Creative development and A/B testing program',
          'Bid strategy optimization and budget allocation',
          'Pipeline-attributed performance reporting',
        ],
        whoItsFor:
          'B2B companies spending $50K+ monthly on paid media who need strategic management — not just someone pushing buttons in Google Ads.',
      },
      {
        name: 'SEO',
        slug: 'seo',
        tagline: 'Organic visibility that compounds quarter over quarter.',
        description:
          'Technical SEO, content SEO, and link building for B2B companies that need to own their category in search. We build SEO programs that drive qualified traffic — not vanity rankings for keywords nobody converts on.',
        deliveryModel: 'Retainer',
        typicalScope: '6+ months',
        outcomes: [
          'Technical SEO audit and remediation roadmap',
          'Keyword strategy mapped to buying intent',
          'Content optimization and pillar page architecture',
          'Link building and domain authority program',
          'Monthly ranking and traffic-to-pipeline reporting',
        ],
        whoItsFor:
          'B2B tech companies that want to own organic search for high-intent keywords in their category — and understand that SEO is a compounding investment.',
      },
      {
        name: 'Social Media',
        slug: 'social-media',
        tagline: 'LinkedIn strategy that builds authority, not just followers.',
        description:
          'Organic social strategy focused on LinkedIn — where your B2B buyers actually live. We build programs that position your company and executives as category authorities through strategic content, community engagement, and employee advocacy.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'Social strategy aligned to brand positioning',
          'Content calendar with executive and company content',
          'Employee advocacy program and guidelines',
          'Community engagement and conversation strategy',
          'Monthly engagement and attribution reporting',
        ],
        whoItsFor:
          'B2B companies that know their buyers are on LinkedIn but don\'t have a strategy more sophisticated than "post more."',
      },
    ],
  },
  {
    name: 'Content & Creative',
    slug: 'content-marketing',
    universe: 'strategic',
    tagline: 'Content that earns attention. Creative that earns trust.',
    description:
      'Content marketing, campaign creative, and brand design from a team that has been writing the B2B playbook for 25 years. Not content mills. Strategic content with a point of view — because bland doesn\'t convert.',
    color: '#ED0AD2',
    colorName: 'sprinkles',
    borderClass: 'border-sprinkles/30',
    services: [
      {
        name: 'Content Marketing',
        slug: 'content-marketing',
        tagline: 'Strategic content that moves pipeline, not just pageviews.',
        description:
          'Content strategy, thought leadership content, research reports, and editorial programs built to support the full buyer journey. Every piece serves a strategic purpose — awareness, education, conversion, or retention.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing production',
        outcomes: [
          'Content strategy aligned to buyer journey and JTBD',
          'Editorial calendar with content-to-campaign mapping',
          'Thought leadership articles, guides, and research',
          'Gated content for demand gen programs',
          'Content performance and pipeline attribution',
        ],
        whoItsFor:
          'B2B companies that need a real content program — not a blog nobody reads, but a strategic editorial operation that supports pipeline.',
      },
      {
        name: 'Creative Services',
        slug: 'creative-services',
        tagline: 'Design that makes B2B look like it gives a damn.',
        description:
          'Campaign creative, brand design, and visual storytelling from a team that believes B2B doesn\'t have to look boring. We create work that stops the scroll, earns attention, and makes your brand memorable in a sea of blue gradients and stock photos.',
        deliveryModel: 'Project or retainer',
        typicalScope: 'As needed',
        outcomes: [
          'Campaign creative concepts and execution',
          'Brand identity and visual system development',
          'Sales enablement design (decks, one-pagers, proposals)',
          'Digital asset creation (social, display, email)',
          'Brand guidelines and template systems',
        ],
        whoItsFor:
          'B2B companies that are tired of looking like every other tech company — and understand that design is a strategic advantage, not a cost center.',
      },
    ],
  },
  {
    name: 'Advisory & Transformation',
    slug: 'fractional-cmo',
    universe: 'strategic',
    tagline: 'Senior marketing leadership without the full-time overhead.',
    description:
      'Fractional CMO services and marketing transformation programs. We embed senior strategists inside your organization to build the marketing function you need — then help your team learn to run it.',
    color: '#FFBDAE',
    colorName: 'fing-peachy',
    borderClass: 'border-fing-peachy/30',
    services: [
      {
        name: 'Fractional CMO',
        slug: 'fractional-cmo',
        tagline: 'A real CMO. Part-time commitment. Full strategic weight.',
        description:
          'Part-time marketing leadership for companies that need senior strategic guidance without the $400K+ full-time commitment. We embed experienced marketing executives who build strategy, manage teams, and drive results — with the same accountability as a full-time hire.',
        deliveryModel: 'Retainer',
        typicalScope: '6–12 month engagements',
        outcomes: [
          'Marketing strategy development and execution oversight',
          'Team structure assessment and hiring plan',
          'Board and executive reporting cadence',
          'Vendor evaluation, selection, and management',
          'Marketing-to-revenue alignment with sales leadership',
        ],
        whoItsFor:
          'B2B tech companies ($10M–$200M) that need a strategic marketing leader but aren\'t ready for — or can\'t find — a full-time CMO.',
      },
      {
        name: 'Marketing Transformation',
        slug: 'marketing-transformation',
        tagline: 'Rebuild your marketing function from the inside out.',
        description:
          'Team structure, capability building, process optimization, and technology stack rationalization. We help companies that know their marketing isn\'t working but can\'t figure out why — and build the organizational capability to make it work.',
        deliveryModel: 'Project-based',
        typicalScope: '3–6 months',
        outcomes: [
          'Marketing capability assessment and gap analysis',
          'Team structure and role design recommendations',
          'Process documentation and workflow optimization',
          'Technology stack audit and rationalization plan',
          'Change management and training program',
        ],
        whoItsFor:
          'Companies going through rapid growth, post-acquisition integration, or leadership transitions where the marketing function needs a reset.',
      },
    ],
  },

  // ─── AI-NATIVE B2B MARKETING SOLUTIONS ──────────────────────────
  {
    name: 'AI-Native Solutions',
    slug: 'ai-marketing',
    universe: 'ai-native',
    tagline: 'Not AI-curious. AI-native.',
    description:
      'The intelligence layer beneath modern marketing. AI strategy, custom content engines, answer engine optimization, and transformation programs built by people who have been shipping AI systems in production — not just talking about them at conferences.',
    color: '#088BA0',
    colorName: 'hurricane-sky',
    borderClass: 'border-hurricane-sky/30',
    services: [
      {
        name: 'AI Marketing Strategy',
        slug: 'ai-marketing-strategy',
        tagline: 'A real AI roadmap. Not another innovation theater deck.',
        description:
          'AI transformation roadmaps, governance frameworks, and implementation strategies built for marketing teams that are ready to move past experimentation. We assess your current state, identify high-impact use cases, and build a pragmatic plan that accounts for your team, your tech, and your timeline.',
        deliveryModel: 'Project + retainer',
        typicalScope: 'Discovery + implementation',
        outcomes: [
          'AI readiness assessment across marketing functions',
          'Prioritized use case roadmap with ROI projections',
          'Governance framework for AI-generated content',
          'Technology stack recommendations and vendor evaluation',
          'Implementation timeline with resource requirements',
        ],
        whoItsFor:
          'Marketing leaders who know AI matters but need a clear-eyed strategic partner — not a vendor selling tools.',
      },
      {
        name: 'AI Content Engines',
        slug: 'ai-content-engines',
        tagline: 'Human-quality output at non-human scale.',
        description:
          'Custom AI content generation systems trained on your brand voice, messaging frameworks, and domain expertise. We build engines that produce publication-ready content across formats — blog, social, email, research — with human editorial oversight baked into the workflow.',
        deliveryModel: 'Build + maintain',
        typicalScope: 'Custom scoping',
        outcomes: [
          'Custom AI content generation system with brand voice training',
          'Multi-format content production workflows',
          'Editorial quality assurance and governance processes',
          'Content performance feedback loops for model improvement',
          'Team training on AI-assisted content operations',
        ],
        whoItsFor:
          'Companies that need 10x content output without 10x headcount — and won\'t accept generic AI slop as a substitute for quality.',
      },
      {
        name: 'Answer Engine Optimization',
        slug: 'answer-engine-optimization',
        tagline: 'Be the answer when AI does the searching.',
        description:
          'Visibility optimization for AI-powered search — ChatGPT, Perplexity, Google AI Overviews, and every LLM-driven discovery channel. We pioneered the methodology for ensuring your brand shows up when AI answers your buyers\' questions.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'AI search visibility audit and baseline measurement',
          'Content optimization for LLM citation and reference',
          'Structured data and semantic markup strategy',
          'AI answer monitoring and competitive tracking',
          'Monthly visibility reporting across AI platforms',
        ],
        whoItsFor:
          'Companies that understand the search landscape is shifting from links to answers — and want to be the brand AI recommends.',
      },
      {
        name: 'AI Foundations',
        slug: 'ai-foundations',
        tagline: 'Build the intelligence layer beneath your marketing.',
        description:
          'The groundwork for AI-native marketing operations. Data infrastructure, knowledge management, and foundational AI capabilities that turn your marketing organization into one that can actually leverage AI at scale — not just experiment with ChatGPT prompts.',
        deliveryModel: 'Project-based',
        typicalScope: '8–12 weeks',
        outcomes: [
          'Marketing data audit and quality assessment',
          'Knowledge base architecture and content taxonomy',
          'Data pipeline design for AI model training',
          'Integration mapping across marketing technology stack',
          'AI readiness scorecard with improvement roadmap',
        ],
        whoItsFor:
          'Companies that tried AI tools and hit a wall — because the foundation wasn\'t there. Data scattered, knowledge tribal, processes manual.',
      },
      {
        name: 'AI-Native Strategy',
        slug: 'ai-native-strategy',
        tagline: 'Architect your marketing for how buyers actually discover now.',
        description:
          'Strategic design for how your brand interacts with AI systems — the ones your buyers use to research, evaluate, and decide. We build strategies that ensure your company is present, accurate, and authoritative across every AI-mediated touchpoint.',
        deliveryModel: 'Project + retainer',
        typicalScope: '6–10 weeks + ongoing',
        outcomes: [
          'AI buyer journey mapping across discovery channels',
          'Brand presence strategy for AI-mediated touchpoints',
          'Content architecture optimized for AI consumption',
          'Competitive AI visibility analysis',
          'Quarterly strategy refresh based on AI platform evolution',
        ],
        whoItsFor:
          'Forward-thinking marketing leaders who see that AI isn\'t just a tool — it\'s a new channel, a new buyer behavior, and a new competitive landscape.',
      },
      {
        name: 'AI Enablement',
        slug: 'ai-enablement',
        tagline: 'Move from experimenting to operating.',
        description:
          'The bridge between AI pilots and production AI systems. We take the experiments that showed promise and turn them into reliable, scalable marketing operations — with proper workflows, quality controls, and team adoption built in.',
        deliveryModel: 'Project-based',
        typicalScope: '3–6 months',
        outcomes: [
          'AI pilot assessment and production readiness evaluation',
          'Workflow design for AI-assisted marketing operations',
          'Quality assurance frameworks and human oversight protocols',
          'Team training and adoption program',
          'Performance benchmarks and optimization cadence',
        ],
        whoItsFor:
          'Marketing teams that ran successful AI experiments but can\'t figure out how to make them part of daily operations at scale.',
      },
      {
        name: 'AI Managed Services',
        slug: 'ai-managed-services',
        tagline: 'Your AI systems, our expertise. Continuously optimized.',
        description:
          'Ongoing monitoring, optimization, and evolution of your AI marketing systems. Models degrade, platforms change, and what worked last quarter needs tuning this quarter. We keep your AI infrastructure performing — so your team can focus on strategy.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'Continuous model performance monitoring and tuning',
          'Platform update impact assessment and adaptation',
          'Monthly optimization based on output quality metrics',
          'Quarterly AI strategy reviews and roadmap updates',
          'Incident response for AI system issues',
        ],
        whoItsFor:
          'Companies with AI marketing systems in production that need dedicated expertise to keep them performing — without hiring a full AI ops team.',
      },
      {
        name: 'AI Transformation & Leadership',
        slug: 'ai-transformation-leadership',
        tagline: 'Restructure your organization around what AI makes possible.',
        description:
          'Organizational transformation programs that go beyond tools and workflows to fundamentally rethink how marketing teams are structured, how budgets are allocated, and how value is created in an AI-native world. This is change management for the AI era.',
        deliveryModel: 'Project + advisory retainer',
        typicalScope: '6–12 months',
        outcomes: [
          'Organizational design for AI-native marketing operations',
          'Role evolution framework: what changes, what stays, what\'s new',
          'Budget reallocation strategy for AI investment',
          'Executive alignment and board communication program',
          'Phased transformation roadmap with change management',
        ],
        whoItsFor:
          'CMOs and marketing VPs who see AI as an organizational transformation, not just a technology upgrade — and need a strategic partner who has done it.',
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((cat) => cat.slug === slug);
}

export function getStrategicCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES.filter((cat) => cat.universe === 'strategic');
}

export function getAiCategory(): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((cat) => cat.universe === 'ai-native');
}

export function getRelatedCategories(currentSlug: string, count = 3): ServiceCategory[] {
  return SERVICE_CATEGORIES.filter((cat) => cat.slug !== currentSlug).slice(0, count);
}
