import type { AnswerCapsule } from '@/lib/services-data';

export type { AnswerCapsule };

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
  answerCapsules: AnswerCapsule[];
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
    answerCapsules: [
      {
        question: 'What makes marketing HR tech different from other B2B categories?',
        answer:
          'HR tech marketing requires navigating compliance-driven buying committees, "future of work" messaging fatigue, and risk-averse HR buyers who demand proof before they\'ll consider a new vendor. With 500+ vendors competing for attention, differentiation depends on category expertise and messaging that speaks to CHROs and IT stakeholders simultaneously.',
      },
      {
        question: 'How do you differentiate an HR tech company in a crowded market?',
        answer:
          'HR tech differentiation starts with positioning that identifies the specific buyer pain point you solve better than anyone — not feature comparisons that blur together across 500 vendors. We build messaging frameworks grounded in 25+ years of HR tech category expertise, focusing on outcomes HR leaders actually care about rather than product capabilities they can\'t evaluate in a demo.',
      },
      {
        question: 'What content strategy works for HR tech buyers?',
        answer:
          'HR tech content must address both the strategic vision of CHROs and the practical concerns of HR directors and IT evaluators who influence the buying decision. We build multi-persona content programs that speak each audience\'s language — thought leadership for executives, technical validation for evaluators, and ROI frameworks for budget holders.',
      },
      {
        question: 'How long is the typical HR tech sales cycle?',
        answer:
          'HR tech sales cycles typically run 6–12 months due to committee-based buying, compliance reviews, and the risk-averse nature of HR decision-makers. Marketing programs must be built for this timeline — nurture sequences, multi-touch attribution, and content that builds trust incrementally rather than trying to close on the first interaction.',
      },
    ],
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
    answerCapsules: [
      {
        question: 'How do you market an enterprise SaaS product when competitors have feature parity?',
        answer:
          'When competitors match your features, differentiation becomes a positioning problem — you win by owning a strategic narrative about outcomes, not by comparing checkbox lists. We build brand positioning that changes how your market categorizes you, shifting the conversation from "which product has more features" to "which company understands our problem."',
      },
      {
        question: 'What does a SaaS company need to scale past the PLG ceiling?',
        answer:
          'Scaling past the product-led growth ceiling requires brand infrastructure and demand generation that self-serve adoption alone cannot provide — most SaaS companies hit this wall between $10M and $50M ARR. The transition requires building awareness programs, ABM for enterprise accounts, and sales enablement that complements your existing PLG motion without replacing it.',
      },
      {
        question: 'How should SaaS companies approach marketing after raising a round?',
        answer:
          'Post-funding SaaS companies should invest in GTM infrastructure that converts capital into predictable pipeline velocity and demonstrable CAC efficiency — not just more ad spend. We build GTM architecture that shows board-level metrics: pipeline contribution, marketing-sourced revenue, and time-to-revenue that justifies the investment.',
      },
      {
        question: 'What demand generation approach works for enterprise SaaS?',
        answer:
          'Enterprise SaaS demand generation must account for 6–10 person buying committees, 6–12 month sales cycles, and the reality that most pipeline is influenced by multiple touches over time. We build full-funnel programs that integrate content, ABM, paid media, and nurture into a system that produces measurable pipeline — not just MQLs that sales ignores.',
      },
    ],
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
    answerCapsules: [
      {
        question: 'How do you market a fintech company against established financial institutions?',
        answer:
          'Fintech companies beat established institutions by positioning speed, transparency, and user experience as strategic advantages — trust is built through demonstrated competence, not legacy brand recognition. We build brand positioning that acknowledges the trust deficit head-on and creates credibility through content, social proof, and thought leadership that resonates with financial decision-makers.',
      },
      {
        question: 'How does compliance affect fintech marketing?',
        answer:
          'Compliance constraints shape every aspect of fintech marketing, from the claims you can make in ad copy to the testimonials you can feature on your website. We build content strategies and campaign frameworks that work within regulatory guardrails — so your marketing team moves fast without triggering compliance review escalations.',
      },
      {
        question: 'What builds trust with fintech buyers?',
        answer:
          'Fintech buyer trust is built through institutional-grade credibility signals: thought leadership from recognized experts, third-party validation, security certifications, and content that demonstrates deep domain expertise. Every marketing touchpoint should reinforce that you take money as seriously as your buyers do — because financial decision-makers evaluate your marketing as a proxy for your operational rigor.',
      },
      {
        question: 'What demand generation strategies work in financial services?',
        answer:
          'Financial services demand generation must account for the trust-building cycle — buyers need multiple credibility signals before they engage with sales, making content marketing and thought leadership essential pipeline drivers. We build multi-touch nurture programs calibrated for the long fintech buying cycle, where every interaction reinforces trust and expertise.',
      },
    ],
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
    answerCapsules: [
      {
        question: 'Why does fear-based cybersecurity marketing fail?',
        answer:
          'Fear-based cybersecurity marketing fails because CISOs and security professionals see through it instantly — they live with real threats daily and resent vendors who exploit anxiety to sell products. Effective security marketing leads with substance: technical credibility, proven capabilities, and content that helps practitioners solve real problems rather than manufacturing panic.',
      },
      {
        question: 'How do you market to both CISOs and business executives?',
        answer:
          'Marketing to CISOs and CFOs simultaneously requires dual-track messaging — technical depth for security practitioners who evaluate capabilities, and business-impact framing for executives who approve budgets. We build messaging frameworks that translate technical differentiation into business outcomes, so each audience gets the information they need in the language they trust.',
      },
      {
        question: 'How do you stand out in a cybersecurity market with new categories every quarter?',
        answer:
          'Standing out in cybersecurity requires positioning that transcends category labels — because categories like XDR, SASE, and CNAPP shift faster than buyers can track them. We help security companies position around the problem they solve and the outcome they deliver, not the acronym they occupy, creating durable differentiation that survives category evolution.',
      },
      {
        question: 'What content marketing approach works for cybersecurity?',
        answer:
          'Cybersecurity content marketing must demonstrate genuine technical expertise — security practitioners immediately dismiss content that reads like marketing repackaged as thought leadership. We build content programs with real technical depth: threat analysis, architecture guidance, and practitioner-focused resources that earn trust with the people who actually evaluate your product.',
      },
    ],
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
    answerCapsules: [
      {
        question: 'How does HIPAA affect healthtech marketing?',
        answer:
          'HIPAA constraints affect healthtech marketing at every level — from the patient data you can reference in case studies to the claims you can make about clinical outcomes in ad copy. We build marketing programs with compliance guardrails baked in, so your team can move fast without waiting on legal review for every piece of content.',
      },
      {
        question: 'How do you market to both clinical and administrative buyers in healthcare?',
        answer:
          'Healthcare marketing must address clinical decision-makers who evaluate efficacy and administrative executives who evaluate ROI — two audiences with fundamentally different priorities and vocabulary. We build dual-track content strategies that speak clinical language to practitioners and business language to the C-suite, with shared proof points that bridge both perspectives.',
      },
      {
        question: 'How long is the typical healthtech sales cycle?',
        answer:
          'Healthtech sales cycles typically run 9–18 months due to clinical validation requirements, compliance reviews, and the inherently risk-averse procurement processes of hospitals and health systems. Marketing programs must sustain engagement over this timeline — multi-touch nurture, clinical evidence content, and relationship-building that compounds trust incrementally.',
      },
      {
        question: 'What demand generation works for healthtech companies?',
        answer:
          'Healthtech demand generation requires a trust-first approach: clinical evidence, peer validation, and thought leadership that demonstrates genuine understanding of healthcare workflows and patient impact. Traditional B2B demand tactics like gated whitepapers and aggressive email cadences tend to backfire with healthcare buyers who prioritize substance over volume.',
      },
    ],
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
    answerCapsules: [
      {
        question: 'How do you market to marketers who know every trick in the book?',
        answer:
          'Marketing to marketers requires radical authenticity — your audience evaluates marketing for a living, so anything that feels manufactured, exaggerated, or derivative will be dismissed immediately. We build programs that lead with genuine substance: original research, honest POVs, and content that earns respect from professionals who can spot a marketing tactic from a mile away.',
      },
      {
        question: 'How do you stand out in a 14,000-vendor MarTech landscape?',
        answer:
          'Standing out in a 14,000-vendor landscape requires category positioning that\'s sharper than "we\'re the best platform for X" — you need to own a specific problem or point of view that makes your company impossible to ignore. We build positioning around the intersection of your genuine differentiation and the specific pain point your best customers would be desperate without you to solve.',
      },
      {
        question: 'How important are analyst relations for MarTech companies?',
        answer:
          'Analyst relations are disproportionately important in MarTech because Gartner Magic Quadrants, Forrester Waves, and G2 reviews directly shape buying decisions more than in almost any other B2B category. We build analyst relations programs that position your company for favorable placement through strategic briefings, customer evidence, and category narrative influence.',
      },
      {
        question: 'What drives growth for MarTech companies beyond paid acquisition?',
        answer:
          'Sustainable MarTech growth comes from community-led advocacy, thought leadership, and product-led expansion — because marketers trust peer recommendations over ads and trust earned attention over bought attention. We build organic growth engines that combine content authority, community cultivation, and customer advocacy into compounding distribution channels.',
      },
    ],
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
    answerCapsules: [
      {
        question: 'Why does traditional marketing fail with developer audiences?',
        answer:
          'Traditional B2B marketing fails with developers because they actively resist being marketed to — gated content, generic nurture emails, and display ads signal that you don\'t understand their world. Developer marketing earns attention through genuine technical value: documentation, tutorials, open-source contributions, and content that helps developers do their job better.',
      },
      {
        question: 'How do you build a developer community that drives growth?',
        answer:
          'Developer communities grow through authentic value exchange — providing technical resources, enabling peer connection, and giving developers a voice in your product direction, not just a branded Slack channel with promotional content. We build community strategies that create genuine advocacy by treating developers as partners rather than leads.',
      },
      {
        question: 'What metrics matter for developer-focused marketing?',
        answer:
          'Developer marketing is measured by activation rates, time-to-value, community engagement, and product-qualified leads — not traditional MQL counts or form fills that developers actively avoid. We build measurement frameworks aligned to how developers actually evaluate and adopt tools: documentation visits, API calls, GitHub stars, and community participation.',
      },
      {
        question: 'How do you compete against open-source alternatives?',
        answer:
          'Competing with open-source requires positioning the value you provide beyond the code — enterprise support, security, compliance, managed hosting, and the time savings of not maintaining infrastructure yourself. We build messaging that respects the open-source ecosystem while clearly articulating why paying customers get outcomes that DIY deployments can\'t match.',
      },
    ],
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
    answerCapsules: [
      {
        question: 'How do you compete with AWS, Azure, and GCP?',
        answer:
          'Competing with hyperscalers requires surgical positioning around the specific advantages they can\'t credibly claim — specialized compliance, performance for specific workloads, simplicity, or vertical expertise. We help cloud infrastructure companies find and own the positioning angles that turn hyperscaler dominance from an obstacle into a foil for your differentiation story.',
      },
      {
        question: 'How do you market cloud infrastructure to both developers and enterprise buyers?',
        answer:
          'Cloud infrastructure requires dual-track go-to-market: developer advocacy that drives bottom-up adoption, and enterprise marketing that wins top-down procurement decisions with CTO offices. We build GTM architecture that coordinates both motions — developer content and community that generates adoption, enterprise positioning and ABM that converts adoption into contracts.',
      },
      {
        question: 'What makes cloud infrastructure marketing different from other B2B?',
        answer:
          'Cloud infrastructure marketing is uniquely technical — your buyers evaluate architecture diagrams, benchmark data, and SLA guarantees before they ever talk to sales, making technical content the primary demand driver. We build marketing programs that lead with genuine technical depth and translate infrastructure capabilities into business outcomes that budget holders understand.',
      },
      {
        question: 'How do you position against hyperscaler price competition?',
        answer:
          'Positioning against hyperscaler pricing means reframing the conversation from unit cost to total value — specialized performance, reduced complexity, faster time-to-production, and the hidden costs of hyperscaler lock-in. We build messaging frameworks that help cloud companies escape price competition by owning a value narrative that hyperscaler pricing calculators can\'t capture.',
      },
    ],
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
    answerCapsules: [
      {
        question: 'How do you differentiate an AI company when everyone claims AI?',
        answer:
          'AI differentiation requires proving real capabilities through technical demonstrations, customer evidence, and content that shows you understand the engineering challenges — not just repeating "AI-powered" in your marketing copy. We build positioning that separates genuine AI companies from the hype by grounding claims in specific use cases, measurable outcomes, and technical transparency.',
      },
      {
        question: 'How do you build trust with AI buyers who are skeptical of hype?',
        answer:
          'AI buyer trust is built through demonstrated expertise, transparent technical content, and customer evidence that shows real production results — because years of overpromised AI marketing have made technical buyers deeply skeptical. We build thought leadership programs that position your team as genuine practitioners, not AI tourists repeating buzzwords.',
      },
      {
        question: 'What marketing challenges are unique to AI/ML platform companies?',
        answer:
          'AI/ML platform companies face rapid market evolution, open-source competition, enterprise governance concerns, and the constant challenge of proving technical claims to skeptical buyers. Marketing must evolve as fast as the technology — positioning that worked last quarter may be obsolete this quarter as new models, frameworks, and competitive dynamics emerge.',
      },
      {
        question: 'How do you market AI to enterprise buyers with governance concerns?',
        answer:
          'Enterprise AI marketing must address governance, security, and compliance head-on — treating these concerns as legitimate requirements rather than obstacles to overcome with clever messaging. We build content strategies that proactively answer governance questions, demonstrate compliance capabilities, and position responsible AI practices as a competitive advantage.',
      },
    ],
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
