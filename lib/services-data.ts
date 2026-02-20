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
        name: 'Visual Brand Development',
        slug: 'visual-brand-development',
        tagline: 'A visual identity system that works as hard as your strategy.',
        description:
          'Logo systems, visual identity, brand guidelines, and design systems built to scale across every touchpoint. We translate strategic positioning into visual language that makes your brand instantly recognizable — from pitch decks to product UI to trade show booths.',
        deliveryModel: 'Project-based',
        typicalScope: '6–10 weeks',
        outcomes: [
          'Logo system with usage guidelines and lockups',
          'Visual identity system: color, typography, imagery, iconography',
          'Brand guidelines document with application examples',
          'Design system components for digital and print',
          'Template library for sales, marketing, and internal use',
        ],
        whoItsFor:
          'B2B tech companies that need a visual identity matching the sophistication of their product — or are post-rebrand and need the visual system to catch up with the strategy.',
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
    name: 'Go-to-Market Strategy & Architecture',
    slug: 'gtm-strategy',
    universe: 'strategic',
    tagline: 'The blueprint that connects everything to revenue.',
    description:
      'Go-to-market strategy, ICP development, competitive positioning, and channel architecture — built by a team that has designed GTM for hundreds of B2B tech companies. We don\'t just plan launches. We architect growth systems.',
    color: '#FFBDAE',
    colorName: 'fing-peachy',
    borderClass: 'border-fing-peachy/30',
    services: [
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
          'Google Ads, LinkedIn Ads, programmatic, and retargeting managed by strategists who know that B2B buying cycles are long, committees are real, and impressions mean nothing without downstream conversion. We manage spend against pipeline — not clicks.',
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
        name: 'Earned Media',
        slug: 'earned-media',
        tagline: 'Coverage you can\'t buy. Credibility you can\'t fake.',
        description:
          'Strategic public relations, analyst relations, and media placement for B2B tech companies that need third-party validation. We build earned media programs that land coverage in the publications your buyers and analysts actually read — Tier 1 press, trade media, and influential voices in your category.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'PR strategy with targeted media list and pitch calendar',
          'Analyst relations program with briefing preparation',
          'Executive media training and spokesperson readiness',
          'Share of voice tracking and competitive benchmarking',
          'Crisis communications framework and response protocols',
        ],
        whoItsFor:
          'B2B tech companies that need market credibility beyond what they can self-publish — especially those entering new categories, raising capital, or announcing major milestones.',
      },
      {
        name: 'Owned Media',
        slug: 'owned-media',
        tagline: 'Channels you control. Audiences you build.',
        description:
          'SEO, social media, email, and web properties — the channels where your brand owns the conversation. We build owned media strategies that compound over time: organic search visibility, LinkedIn authority, email engagement, and website conversion — all integrated into a single system that works without paying for every impression.',
        deliveryModel: 'Retainer',
        typicalScope: '6+ months',
        outcomes: [
          'SEO strategy with technical audit and content roadmap',
          'Social media program (LinkedIn focus) with executive + company content',
          'Email nurture architecture and segmentation strategy',
          'Website optimization for conversion and engagement',
          'Monthly owned channel performance and attribution reporting',
        ],
        whoItsFor:
          'B2B companies ready to build durable distribution channels they actually own — instead of renting attention from platforms indefinitely.',
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
          'Content strategy, thought leadership content, research reports, and editorial programs built to support the full buyer journey. Every piece serves a strategic purpose — awareness, education, conversion, or retention. We tie content strategy directly to Answer Engine Optimization, ensuring your content is structured for both human readers and AI-powered discovery channels.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing production',
        outcomes: [
          'Content strategy aligned to buyer journey and core buyer goals',
          'Editorial calendar with content-to-campaign mapping',
          'Thought leadership articles, guides, and research',
          'AEO-optimized content architecture for AI search visibility',
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
        name: 'AI GTM Activation',
        slug: 'ai-gtm-activation',
        tagline: 'Launch faster. Target sharper. Convert smarter.',
        description:
          'AI-powered go-to-market execution that compresses timelines and sharpens targeting. We build activation systems that use AI to identify ideal accounts, personalize outreach at scale, and optimize channel mix in real-time — turning your GTM strategy into a live, learning system.',
        deliveryModel: 'Project + retainer',
        typicalScope: '8–12 weeks + ongoing',
        outcomes: [
          'AI-powered ICP scoring and account prioritization',
          'Dynamic audience segmentation and targeting models',
          'Personalized multi-channel activation sequences',
          'Real-time campaign optimization and A/B testing',
          'GTM performance analytics with pipeline attribution',
        ],
        whoItsFor:
          'B2B companies launching products or entering markets who want AI to compress their time-to-pipeline instead of waiting quarters for results.',
      },
      {
        name: 'AI Content Studio',
        slug: 'ai-content-studio',
        tagline: 'Human-quality output at non-human scale.',
        description:
          'Custom AI content generation systems trained on your brand voice, messaging frameworks, and domain expertise. We build content studios that produce publication-ready assets across formats — blog, social, email, research, sales enablement — with human editorial oversight baked into every workflow.',
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
        name: 'AI Design Studio',
        slug: 'ai-design-studio',
        tagline: 'Creative at the speed of strategy.',
        description:
          'AI-powered design systems that produce on-brand visual assets at scale. From campaign creative to social graphics to presentation decks — we build design workflows where AI handles production while your team focuses on creative direction. Brand guidelines enforced automatically. No more bottlenecks.',
        deliveryModel: 'Build + retainer',
        typicalScope: 'Custom scoping',
        outcomes: [
          'AI design system trained on your brand guidelines',
          'Automated creative production for campaigns and social',
          'Template-based asset generation with brand enforcement',
          'Design workflow integration with marketing operations',
          'Quality control protocols and creative review processes',
        ],
        whoItsFor:
          'Marketing teams drowning in design requests who need brand-consistent creative output without scaling the design team linearly.',
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
        name: 'Autonomous Outbound AI System',
        slug: 'autonomous-outbound-ai',
        tagline: 'Outbound that runs itself. Pipeline that doesn\'t stop.',
        description:
          'Fully autonomous AI outbound systems that identify prospects, craft personalized sequences, manage cadences, and optimize based on engagement signals — without human bottlenecks. We build the system, tune the models, and let it run. Your team handles the conversations that matter.',
        deliveryModel: 'Build + retainer',
        typicalScope: 'Build (6–8 weeks) + ongoing optimization',
        outcomes: [
          'Autonomous prospect identification and qualification system',
          'AI-generated personalized outreach sequences',
          'Multi-channel cadence management (email, LinkedIn, phone)',
          'Engagement signal detection and response optimization',
          'Pipeline contribution reporting and system tuning',
        ],
        whoItsFor:
          'B2B companies that need predictable outbound pipeline without scaling SDR teams — or want their existing SDRs focused on high-value conversations instead of cold outreach.',
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
