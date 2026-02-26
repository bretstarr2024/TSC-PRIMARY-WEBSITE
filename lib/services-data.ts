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

export interface AnswerCapsule {
  question: string;
  answer: string;
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
  answerCapsules: AnswerCapsule[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // ─── STRATEGIC B2B MARKETING SERVICES ───────────────────────────
  {
    name: 'Brand & Positioning',
    slug: 'brand-strategy',
    universe: 'strategic',
    tagline: 'The foundation everything else is built on.',
    description:
      'Market positioning, brand architecture, messaging frameworks, and analyst relations programs that carve space in crowded B2B markets. We built half these frameworks. We know what actually works — and what\'s just consultant theater.',
    color: '#FF5910',
    colorName: 'atomic-tangerine',
    borderClass: 'border-atomic-tangerine/30',
    services: [
      {
        name: 'Market Positioning',
        slug: 'market-positioning',
        tagline: 'Own a space in the market nobody else can claim.',
        description:
          'Market positioning defines how your company is perceived relative to competitors and establishes the strategic space you own in your category. We build positioning platforms grounded in competitive analysis, buyer research, and whitespace identification — not brand workshops with sticky notes. The output is a positioning framework your entire organization can execute against, from the boardroom to the BDR floor.',
        deliveryModel: 'Project-based or embedded',
        typicalScope: '8–12 weeks',
        outcomes: [
          'Market positioning framework with competitive differentiation',
          'Competitive landscape analysis and whitespace mapping',
          'Category narrative and strategic storyline',
          'Internal alignment workshop and activation playbook',
          'Positioning validation with buyer and stakeholder interviews',
        ],
        whoItsFor:
          'B2B tech companies entering new markets, repositioning after acquisitions, or preparing for a growth phase where the old story no longer fits.',
      },
      {
        name: 'Messaging Frameworks',
        slug: 'messaging-frameworks',
        tagline: 'One story. Every team. Every touchpoint.',
        description:
          'A messaging framework is the strategic system that ensures every person in your organization tells the same story with the same conviction and precision. We build frameworks that include value propositions, proof points, persona-specific messaging, objection handling, and sales narratives — structured so the story scales from your CEO keynote to your SDR cold call without losing its edge.',
        deliveryModel: 'Project-based',
        typicalScope: '6–8 weeks',
        outcomes: [
          'Core messaging platform with elevator pitch and value propositions',
          'Persona-specific messaging tracks for each buying committee role',
          'Proof points library with quantifiable evidence',
          'Objection handling guide mapped to competitive threats',
          'Sales narrative and pitch deck storyline',
        ],
        whoItsFor:
          'Companies where sales tells a different story than marketing, the website says something the pitch deck contradicts, and nobody can explain the differentiation in under 30 seconds.',
      },
      {
        name: 'Brand Architecture',
        slug: 'brand-architecture',
        tagline: 'Make your brand portfolio work together, not against itself.',
        description:
          'Brand architecture defines the relationship between your master brand, sub-brands, product lines, and acquired companies so they reinforce each other instead of competing for attention. We design architecture systems — branded house, house of brands, endorsed, or hybrid — based on your growth strategy, acquisition trajectory, and market reality. Not theory. Structure that scales.',
        deliveryModel: 'Project-based',
        typicalScope: '6–10 weeks',
        outcomes: [
          'Brand architecture model with hierarchy documentation',
          'Naming strategy and nomenclature system',
          'Brand relationship guidelines (endorsement, co-branding, sub-branding)',
          'Migration roadmap for acquired or legacy brands',
          'Internal governance framework for brand portfolio decisions',
        ],
        whoItsFor:
          'Multi-product companies, post-acquisition portfolios, and any organization where the brand family has grown organically and now confuses more than it clarifies.',
      },
      {
        name: 'Visual Identity & Design Systems',
        slug: 'visual-identity-design-systems',
        tagline: 'A visual system that works as hard as your strategy.',
        description:
          'Visual identity translates strategic positioning into a design language that makes your brand instantly recognizable across every touchpoint. We build complete visual systems — logo, color, typography, imagery, iconography, and component libraries — designed to scale from pitch decks to product UI to trade show environments without breaking.',
        deliveryModel: 'Project-based',
        typicalScope: '8–12 weeks',
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
        name: 'Thought Leadership Programs',
        slug: 'thought-leadership-programs',
        tagline: 'Make your executives the ones the industry listens to.',
        description:
          'Thought leadership programs transform executives into the recognized experts that media, analysts, and buyers actively seek out for insight and perspective. We build structured authority-building systems — POV development, speaking pipelines, ghost-authored content, and social programs — that generate real intellectual property. Not ghostwritten fluff. Ideas that compound.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'Executive POV platforms per leader with signature themes',
          'Speaking and media opportunity pipeline',
          'Ghost-authored articles, op-eds, and original research',
          'Social authority building program (LinkedIn and beyond)',
          'Quarterly visibility reporting and opportunity tracking',
        ],
        whoItsFor:
          'Executives and founders who need to build personal authority in their category — especially in competitive markets where expertise is the differentiator.',
      },
      {
        name: 'Analyst Relations',
        slug: 'analyst-relations',
        tagline: 'Get into the reports that shape buying decisions.',
        description:
          'Analyst relations programs position your company for inclusion and favorable coverage in the Gartner Magic Quadrants, Forrester Waves, and IDC MarketScapes that enterprise buyers use to build shortlists. We manage the full analyst lifecycle — targeting, briefing preparation, inquiry strategy, and report response — so you show up where it matters, positioned exactly how you want.',
        deliveryModel: 'Retainer',
        typicalScope: '12+ months',
        outcomes: [
          'Analyst targeting strategy aligned to key research cycles',
          'Briefing preparation and messaging for each analyst firm',
          'Inquiry strategy to maximize included research benefits',
          'MQ/Wave/MarketScape positioning assessment and improvement plan',
          'Analyst perception tracking and competitive benchmarking',
        ],
        whoItsFor:
          'B2B tech companies selling into enterprise buyers who use analyst reports to evaluate vendors — especially those targeting Gartner MQ or Forrester Wave inclusion.',
      },
    ],
    answerCapsules: [
      {
        question: 'What does a B2B brand positioning engagement actually include?',
        answer:
          'A B2B brand positioning engagement includes competitive analysis, buyer research, whitespace identification, and a positioning framework your entire organization can execute against. The typical scope is 8–12 weeks, starting with market research and stakeholder interviews, moving through positioning development, and ending with an internal activation playbook. The output is a strategic foundation — not a tagline exercise.',
      },
      {
        question: 'When should a B2B tech company invest in a messaging framework?',
        answer:
          'B2B tech companies should invest in a messaging framework when sales tells a different story than marketing, the website contradicts the pitch deck, or nobody can explain the differentiation in under 30 seconds. The most common triggers: entering a new market, post-acquisition integration, launching a new product line, or realizing your win rate is dropping because competitors out-message you.',
      },
      {
        question: 'How do analyst relations influence B2B buying decisions?',
        answer:
          'Analyst relations directly influence B2B buying decisions because enterprise buyers use Gartner Magic Quadrants, Forrester Waves, and IDC MarketScapes to build vendor shortlists before they ever talk to sales. Being positioned favorably — or being absent — in these reports can determine whether you make the consideration set for deals worth millions.',
      },
      {
        question: "What's the difference between a rebrand and repositioning?",
        answer:
          "Repositioning changes how the market perceives your company's strategic value, while a rebrand changes the visual and verbal identity that communicates that position. Most companies that think they need a rebrand actually need repositioning first — because a new logo on a confused strategy is still a confused strategy.",
      },
    ],
  },
  {
    name: 'GTM Strategy & Architecture',
    slug: 'gtm-strategy',
    universe: 'strategic',
    tagline: 'The blueprint that connects everything to revenue.',
    description:
      'Go-to-market strategy, ICP development, competitive positioning, sales enablement, and revenue architecture — built by a team that has designed GTM for hundreds of B2B tech companies. We don\'t just plan launches. We architect growth systems.',
    color: '#FFBDAE',
    colorName: 'fing-peachy',
    borderClass: 'border-fing-peachy/30',
    services: [
      {
        name: 'ICP & Buyer Journey Mapping',
        slug: 'icp-buyer-journey-mapping',
        tagline: 'Know exactly who buys and how they buy.',
        description:
          'ICP and buyer journey mapping combines firmographic profiling, psychographic analysis, and buying committee research to identify the companies and people most likely to buy and succeed. We go beyond demographics to understand your buyers\' worldview, their internal politics, the triggers that move them from status quo to active evaluation, and the objections that kill deals at every stage.',
        deliveryModel: 'Project-based',
        typicalScope: '4–6 weeks',
        outcomes: [
          'ICP definition with firmographic and psychographic profiles',
          'Buying committee map with role-specific motivations and objections',
          'Buyer journey stages with trigger events and decision criteria',
          'Content and channel recommendations per stage and persona',
          'Disqualification criteria to prevent wasted sales effort',
        ],
        whoItsFor:
          'B2B tech companies that are either targeting everyone (and converting nobody) or relying on assumptions about their buyers instead of evidence.',
      },
      {
        name: 'Competitive Positioning',
        slug: 'competitive-positioning',
        tagline: 'Win the deal before the demo starts.',
        description:
          'Competitive positioning gives your sales and marketing teams the strategic ammunition to differentiate against named competitors in active deal cycles. We build competitive intelligence systems — battlecards, win/loss analysis, objection handling, and trap-setting content — grounded in real buyer perception, not your internal assumptions about why you\'re better.',
        deliveryModel: 'Project-based + quarterly refresh',
        typicalScope: '4–6 weeks initial + ongoing',
        outcomes: [
          'Competitive landscape map with positioning for each named competitor',
          'Sales battlecards with differentiation, objections, and trap questions',
          'Win/loss analysis framework with quarterly review cadence',
          'Competitive content strategy (comparison pages, migration guides)',
          'Alert system for competitor moves and market shifts',
        ],
        whoItsFor:
          'Companies losing deals to competitors they should be beating — or winning deals without understanding why, which means they can\'t replicate it.',
      },
      {
        name: 'Launch Strategy',
        slug: 'launch-strategy',
        tagline: 'Turn product launches into pipeline events.',
        description:
          'Launch strategy is the coordinated go-to-market plan that aligns product, marketing, sales, and customer success around a shared growth thesis and execution timeline. We architect launches that generate pipeline on day one — not vanity announcements that get a press release and a LinkedIn post, then disappear. Product launches, market entry, geographic expansion, rebrand rollouts.',
        deliveryModel: 'Project-based',
        typicalScope: '6–10 weeks',
        outcomes: [
          'GTM launch plan with milestones, owners, and dependencies',
          'Launch messaging and content package across channels',
          'Channel strategy and media plan for launch window',
          'Sales enablement kit for launch (deck, battlecard, FAQ, demo script)',
          'Post-launch measurement framework with pipeline targets',
        ],
        whoItsFor:
          'B2B tech companies launching new products, entering new segments, expanding geographies, or rolling out repositioned brands that need coordinated market impact.',
      },
      {
        name: 'Sales Enablement',
        slug: 'sales-enablement',
        tagline: 'Arm your sellers with what actually closes deals.',
        description:
          'Sales enablement builds the content, tools, and training that make your sales team more effective at every stage of the deal cycle. We create materials grounded in buyer reality — pitch decks that tell a strategic story, battlecards based on real competitive intelligence, case studies structured around business outcomes, and playbooks that compress ramp time for new reps.',
        deliveryModel: 'Project-based or retainer',
        typicalScope: '6–8 weeks initial + ongoing',
        outcomes: [
          'Sales pitch deck with strategic narrative and modular structure',
          'Competitive battlecards per named competitor',
          'Case study library structured around business outcomes',
          'Objection handling guide mapped to buyer journey stages',
          'New rep onboarding playbook with messaging certification',
        ],
        whoItsFor:
          'Sales teams that are building their own decks, winging competitive responses, and losing deals because marketing gave them a brochure instead of a weapon.',
      },
      {
        name: 'Channel Strategy',
        slug: 'channel-strategy',
        tagline: 'Reach buyers through the paths that actually convert.',
        description:
          'Channel strategy determines how your marketing reaches buyers across owned, earned, paid, and partner channels — and how you allocate resources across them based on evidence, not habit. We build channel architectures that account for B2B buying complexity: long cycles, multiple touchpoints, dark social influence, and the reality that attribution models only see half the picture.',
        deliveryModel: 'Project-based',
        typicalScope: '4–6 weeks',
        outcomes: [
          'Channel mix recommendation with investment allocation',
          'Channel performance benchmarks and measurement framework',
          'Partner and alliance marketing strategy where applicable',
          'Channel-specific content and messaging requirements',
          'Quarterly optimization cadence and reallocation triggers',
        ],
        whoItsFor:
          'Companies spending across multiple channels without a clear model for why — or over-investing in what\'s measurable while under-investing in what actually drives decisions.',
      },
      {
        name: 'Revenue Architecture',
        slug: 'revenue-architecture',
        tagline: 'Connect marketing spend to revenue outcomes.',
        description:
          'Revenue architecture designs the end-to-end system that connects marketing investment to pipeline generation and closed revenue with measurable attribution at every stage. We build marketing-to-revenue models, define pipeline stage criteria, design attribution frameworks, and establish the KPIs that align marketing and sales around shared outcomes — not siloed vanity metrics.',
        deliveryModel: 'Project-based',
        typicalScope: '6–8 weeks',
        outcomes: [
          'Marketing-to-revenue model with stage definitions and conversion targets',
          'Attribution framework (multi-touch, account-based, or hybrid)',
          'KPI dashboard design with leading and lagging indicators',
          'Marketing-sales SLA with handoff criteria and feedback loops',
          'Quarterly business review framework and reporting cadence',
        ],
        whoItsFor:
          'Marketing leaders who need to demonstrate revenue contribution to the board — and sales leaders who need marketing to be accountable for pipeline, not just activity.',
      },
    ],
    answerCapsules: [
      {
        question: "What's included in a B2B go-to-market strategy?",
        answer:
          "A B2B go-to-market strategy includes ICP development, competitive positioning, channel architecture, launch planning, sales enablement, and a marketing-to-revenue model with measurable KPIs. It's the strategic blueprint that aligns product, marketing, and sales around a shared growth thesis — typically scoped at 6–10 weeks for companies entering new markets or restructuring their marketing function.",
      },
      {
        question: 'How do you develop an ICP for B2B tech companies?',
        answer:
          "ICP development combines firmographic profiling, psychographic analysis, and buying committee mapping to identify the companies and people most likely to buy and succeed. We go beyond demographics to understand your buyers' worldview, their internal politics, and the triggers that move them from awareness to purchase.",
      },
      {
        question: 'What is revenue architecture in B2B marketing?',
        answer:
          'Revenue architecture is the end-to-end system that connects marketing investment to pipeline generation and closed revenue with measurable attribution at every stage. It includes stage definitions, conversion targets, attribution models, and marketing-sales SLAs — so both teams are accountable for the same revenue number instead of arguing about MQL quality.',
      },
      {
        question: 'How do you measure go-to-market success?',
        answer:
          'Go-to-market success is measured by pipeline generated, marketing-sourced revenue, customer acquisition cost, and time-to-revenue from launch. Vanity metrics like impressions and clicks tell you nothing about whether your GTM is working — we build measurement frameworks tied directly to revenue outcomes.',
      },
    ],
  },
  {
    name: 'Demand & Pipeline',
    slug: 'demand-generation',
    universe: 'strategic',
    tagline: 'Marketing that fills pipeline, not just dashboards.',
    description:
      'Full-funnel demand generation, ABM programs, marketing automation, lead scoring, pipeline analytics, and campaign operations that turn spend into predictable pipeline. We measure in revenue influence, not vanity metrics. If it doesn\'t move pipeline, we don\'t do it.',
    color: '#73F5FF',
    colorName: 'tidal-wave',
    borderClass: 'border-tidal-wave/30',
    services: [
      {
        name: 'Full-Funnel Demand Gen',
        slug: 'full-funnel-demand-gen',
        tagline: 'Pipeline is the only metric that matters.',
        description:
          'Full-funnel demand generation creates, captures, and converts buyer interest into qualified pipeline through coordinated programs across every stage of the journey. We build demand engines that integrate content, channels, and conversion infrastructure into a single growth system — not a collection of disconnected campaigns. The goal is predictable pipeline that compounds, not one-off spikes that disappear.',
        deliveryModel: 'Retainer',
        typicalScope: '6+ months',
        outcomes: [
          'Demand generation strategy aligned to revenue targets',
          'Multi-channel campaign architecture and execution',
          'Content-to-pipeline mapping with conversion tracking',
          'Demand creation programs (awareness, education, community)',
          'Monthly pipeline contribution and velocity reporting',
        ],
        whoItsFor:
          'B2B tech companies that need predictable pipeline growth — not one-off campaigns, but a marketing engine that compounds over time.',
      },
      {
        name: 'Account-Based Marketing',
        slug: 'account-based-marketing',
        tagline: 'Precision over volume. Named accounts, not spray-and-pray.',
        description:
          'Account-based marketing focuses your marketing and sales resources on specific named accounts that represent the highest revenue potential for your business. We build ABM programs that coordinate personalized messaging, targeted channels, and deal-level intelligence across the accounts that actually matter — with tiering models that match investment to opportunity size.',
        deliveryModel: 'Retainer',
        typicalScope: 'Annual programs',
        outcomes: [
          'Target account list with tiering and prioritization criteria',
          'Account-specific messaging and personalized content',
          'Multi-channel orchestration (ads, email, direct mail, events)',
          'Sales enablement materials per account tier',
          'Account engagement scoring and pipeline influence tracking',
        ],
        whoItsFor:
          'Companies with high ACV products selling into enterprise accounts where every deal matters and generic marketing wastes budget.',
      },
      {
        name: 'Marketing Automation & Nurture',
        slug: 'marketing-automation-nurture',
        tagline: 'Systems that nurture, score, and convert — while you sleep.',
        description:
          'Marketing automation and nurture programs turn your marketing technology stack into a revenue machine that moves prospects through the funnel without manual intervention. We design workflows, build scoring logic, and optimize sequences — lifecycle marketing, drip campaigns, and trigger-based programs that make your HubSpot or Marketo actually earn its license fees.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing optimization',
        outcomes: [
          'Lifecycle stage definitions and progression criteria',
          'Automated nurture sequences by persona and funnel stage',
          'Trigger-based workflows for key buyer behaviors',
          'Campaign performance dashboards and conversion tracking',
          'Quarterly optimization based on engagement and conversion data',
        ],
        whoItsFor:
          'Companies that invested in HubSpot, Marketo, or Pardot but aren\'t getting the ROI — because the tool is only as good as the strategy behind it.',
      },
      {
        name: 'Lead Scoring & Routing',
        slug: 'lead-scoring-routing',
        tagline: 'Send the right leads to the right reps at the right time.',
        description:
          'Lead scoring and routing systems ensure that sales teams work the highest-potential opportunities first while marketing continues nurturing everyone else. We build scoring models based on fit (firmographic), behavior (engagement), and intent (buying signals) — with routing logic that matches leads to the right rep, team, or nurture track based on real qualification criteria, not arbitrary thresholds.',
        deliveryModel: 'Project-based + ongoing tuning',
        typicalScope: '4–6 weeks + quarterly reviews',
        outcomes: [
          'Lead scoring model combining fit, behavior, and intent signals',
          'MQL/SQL definitions with clear qualification criteria',
          'Routing rules matching leads to appropriate sales resources',
          'Marketing-sales handoff SLA with response time commitments',
          'Score calibration framework with quarterly review cadence',
        ],
        whoItsFor:
          'Companies where sales complains about lead quality, marketing complains about follow-up speed, and nobody agrees on what a qualified lead actually looks like.',
      },
      {
        name: 'Pipeline Analytics',
        slug: 'pipeline-analytics',
        tagline: 'See what\'s working. Kill what isn\'t.',
        description:
          'Pipeline analytics provides the measurement infrastructure that connects marketing activity to revenue outcomes with clear attribution at every stage of the funnel. We build analytics frameworks that answer the questions executives actually ask — which programs generate pipeline, what\'s the true cost of acquisition, where do deals stall, and what should we invest more in. Data-driven decisions, not gut feelings.',
        deliveryModel: 'Project-based or retainer',
        typicalScope: '4–8 weeks setup + ongoing',
        outcomes: [
          'Marketing attribution model (first-touch, multi-touch, or hybrid)',
          'Pipeline dashboard with conversion rates by stage and source',
          'Revenue forecasting model based on pipeline velocity',
          'Campaign ROI analysis framework',
          'Executive reporting package for board and leadership reviews',
        ],
        whoItsFor:
          'Marketing leaders who need to prove ROI to the board and make data-driven investment decisions — not report on activity metrics that don\'t connect to revenue.',
      },
      {
        name: 'Campaign Operations',
        slug: 'campaign-operations',
        tagline: 'Strategy is worthless without flawless execution.',
        description:
          'Campaign operations is the execution infrastructure that turns marketing strategy into launched, measured, and optimized programs across every channel. We manage the operational complexity of multi-channel B2B campaigns — project management, QA processes, audience segmentation, asset production coordination, and cross-functional workflows — so campaigns launch on time, on brand, and on budget.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'Campaign execution framework with QA checklists and workflows',
          'Cross-channel launch coordination and timing optimization',
          'Audience segmentation and list management processes',
          'Asset production coordination across content, design, and digital',
          'Post-campaign analysis with optimization recommendations',
        ],
        whoItsFor:
          'Marketing teams that have strong strategy but inconsistent execution — campaigns launch late, emails have errors, and nobody owns the operational details.',
      },
    ],
    answerCapsules: [
      {
        question: "What's the difference between demand generation and lead generation?",
        answer:
          'Demand generation creates market awareness and buying intent, while lead generation captures contact information from people already interested — demand gen builds the audience, lead gen harvests it. The most common mistake is investing in lead gen without demand gen, which gives you a database of people who aren\'t ready to buy.',
      },
      {
        question: 'How long does it take for B2B demand generation to produce results?',
        answer:
          'B2B demand generation typically takes 3–6 months to show meaningful pipeline impact, because B2B buying cycles are long and trust compounds over time. Quick wins come from optimizing existing channels and conversion points; sustainable pipeline growth comes from building a system that compounds — content, distribution, and nurture working together.',
      },
      {
        question: 'What is lead scoring and why does it matter for B2B?',
        answer:
          'Lead scoring assigns a numerical value to each prospect based on fit, behavior, and intent signals so sales teams prioritize the highest-potential opportunities first. Without scoring, sales either cherry-picks leads based on gut feeling or wastes time on unqualified contacts — both outcomes leave pipeline on the table.',
      },
      {
        question: 'What is account-based marketing and when should you use it?',
        answer:
          'Account-based marketing focuses resources on specific named accounts instead of broad audiences, ideal for companies with high-ACV products selling into enterprise buyers. ABM works best when your average deal size justifies the per-account investment and your sales team can name the companies they need to close.',
      },
    ],
  },
  {
    name: 'Digital Performance',
    slug: 'digital-performance',
    universe: 'strategic',
    tagline: 'Every dollar accountable. Every channel optimized.',
    description:
      'Paid search, programmatic, SEO, PR, social, and conversion optimization run by people who understand B2B buying cycles — not consumer click-through rates. We optimize for pipeline influence, not impressions.',
    color: '#E1FF00',
    colorName: 'neon-cactus',
    borderClass: 'border-neon-cactus/30',
    services: [
      {
        name: 'Paid Search & Social',
        slug: 'paid-search-social',
        tagline: 'B2B media buying that actually understands B2B.',
        description:
          'Paid search and social advertising for B2B requires a fundamentally different approach than consumer marketing because buying cycles are long, committees are real, and a click rarely equals a customer. We manage Google Ads, LinkedIn Ads, and paid social programs against pipeline metrics — not clicks — with audience strategies built around accounts and buying stages, not demographic guesses.',
        deliveryModel: 'Retainer + media spend',
        typicalScope: 'Ongoing management',
        outcomes: [
          'Channel strategy aligned to buyer journey stages',
          'Campaign architecture with audience segmentation and targeting',
          'Creative development and A/B testing program',
          'Bid strategy optimization and budget allocation',
          'Pipeline-attributed performance reporting',
        ],
        whoItsFor:
          'B2B companies spending on paid media who need strategic management focused on pipeline contribution — not someone pushing buttons in Google Ads and reporting on impressions.',
      },
      {
        name: 'Programmatic & Retargeting',
        slug: 'programmatic-retargeting',
        tagline: 'Stay in front of the accounts that matter.',
        description:
          'Programmatic and retargeting campaigns keep your brand visible to target accounts and engaged prospects throughout the long B2B buying cycle. We build display, native, and account-based advertising programs that use intent data, firmographic targeting, and behavioral signals to reach the right companies at the right time — with creative that reinforces your strategic narrative, not generic brand awareness.',
        deliveryModel: 'Retainer + media spend',
        typicalScope: 'Ongoing management',
        outcomes: [
          'Programmatic strategy with audience targeting and suppression logic',
          'Account-based display advertising for target account lists',
          'Retargeting programs by funnel stage and engagement level',
          'Creative rotation strategy with performance-based optimization',
          'Cross-channel frequency management and attribution',
        ],
        whoItsFor:
          'B2B companies running ABM programs or long-cycle enterprise sales that need to maintain visibility with target accounts between direct touchpoints.',
      },
      {
        name: 'SEO & Technical SEO',
        slug: 'seo-technical-seo',
        tagline: 'Own the search results your buyers actually use.',
        description:
          'SEO for B2B technology companies builds the organic search foundation that captures buyer research intent at every stage of the journey, from problem awareness through vendor evaluation. We combine technical SEO (site architecture, crawlability, Core Web Vitals) with content SEO (keyword strategy, topic clusters, internal linking) to build compounding organic visibility that reduces your cost of acquisition over time.',
        deliveryModel: 'Retainer',
        typicalScope: '6+ months',
        outcomes: [
          'Technical SEO audit with prioritized remediation roadmap',
          'Keyword strategy mapped to buyer journey and content plan',
          'Site architecture optimization for crawl efficiency and topical authority',
          'Content optimization program for existing and new pages',
          'Monthly organic performance reporting with pipeline correlation',
        ],
        whoItsFor:
          'B2B tech companies that want organic search to be a durable acquisition channel — not a line item they hope works while paid media does the heavy lifting.',
      },
      {
        name: 'PR & Analyst Relations',
        slug: 'pr-analyst-relations',
        tagline: 'Coverage you can\'t buy. Credibility you can\'t fake.',
        description:
          'PR and analyst relations programs build the third-party credibility that B2B buyers require before they engage sales, through strategic media placement and analyst firm engagement. We build earned media programs targeting trade publications, industry analysts, and the journalists your buyers and investors actually read — with executive media training, briefing preparation, and crisis readiness built in.',
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
          'B2B tech companies that need market credibility beyond what they can self-publish — especially those entering new categories, raising capital, or targeting analyst report inclusion.',
      },
      {
        name: 'Social Media Management',
        slug: 'social-media-management',
        tagline: 'Build an audience that trusts you before they need you.',
        description:
          'Social media management for B2B builds company and executive presence on the platforms where professional buyers form opinions and make decisions — primarily LinkedIn, but also emerging channels where your industry congregates. We create and manage programs that combine company-level content strategy with executive personal branding, turning social from a content distribution channel into a relationship-building engine.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'Social media strategy with content pillars and publishing cadence',
          'Executive personal branding programs for leadership team',
          'Content creation and community management',
          'Employee advocacy program design and enablement',
          'Engagement analytics and audience growth tracking',
        ],
        whoItsFor:
          'B2B companies that know their buyers are on LinkedIn but haven\'t built a systematic program — or whose executive team has profiles that look like they were last updated in 2019.',
      },
      {
        name: 'Conversion Rate Optimization',
        slug: 'conversion-rate-optimization',
        tagline: 'Get more pipeline from the traffic you already have.',
        description:
          'Conversion rate optimization improves the percentage of website visitors and campaign respondents who take the next meaningful action in your funnel. We run systematic testing programs — landing page optimization, form strategy, CTA design, user experience improvements, and funnel analysis — that compound small gains into significant pipeline increases without spending more on acquisition.',
        deliveryModel: 'Retainer',
        typicalScope: '3+ months',
        outcomes: [
          'Conversion audit with opportunity sizing by funnel stage',
          'Landing page optimization and A/B testing program',
          'Form strategy and progressive profiling implementation',
          'CTA and user flow optimization across key conversion paths',
          'Monthly conversion reporting with revenue impact analysis',
        ],
        whoItsFor:
          'Companies driving meaningful traffic but converting at below-benchmark rates — where improving conversion is higher-ROI than increasing spend on acquisition.',
      },
    ],
    answerCapsules: [
      {
        question: 'How should B2B companies approach paid media differently than B2C?',
        answer:
          'B2B paid media must account for long buying cycles, multi-person buying committees, and the reality that a click rarely equals a customer — optimization targets pipeline influence, not conversions. We manage B2B paid programs against downstream revenue metrics, not the cost-per-click vanity numbers that consumer marketers optimize for.',
      },
      {
        question: 'What role does SEO play for B2B technology companies?',
        answer:
          "SEO builds the organic foundation that captures buyer research intent at every stage of the journey, from problem awareness through vendor evaluation and purchase decision. For B2B tech companies, SEO isn't just about rankings — it's about being present in the research process your buyers go through months before they ever talk to sales.",
      },
      {
        question: "What's the difference between B2B SEO and answer engine optimization?",
        answer:
          'Traditional SEO optimizes for search engine rankings and click-through, while answer engine optimization ensures your content is cited by AI-powered discovery channels like ChatGPT, Perplexity, and Google AI Overviews. Both matter — SEO captures intentional searches, AEO captures the growing share of buyer research that happens through AI assistants.',
      },
      {
        question: 'How do you measure conversion rate optimization success in B2B?',
        answer:
          'CRO success in B2B is measured by pipeline generated per visitor, not just form submission rates — because a higher form fill rate means nothing if the leads don\'t convert to revenue. We track the full funnel from landing page to closed deal, testing changes that improve both volume and quality of pipeline contribution.',
      },
    ],
  },
  {
    name: 'Content & Creative',
    slug: 'content-marketing',
    universe: 'strategic',
    tagline: 'Content that earns attention. Creative that earns trust.',
    description:
      'Content strategy, original research, campaign creative, video, interactive experiences, and brand editorial from a team that has been writing the B2B playbook for 25 years. Not content mills. Strategic content with a point of view — because bland doesn\'t convert.',
    color: '#ED0AD2',
    colorName: 'sprinkles',
    borderClass: 'border-sprinkles/30',
    services: [
      {
        name: 'Content Strategy & Production',
        slug: 'content-strategy-production',
        tagline: 'Strategic content that moves pipeline, not just pageviews.',
        description:
          'Content strategy and production builds a systematic editorial operation that creates content mapped to buyer journey stages, personas, and measurable conversion paths. Every piece serves a strategic purpose — awareness, education, conversion, or retention — and is structured for both human readers and AI-powered discovery channels. We tie content directly to pipeline, not publishing calendars.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing production',
        outcomes: [
          'Content strategy aligned to buyer journey and business goals',
          'Editorial calendar with content-to-campaign mapping',
          'Thought leadership articles, guides, and long-form content',
          'AEO-optimized content architecture for AI search visibility',
          'Content performance and pipeline attribution reporting',
        ],
        whoItsFor:
          'B2B companies that need a real content program — not a blog nobody reads, but a strategic editorial operation that supports pipeline.',
      },
      {
        name: 'Research & Original Data',
        slug: 'research-original-data',
        tagline: 'Own the data your industry cites.',
        description:
          'Research and original data programs produce proprietary insights, benchmark studies, and survey-driven reports that establish your company as the authoritative source in your category. Original research is the highest-ROI content investment in B2B — it generates media coverage, analyst citations, sales enablement assets, and months of derivative content from a single study. We design, execute, and produce the research your market will reference.',
        deliveryModel: 'Project-based',
        typicalScope: '8–12 weeks per study',
        outcomes: [
          'Research design with methodology, sample targeting, and survey instrument',
          'Data collection, analysis, and statistical validation',
          'Flagship research report with executive summary and key findings',
          'Derivative content plan (blog series, infographics, social, webinars)',
          'PR strategy for research launch and ongoing citation building',
        ],
        whoItsFor:
          'Companies that want to own the data their industry cites — because original research builds authority that no amount of opinion content can match.',
      },
      {
        name: 'Campaign Creative & Design',
        slug: 'campaign-creative-design',
        tagline: 'Design that makes B2B look like it gives a damn.',
        description:
          'Campaign creative and design produces the visual and conceptual work that makes B2B marketing memorable in a sea of blue gradients and stock photos. We create campaign concepts, ad creative, landing pages, sales materials, and brand design that stops the scroll and earns attention — because creative quality is a strategic advantage in markets where everyone else looks the same.',
        deliveryModel: 'Project or retainer',
        typicalScope: 'As needed',
        outcomes: [
          'Campaign creative concepts with multi-channel execution',
          'Ad creative for paid social, display, and programmatic',
          'Landing page design optimized for conversion',
          'Sales enablement design (decks, one-pagers, proposals)',
          'Digital asset library for social, email, and web',
        ],
        whoItsFor:
          'B2B companies that are tired of looking like every other tech company — and understand that design is a strategic advantage, not a cost center.',
      },
      {
        name: 'Video & Motion',
        slug: 'video-motion',
        tagline: 'Video that explains, persuades, and converts.',
        description:
          'Video and motion content production creates the visual storytelling assets that B2B buyers increasingly expect throughout the evaluation process. We produce explainer videos, product demos, customer story films, social video series, and motion graphics — with strategic scripts grounded in your messaging framework, not generic corporate video that puts people to sleep.',
        deliveryModel: 'Project-based or retainer',
        typicalScope: 'Per project or monthly',
        outcomes: [
          'Video strategy aligned to buyer journey and distribution channels',
          'Explainer and product overview videos',
          'Customer story and case study films',
          'Social video series for LinkedIn and paid distribution',
          'Motion graphics and animated content for campaigns',
        ],
        whoItsFor:
          'B2B companies that need video content for sales cycles, social presence, and website engagement — but can\'t justify a full in-house production team.',
      },
      {
        name: 'Web & Interactive',
        slug: 'web-interactive',
        tagline: 'Digital experiences that do more than just sit there.',
        description:
          'Web and interactive content creates digital experiences that engage buyers beyond static pages — assessments, calculators, interactive guides, configurators, and diagnostic tools that provide personalized value while generating qualified leads. We design and build interactive content that gives buyers a reason to engage deeply with your brand and share information willingly.',
        deliveryModel: 'Project-based',
        typicalScope: '4–8 weeks per project',
        outcomes: [
          'Interactive content strategy with use case prioritization',
          'Assessment and diagnostic tool design and development',
          'ROI calculators and value estimation tools',
          'Interactive guides and configurators',
          'Lead capture integration and engagement analytics',
        ],
        whoItsFor:
          'Companies that need high-value lead generation assets that provide something in return — because modern buyers won\'t fill out a form for another PDF they\'ll never read.',
      },
      {
        name: 'Brand Editorial',
        slug: 'brand-editorial',
        tagline: 'A distinctive voice that compounds over time.',
        description:
          'Brand editorial programs establish and maintain the distinctive written voice that makes your company recognizable across every touchpoint. We develop voice and tone guidelines, editorial standards, ghostwriting programs, and quality frameworks that ensure everything your company publishes sounds like it comes from the same sharp, opinionated, expert source — whether it\'s a blog post, an email, or a CEO LinkedIn update.',
        deliveryModel: 'Retainer',
        typicalScope: 'Ongoing',
        outcomes: [
          'Brand voice and tone guidelines with examples and anti-examples',
          'Editorial style guide for all content types and channels',
          'Executive ghostwriting program for leadership content',
          'Content quality review framework and editorial standards',
          'Writer onboarding and voice training for internal teams',
        ],
        whoItsFor:
          'Companies whose content sounds different depending on who wrote it — or whose brand voice is described as "professional" because nobody has bothered to define what it actually is.',
      },
    ],
    answerCapsules: [
      {
        question: 'What makes B2B content marketing different from B2C?',
        answer:
          'B2B content marketing must address longer buying cycles, multiple stakeholders, and complex technical decisions, making strategic depth and expertise more important than viral reach. Unlike B2C, where a single piece can drive immediate purchase, B2B content builds trust over months and must speak to different roles in the buying committee.',
      },
      {
        question: 'Why should B2B companies invest in original research?',
        answer:
          'Original research is the highest-ROI content investment in B2B because it generates media coverage, analyst citations, sales enablement assets, and months of derivative content from a single study. Companies that publish proprietary data become the authoritative source their industry cites — building a moat of credibility that opinion content alone cannot create.',
      },
      {
        question: 'What is answer engine optimization for content?',
        answer:
          'Answer engine optimization structures your content so AI-powered search engines can extract, cite, and recommend your expertise as the authoritative answer to buyer questions. Every piece of content we create includes standalone answer capsules — quotable sentences that AI engines can cite directly, giving your brand visibility in ChatGPT, Perplexity, and Google AI Overviews.',
      },
      {
        question: 'How does interactive content generate better B2B leads?',
        answer:
          'Interactive content like assessments, calculators, and diagnostic tools generates higher-quality B2B leads because buyers willingly share detailed information in exchange for personalized value — unlike gated PDFs, which generate email addresses from people who may never read the content. The engagement data from interactive tools also gives sales richer context for follow-up conversations.',
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
          'AI marketing strategy provides a pragmatic transformation roadmap that identifies the highest-impact AI use cases for your marketing organization and builds a realistic implementation plan. We assess your current state, evaluate your team\'s readiness, identify where AI will compound efficiency versus where it will create risk, and build a governance framework that lets you move fast without losing control.',
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
          'AI GTM activation compresses go-to-market timelines and sharpens targeting by building AI-powered execution systems that learn and optimize in real time. We build activation systems that use AI to identify ideal accounts, personalize outreach at scale, and optimize channel mix dynamically — turning your GTM strategy into a live, learning system instead of a static plan.',
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
          'An AI content studio is a custom content generation system trained on your brand voice, messaging frameworks, and domain expertise that produces publication-ready assets across formats at scale. We build content studios that produce blog, social, email, research, and sales enablement content — with human editorial oversight baked into every workflow. Not generic AI slop. Your voice, amplified.',
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
          'An AI design studio produces on-brand visual assets at scale by combining AI-powered generation with your brand guidelines and creative direction. From campaign creative to social graphics to presentation decks — we build design workflows where AI handles production while your team focuses on creative direction. Brand guidelines enforced automatically. No more bottlenecks.',
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
          'Answer engine optimization ensures your brand appears when AI-powered search engines answer your buyers\' questions across ChatGPT, Perplexity, Google AI Overviews, and every LLM-driven discovery channel. We build content architectures with standalone answer capsules, structured data strategies, and semantic markup that make your expertise citable and recommendable by the AI systems increasingly replacing traditional search.',
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
          'An autonomous outbound AI system identifies prospects, crafts personalized sequences, manages cadences, and optimizes based on engagement signals without human bottlenecks slowing the process. We build the system, tune the models, and let it run. Your team handles the conversations that matter while the AI handles the volume that would bury a human SDR team.',
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
          'AI managed services provides ongoing monitoring, optimization, and evolution of your AI marketing systems so they continue performing as models degrade, platforms change, and business needs shift. We keep your AI infrastructure current — model tuning, platform updates, quality monitoring, and strategic roadmap reviews — so your team can focus on strategy while we handle the operations.',
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
    answerCapsules: [
      {
        question: 'How can AI actually transform B2B marketing operations?',
        answer:
          'AI transforms B2B marketing by automating content production, personalizing at scale, optimizing channel mix in real-time, and compressing go-to-market timelines from quarters to weeks. The key is applying AI to the right use cases — not everything benefits from automation, and the highest-value applications combine AI efficiency with human strategic judgment.',
      },
      {
        question: 'What is an AI content engine and how does it work?',
        answer:
          'An AI content engine is a custom system trained on your brand voice, messaging framework, and domain expertise that produces publication-ready content across formats at scale. It\'s not a chatbot generating generic blog posts — it\'s a production system with editorial governance, quality assurance, and brand voice enforcement built into every workflow.',
      },
      {
        question: 'What is answer engine optimization?',
        answer:
          'Answer engine optimization is the practice of structuring content so AI-powered search engines cite your brand as the authoritative answer to buyer questions across platforms like ChatGPT, Perplexity, and Google AI Overviews. Unlike traditional SEO that optimizes for rankings and clicks, AEO optimizes for citation and recommendation — because an increasing share of buyer research never reaches a search results page.',
      },
      {
        question: 'When should a company invest in AI marketing versus traditional approaches?',
        answer:
          "Companies should invest in AI marketing when they need to scale output without scaling headcount, when they're competing on speed-to-market, or when data-driven personalization would materially improve conversion rates. AI isn't a replacement for marketing strategy — it's an accelerant. Companies that try to shortcut strategy with AI tools end up producing bad content faster.",
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
