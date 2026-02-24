export interface Industry {
  name: string;
  slug: string;
  color: string;
  colorName: string;
  tagline: string;
  description: string;
  marketContext: string;
  painPoints: string[];
  howWeHelp: string[];
  relevantServiceSlugs: string[];
  notableClients: string[];
  buyerTitle: string;
  stat: { value: string; label: string };
}

export const INDUSTRIES: Industry[] = [
  {
    name: 'HR Tech',
    slug: 'hr-tech',
    color: '#ED0AD2',
    colorName: 'sprinkles',
    tagline: 'We built our reputation in this space.',
    description:
      'HR technology is where The Starr Conspiracy started and where our expertise runs deepest. From talent acquisition platforms to HCM suites to workforce management tools — we understand the buyers, the category dynamics, and the competitive landscape from the inside.',
    marketContext:
      'HR tech is a $40B+ market with 500+ vendors fighting for the attention of HR leaders who are overwhelmed, skeptical, and tired of "future of work" promises that never materialize.',
    painPoints: [
      'Crowded category with 500+ vendors makes differentiation nearly impossible',
      '"Future of work" messaging fatigue — buyers have heard every pitch',
      'Compliance-driven buying creates long, committee-heavy sales cycles',
      'Talent acquisition vs. talent management positioning confusion',
      'HR buyers are risk-averse — they need proof, not promises',
      'Category consolidation means your positioning shifts quarterly',
    ],
    howWeHelp: [
      'Deep category expertise eliminates the agency learning curve — we already know your competitive landscape',
      'Positioning frameworks built from 25+ years inside HR tech, not borrowed from consumer playbooks',
      'Demand generation programs tuned for long, committee-driven HR buying cycles',
      'Content that speaks to CHROs, HR directors, and IT stakeholders simultaneously',
      'AI-powered content engines trained on HR tech terminology and buyer psychology',
      'Brand strategy that cuts through "future of work" noise with substance',
    ],
    relevantServiceSlugs: ['brand-strategy', 'demand-generation', 'content-marketing', 'ai-marketing'],
    notableClients: ['ADP', 'Oracle', 'Korn Ferry', 'Indeed', 'ZipRecruiter', 'Ceridian', 'Cornerstone OnDemand', 'Gusto'],
    buyerTitle: 'CHRO / VP of HR',
    stat: { value: '25+', label: 'Years in HR tech marketing' },
  },
  {
    name: 'Enterprise SaaS',
    slug: 'enterprise-saas',
    color: '#FF5910',
    colorName: 'atomic-tangerine',
    tagline: 'You can\'t out-feature your way to growth.',
    description:
      'Every SaaS company says "better, faster, cheaper." Differentiation is the hardest problem in enterprise software, and product-led growth only gets you so far. Scaling past the $10M ARR plateau requires real brand and demand infrastructure — not more feature comparison tables.',
    marketContext:
      'Enterprise SaaS is a crowded, well-funded arena where the difference between category leader and also-ran often comes down to positioning and go-to-market execution, not product capabilities.',
    painPoints: [
      'Feature parity makes differentiation a positioning problem, not a product problem',
      'PLG ceiling — self-serve growth stalls without brand and demand gen support',
      'Long enterprise sales cycles with 6-10 stakeholder buying committees',
      'Post-funding pressure to show pipeline velocity and CAC efficiency',
      'Constant category creation and redefinition by analysts and competitors',
      'Churn reduction requires marketing beyond acquisition — retention messaging matters',
    ],
    howWeHelp: [
      'Brand positioning that differentiates on strategy, not features',
      'GTM architecture for companies at growth inflection points — Series A through IPO',
      'Full-funnel demand programs that move pipeline, not just MQLs',
      'ABM programs for companies selling $100K+ ACV into named accounts',
      'AI-powered content engines that scale thought leadership without scaling headcount',
      'Digital performance optimized for B2B buying cycles, not consumer metrics',
    ],
    relevantServiceSlugs: ['gtm-strategy', 'demand-generation', 'digital-performance', 'ai-marketing'],
    notableClients: ['ServiceNow', 'Zendesk', 'Medallia', 'Infor'],
    buyerTitle: 'CMO / VP Marketing',
    stat: { value: '3,000+', label: 'B2B tech companies served' },
  },
  {
    name: 'FinTech',
    slug: 'fintech',
    color: '#E1FF00',
    colorName: 'neon-cactus',
    tagline: 'Trust is the product. Marketing is how you earn it.',
    description:
      'FinTech buyers don\'t take risks with their money infrastructure. Every marketing asset, every claim, every piece of content is weighed against a simple question: "Can I trust this company?" We build marketing programs that earn that trust at scale — within the constraints of a regulated industry.',
    marketContext:
      'FinTech is growing fast but trust remains the core barrier. Traditional finance incumbents have awareness and credibility; fintech companies have to earn both while navigating compliance constraints that limit what marketing can say and how.',
    painPoints: [
      'Trust deficit against established financial institutions with century-old brands',
      'Compliance and regulatory constraints on marketing claims and content',
      'Long buying cycles where every stakeholder needs risk assurance',
      'Technical buyers who demand substance over marketing polish',
      'Investor pressure for growth metrics that justify valuations',
      'Security and data handling concerns dominate every buyer conversation',
    ],
    howWeHelp: [
      'Brand positioning that builds institutional-grade trust for challenger companies',
      'Compliance-aware content marketing that stays within regulatory guardrails',
      'Demand generation programs built for the long, trust-building sales cycle',
      'Thought leadership that establishes credibility with CFOs and finance teams',
      'Digital performance that respects the nuance of financial services messaging',
      'AI content systems with guardrails for regulated industries',
    ],
    relevantServiceSlugs: ['brand-strategy', 'content-marketing', 'digital-performance', 'demand-generation'],
    notableClients: ['SoFi', 'Equifax', 'DailyPay', 'Bank of America'],
    buyerTitle: 'CMO / Head of Growth',
    stat: { value: '$2T+', label: 'Global fintech market by 2028' },
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    color: '#73F5FF',
    colorName: 'tidal-wave',
    tagline: 'FUD is dead. Substance wins.',
    description:
      'The cybersecurity market has been poisoned by fear-based marketing and acronym soup. Technical buyers see through it instantly. We help cybersecurity companies position their actual differentiation for both technical evaluators and business decision-makers — without resorting to FUD.',
    marketContext:
      'Cybersecurity is a $200B+ market where new categories emerge quarterly (XDR, SASE, CNAPP, ASPM) and every vendor claims "AI-powered security." Buyer skepticism is at an all-time high, and genuine differentiation requires substance over scare tactics.',
    painPoints: [
      'FUD marketing has destroyed buyer trust across the category',
      'Constant category creation makes positioning a moving target',
      'Technical buyers who see through "AI-powered" claims immediately',
      'Dual audience: technical evaluators and business budget holders',
      'Security fatigue among CISOs drowning in vendor noise',
      'Competitive displacement requires proof of concept, not proof of marketing',
    ],
    howWeHelp: [
      'Positioning that speaks to CISOs and CFOs in their respective languages',
      'Content marketing with genuine technical depth, not recycled threat reports',
      'Thought leadership programs that establish authority with security practitioners',
      'Demand gen calibrated for the security buyer\'s evaluation process',
      'Brand strategy that cuts through acronym soup with clear differentiation',
      'AI content systems trained on security domain expertise',
    ],
    relevantServiceSlugs: ['brand-strategy', 'content-marketing', 'demand-generation', 'ai-marketing'],
    notableClients: ['Bitwarden'],
    buyerTitle: 'CISO / VP Security',
    stat: { value: '$200B+', label: 'Global cybersecurity market' },
  },
  {
    name: 'HealthTech',
    slug: 'healthtech',
    color: '#FFBDAE',
    colorName: 'fing-peachy',
    tagline: 'Healthcare moves slowly. Your marketing shouldn\'t.',
    description:
      'Healthcare buyers are conservative by nature and regulation. HIPAA compliance affects everything, including how you market. We build marketing programs that speak to both clinical decision-makers and C-suite executives — navigating the regulatory landscape without sacrificing urgency or creativity.',
    marketContext:
      'HealthTech is a high-growth market constrained by long buying cycles, clinical validation requirements, and compliance obligations that touch every piece of marketing content. Winners are the companies that build trust systematically while moving faster than incumbents.',
    painPoints: [
      'HIPAA and regulatory constraints affect every marketing decision',
      'Clinical buyers require evidence-based messaging, not marketing-speak',
      'Dual audience: clinical stakeholders and administrative C-suite',
      'Hospital and health system procurement processes are glacially slow',
      'Trust and patient safety concerns dominate every buying conversation',
      'Competitive landscape includes both startups and massive health system incumbents',
    ],
    howWeHelp: [
      'Brand positioning for companies selling into both clinical and administrative buyers',
      'Compliance-aware content strategies that navigate healthcare marketing regulations',
      'Demand generation tuned for the health system buying process',
      'Thought leadership that establishes clinical and operational credibility',
      'ABM programs targeting specific health systems and IDNs',
      'AI content engines with healthcare-specific compliance guardrails',
    ],
    relevantServiceSlugs: ['brand-strategy', 'demand-generation', 'content-marketing', 'ai-marketing'],
    notableClients: ['Fitbit', 'Headspace', 'Virgin Pulse'],
    buyerTitle: 'CTO / VP Digital Health',
    stat: { value: '$500B+', label: 'Global healthtech market by 2027' },
  },
  {
    name: 'MarTech',
    slug: 'martech',
    color: '#088BA0',
    colorName: 'hurricane-sky',
    tagline: 'Marketing to marketers is the ultimate meta-game.',
    description:
      'Your buyers know every trick in the book because they wrote half of it. MarTech companies face the unique challenge of marketing to professionals who evaluate marketing for a living. We know what earns their attention and what gets deleted — because we are them.',
    marketContext:
      'The MarTech landscape has 14,000+ vendors and counting. Buyer fatigue is real. Marketers are skeptical of marketing. The companies that win are the ones that demonstrate genuine value before the first sales call, not the ones with the biggest ad budget.',
    painPoints: [
      'Your buyers are marketing professionals who see through every tactic',
      '14,000+ vendors in the landscape means extreme noise and category confusion',
      'MarTech fatigue — buyers assume your product is another shiny object',
      'Free trials and PLG mean your marketing has to drive adoption, not just awareness',
      'Integration ecosystem positioning is critical but hard to communicate clearly',
      'Analyst influence (Gartner, Forrester, G2) shapes buying more than most verticals',
    ],
    howWeHelp: [
      'Positioning that earns respect from marketing professionals, not eye rolls',
      'Content marketing with the depth and nuance that marketers demand',
      'Analyst relations and category positioning for Magic Quadrant and Wave placement',
      'Community-led growth strategies that build authentic advocacy',
      'Demand gen programs that respect the marketer\'s evaluation process',
      'Brand differentiation in a 14,000-vendor landscape',
    ],
    relevantServiceSlugs: ['brand-strategy', 'content-marketing', 'digital-performance', 'demand-generation'],
    notableClients: [],
    buyerTitle: 'CMO / VP Marketing Ops',
    stat: { value: '14,000+', label: 'Vendors in the MarTech landscape' },
  },
  {
    name: 'DevTools',
    slug: 'devtools',
    color: '#73F5FF',
    colorName: 'tidal-wave',
    tagline: 'Developers hate being marketed to. So don\'t.',
    description:
      'Developer marketing has its own rules. Developers despise hype, ignore display ads, and trust peer recommendations over analyst reports. We build marketing programs that earn developer trust through substance — technical content, community engagement, and authentic value delivery.',
    marketContext:
      'The developer tools market is driven by bottom-up adoption, community signals, and technical credibility. Traditional demand gen tactics actively repel your best prospects. Winners invest in developer experience, community, and content that genuinely helps.',
    painPoints: [
      'Developers actively resist traditional marketing — ads and gated content backfire',
      'Bottom-up adoption means marketing to individual contributors, not executives',
      'Community-led growth is essential but hard to manufacture authentically',
      'Technical content requires genuine domain expertise, not marketing repackaging',
      'PLG metrics (activation, retention) matter more than MQL counts',
      'Open source competitors change the competitive dynamic entirely',
    ],
    howWeHelp: [
      'Developer-native content strategies built on technical substance, not marketing fluff',
      'Community growth programs that earn authentic developer advocacy',
      'PLG marketing infrastructure: activation flows, onboarding sequences, retention programs',
      'Technical thought leadership that positions your team as genuine experts',
      'Developer relations strategy and event presence',
      'AI-powered content systems that maintain technical accuracy at scale',
    ],
    relevantServiceSlugs: ['content-marketing', 'digital-performance', 'brand-strategy', 'ai-marketing'],
    notableClients: [],
    buyerTitle: 'VP Engineering / CTO',
    stat: { value: '27M+', label: 'Professional developers worldwide' },
  },
  {
    name: 'Cloud Infrastructure',
    slug: 'cloud-infrastructure',
    color: '#FF5910',
    colorName: 'atomic-tangerine',
    tagline: 'Competing with hyperscalers requires surgical positioning.',
    description:
      'Cloud infrastructure companies face a unique competitive reality: you\'re building in the shadow of AWS, Azure, and GCP. Winning requires articulating technical differentiation in business terms that resonate with both architects and CFOs — and finding the positioning angles the hyperscalers can\'t credibly claim.',
    marketContext:
      'The cloud infrastructure market is dominated by three hyperscalers who control 65%+ of spend. Independent cloud companies win by owning specific niches — compliance, performance, simplicity, or vertical specialization — and communicating that advantage clearly.',
    painPoints: [
      'Competing against hyperscalers with virtually unlimited marketing budgets',
      'Technical differentiation is narrow and hard to communicate in business terms',
      'Multi-cloud narrative must be credible, not just aspirational',
      'Enterprise sales cycles are 6-12+ months with infrastructure committee review',
      'Developer adoption vs. enterprise procurement creates dual-track GTM',
      'Price competition with hyperscalers is a losing strategy',
    ],
    howWeHelp: [
      'Brand positioning that identifies and owns the angles hyperscalers can\'t claim',
      'Technical-to-business translation in messaging frameworks',
      'ABM programs targeting enterprise infrastructure decision-makers',
      'Developer marketing combined with enterprise demand generation',
      'Content strategies that establish category authority in specific niches',
      'GTM architecture for dual-track (developer + enterprise) go-to-market',
    ],
    relevantServiceSlugs: ['brand-strategy', 'demand-generation', 'gtm-strategy', 'ai-marketing'],
    notableClients: [],
    buyerTitle: 'CTO / VP Infrastructure',
    stat: { value: '$600B+', label: 'Global cloud market by 2028' },
  },
  {
    name: 'AI/ML Platforms',
    slug: 'ai-ml-platforms',
    color: '#E1FF00',
    colorName: 'neon-cactus',
    tagline: 'We\'re AI-native. We get it.',
    description:
      'Every company claims AI. Buyer skepticism is peaking. The companies that win will be the ones who can prove real capabilities, demonstrate genuine value, and build trust in a market drowning in hype. We\'re AI-native ourselves — we understand the technology, the market dynamics, and the buyer psychology.',
    marketContext:
      'The AI/ML platform market is the hottest and most confused category in enterprise technology. Differentiation requires proving real technical capabilities against a backdrop of "AI-powered" marketing noise. Buyers are simultaneously excited and deeply skeptical.',
    painPoints: [
      'Every competitor claims "AI-powered" — genuine differentiation is nearly impossible',
      'Buyer skepticism at all-time highs after years of AI hype cycles',
      'Technical buyers demand proof of capabilities, not marketing claims',
      'Rapid market evolution means positioning needs constant recalibration',
      'Open-source alternatives create competitive pressure on pricing and value',
      'Enterprise AI governance concerns slow buying decisions',
    ],
    howWeHelp: [
      'Brand positioning that proves real capabilities against a backdrop of hype',
      'Technical content marketing that demonstrates genuine expertise',
      'AI transformation messaging that earns trust from skeptical buyers',
      'Demand gen programs for both technical evaluators and business sponsors',
      'Thought leadership programs positioning your team as genuine AI practitioners',
      'We use AI to build AI marketing — we\'re credible because we practice what we preach',
    ],
    relevantServiceSlugs: ['brand-strategy', 'ai-marketing', 'content-marketing', 'demand-generation'],
    notableClients: [],
    buyerTitle: 'CTO / VP AI/ML',
    stat: { value: '$300B+', label: 'Global AI market by 2027' },
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((ind) => ind.slug === slug);
}

export function getRelatedIndustries(currentSlug: string, count = 3): Industry[] {
  const current = INDUSTRIES.findIndex((ind) => ind.slug === currentSlug);
  // Return industries adjacent in the list (wrap around), skipping the current one
  const others = INDUSTRIES.filter((ind) => ind.slug !== currentSlug);
  // Rotate so the next ones after current come first
  const rotated = [...others.slice(current >= others.length ? 0 : current), ...others.slice(0, current >= others.length ? 0 : current)];
  return rotated.slice(0, count);
}
