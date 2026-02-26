import type { AnswerCapsule } from '@/lib/services-data';

export type { AnswerCapsule };

export interface Industry {
  name: string;
  slug: string;
  group: 'hr-tech' | 'adjacent';
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
  // ───────────────────────────────────────────
  // HR Tech Sub-Verticals (10)
  // ───────────────────────────────────────────
  {
    name: 'Talent Acquisition & Recruiting',
    slug: 'talent-acquisition',
    group: 'hr-tech',
    color: '#ED0AD2',
    colorName: 'sprinkles',
    tagline: 'We\'ve marketed more recruiting tech than any agency on Earth.',
    description:
      'With 109 recruiting technology clients and counting, TSC has positioned, launched, and scaled more TA platforms than any agency in the world. From enterprise ATS to AI sourcing to candidate experience — we know the buyers, the objections, and the competitive landscape cold.',
    marketContext:
      'Talent acquisition technology is a fiercely competitive market where ATS platforms, sourcing tools, CRMs, assessment providers, and AI-powered matching engines all compete for the same HR and TA leader budget. Differentiation requires category expertise that most generalist agencies simply cannot provide.',
    painPoints: [
      'ATS market saturation — dozens of platforms with near-identical feature sets',
      'AI sourcing hype has eroded buyer trust in technical claims',
      'TA leaders are overwhelmed by vendor noise and conference-circuit pitches',
      'Recruiting tech buying committees include HR, IT, and procurement stakeholders',
      'Enterprise vs. SMB positioning requires fundamentally different GTM motions',
      'Candidate experience messaging must resonate with both employers and job seekers',
    ],
    howWeHelp: [
      'Positioning built on 109 TA tech engagements — we already know your competitive set',
      'Messaging frameworks that speak to TA leaders, CHROs, and IT evaluators simultaneously',
      'Demand generation tuned for the 6–12 month enterprise recruiting tech sales cycle',
      'Content strategies grounded in actual recruiting workflows and buyer pain points',
      'AI content engines trained on talent acquisition terminology and buyer psychology',
      'Brand strategy that cuts through "AI-powered recruiting" noise with substance',
    ],
    relevantServiceSlugs: ['brand-strategy', 'demand-generation', 'content-marketing', 'ai-marketing'],
    notableClients: ['Indeed', 'iCIMS', 'ZipRecruiter', 'Greenhouse', 'SmartRecruiters', 'HireVue', 'CareerBuilder', 'Jobvite'],
    buyerTitle: 'VP Talent Acquisition / CHRO',
    stat: { value: '109', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market recruiting technology in a saturated ATS market?',
        answer:
          'Marketing recruiting technology requires positioning that transcends feature comparisons — because ATS platforms have reached near-parity on core capabilities and buyers can\'t tell vendors apart. We build messaging frameworks grounded in 109 TA tech engagements that identify the specific buyer pain point you solve better than anyone, shifting the conversation from product demos to business outcomes.',
      },
      {
        question: 'What makes marketing talent acquisition software different from other HR tech?',
        answer:
          'Talent acquisition marketing is unique because it must resonate with both employers buying the platform and candidates experiencing it — two audiences with fundamentally different needs. TA buyers also face extreme vendor fatigue from conference-circuit pitching, making trust-building content and peer validation more important than in any other HR tech category.',
      },
      {
        question: 'How do you differentiate a recruiting platform when AI sourcing claims are everywhere?',
        answer:
          'Differentiating AI recruiting tools requires proving real capabilities through customer evidence and technical transparency — because years of overpromised "AI-powered" claims have made TA leaders deeply skeptical. We position AI recruiting companies around measurable outcomes (time-to-fill, quality-of-hire, sourcing efficiency) rather than technology buzzwords that buyers have learned to ignore.',
      },
      {
        question: 'What demand generation strategies work for enterprise recruiting technology?',
        answer:
          'Enterprise recruiting technology demand generation must account for 6–12 month sales cycles with buying committees that span HR, IT, and procurement stakeholders. We build multi-touch programs that combine TA-specific thought leadership, ABM for target accounts, and nurture sequences calibrated for how enterprise HR teams actually evaluate and purchase technology.',
      },
    ],
  },
  {
    name: 'Learning & Development',
    slug: 'learning-development',
    group: 'hr-tech',
    color: '#73F5FF',
    colorName: 'tidal-wave',
    tagline: 'If you build learning tech, you need an agency that learns fast.',
    description:
      'Corporate learning is a category where the science of how adults learn and the reality of how companies buy technology collide. TSC has worked with 76 L&D technology companies — from enterprise LMS platforms to skills-based learning to VR training — and we understand both sides of that equation.',
    marketContext:
      'The corporate learning market is being reshaped by skills-based talent strategies, AI-powered personalization, and the shift from compliance-driven training to continuous development. L&D buyers are sophisticated, skeptical of vendor claims about "engagement" and "outcomes," and increasingly accountable for proving business impact.',
    painPoints: [
      'LMS commoditization makes differentiation a positioning problem, not a feature problem',
      '"Engagement" and "learner experience" claims have become meaningless differentiators',
      'L&D buyers demand evidence of business impact, not course completion rates',
      'Skills-based learning is reshaping the category faster than most vendors can pivot',
      'CLOs and L&D directors face shrinking budgets with expanding expectations',
      'Content marketplace competition blurs the line between platforms and publishers',
    ],
    howWeHelp: [
      'Positioning that separates your platform from the LMS commodity pack',
      'Content marketing that demonstrates genuine understanding of learning science',
      'Demand gen programs built for L&D buyers who evaluate tools against business outcomes',
      'Thought leadership that positions your team as learning experts, not just technologists',
      'Brand strategy that navigates the skills-based learning shift with authority',
      'AI-powered content engines trained on corporate learning terminology and buyer psychology',
    ],
    relevantServiceSlugs: ['brand-strategy', 'content-marketing', 'demand-generation', 'gtm-strategy'],
    notableClients: ['Coursera', 'Udemy', 'MasterClass', 'Degreed', 'Docebo', 'Instructure', '360Learning', 'OpenSesame'],
    buyerTitle: 'CLO / VP Learning & Development',
    stat: { value: '76', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market a learning management system in a commoditized market?',
        answer:
          'Marketing an LMS in a commoditized market requires positioning around the specific learning outcomes and business impact your platform delivers — not feature checklists that blur together across dozens of competitors. We build brand positioning grounded in 76 L&D tech engagements that identify the strategic narrative your platform can own, shifting the conversation from "what it does" to "what it changes."',
      },
      {
        question: 'What marketing challenges are unique to corporate learning technology?',
        answer:
          'Corporate learning technology marketing faces the unique challenge of proving business impact in a category where most vendors still talk about engagement metrics and course completions that executives don\'t care about. L&D buyers are increasingly accountable for demonstrating ROI to the C-suite, which means your marketing must speak the language of business outcomes, not learning theory.',
      },
      {
        question: 'How do you reach L&D buyers who are skeptical of vendor engagement claims?',
        answer:
          'Reaching skeptical L&D buyers requires content and messaging that demonstrates genuine understanding of learning science and adult development — not recycled claims about "engaging experiences" that every vendor makes. We build thought leadership programs that position your team as credible learning practitioners, earning trust through substance rather than marketing polish.',
      },
      {
        question: 'How is skills-based learning changing L&D technology marketing?',
        answer:
          'Skills-based learning is fundamentally reshaping L&D technology marketing because it shifts the value proposition from training delivery to talent strategy — making your platform a C-suite conversation rather than an HR tools discussion. Companies that position around skills taxonomy, internal mobility, and workforce planning gain access to strategic budgets that traditional LMS vendors never reach.',
      },
    ],
  },
  {
    name: 'Employee Engagement & Recognition',
    slug: 'employee-engagement',
    group: 'hr-tech',
    color: '#FF5910',
    colorName: 'atomic-tangerine',
    tagline: 'Culture isn\'t a feature. It\'s a positioning problem.',
    description:
      'Every engagement platform promises to "transform company culture." Fifty-seven of them hired us to figure out how to actually say something different. The engagement and recognition category is crowded, emotional, and resistant to traditional B2B playbooks — which is exactly why you need an agency that\'s been inside it for decades.',
    marketContext:
      'Employee engagement and recognition technology is an emotionally driven market where every vendor claims to improve culture, boost retention, and make employees happier. The challenge is that these promises are nearly impossible to differentiate — and increasingly, CHROs demand ROI proof that engagement spend actually moves business metrics.',
    painPoints: [
      'Every competitor promises to "transform culture" — messaging has become meaningless',
      'ROI attribution for engagement tools is notoriously difficult to prove',
      'HR buyers are skeptical after investing in platforms that didn\'t move the needle',
      'Remote/hybrid work has reshifted engagement priorities faster than vendors can pivot',
      'Recognition platforms compete with simple, free alternatives built into collaboration tools',
      'Consolidation pressure as HCM suites add native engagement features',
    ],
    howWeHelp: [
      'Brand positioning that cuts through "culture transformation" noise with specific, provable claims',
      'Messaging frameworks built for the emotional complexity of engagement buying decisions',
      'Demand gen programs that address ROI skepticism head-on with business-impact evidence',
      'Content strategies that speak to both HR practitioners and CFOs approving the budget',
      'Competitive positioning against HCM suite consolidation threats',
      'AI content engines trained on engagement and recognition buyer psychology',
    ],
    relevantServiceSlugs: ['brand-strategy', 'demand-generation', 'content-marketing', 'gtm-strategy'],
    notableClients: ['Workhuman', 'Culture Amp', 'O.C. Tanner', 'Achievers', 'Perceptyx', 'Bonusly', 'Quantum Workplace', 'Reward Gateway'],
    buyerTitle: 'CHRO / VP People & Culture',
    stat: { value: '57', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you differentiate an employee engagement platform when every vendor promises culture transformation?',
        answer:
          'Differentiating an engagement platform requires abandoning generic "culture transformation" messaging in favor of specific, provable outcomes that CHROs can tie to business metrics. We build positioning that identifies the narrow, defensible claim your platform can own — whether it\'s manager effectiveness, retention in specific roles, or recognition-driven performance gains — and makes that claim impossible to ignore.',
      },
      {
        question: 'How do you prove ROI for employee engagement technology?',
        answer:
          'Proving engagement technology ROI requires connecting platform usage to business metrics like retention costs, productivity gains, and manager effectiveness scores — not just survey participation rates. We build marketing programs that lead with ROI evidence, helping your sales team answer the CFO\'s question before it\'s asked: "What does this actually do for the business?"',
      },
      {
        question: 'How has remote work changed employee engagement technology marketing?',
        answer:
          'Remote and hybrid work has fundamentally changed engagement marketing by shifting buyer priorities from office-centric programs to distributed connection, asynchronous recognition, and digital culture-building at scale. Companies that reposition around the new reality of distributed work — rather than retrofitting pre-pandemic messaging — are winning the engagement budgets that have actually grown since 2020.',
      },
      {
        question: 'How should engagement platforms compete with HCM suites adding native features?',
        answer:
          'Competing with HCM suite engagement features requires positioning your depth of specialization against their breadth of mediocrity — because built-in engagement tools rarely match the sophistication of purpose-built platforms. We help engagement companies articulate the specific capabilities, analytics depth, and behavioral science foundation that "good enough" HCM features cannot replicate.',
      },
    ],
  },
  {
    name: 'Core HCM & HR Platforms',
    slug: 'core-hcm',
    group: 'hr-tech',
    color: '#E1FF00',
    colorName: 'neon-cactus',
    tagline: 'The platform wars are won on positioning, not product.',
    description:
      'Core HCM is the most contested territory in HR tech — and we\'ve been in the middle of it since day one. With 42 HCM platform clients including ADP, Oracle, and SAP/SuccessFactors, we understand the enterprise buying dynamics, the competitive chess matches, and the positioning levers that actually move market share.',
    marketContext:
      'The core HCM market is dominated by a handful of mega-vendors with massive installed bases, surrounded by mid-market challengers trying to carve out defensible positions. Buying decisions are high-stakes, multi-year commitments that involve HR, IT, finance, and procurement — making positioning and trust the ultimate competitive weapons.',
    painPoints: [
      'Competing against entrenched incumbents with decades-old customer relationships',
      'Feature parity across platforms makes technical differentiation nearly impossible',
      'Multi-stakeholder buying committees slow deals and require parallel messaging tracks',
      'Platform consolidation vs. best-of-breed debates dominate every evaluation',
      'Implementation fear is as big a barrier as product concerns',
      'Cloud migration messaging is stale but still relevant for legacy replacement deals',
    ],
    howWeHelp: [
      'Enterprise positioning built on 42 HCM platform engagements — we know your competitive set from the inside',
      'Multi-stakeholder messaging frameworks that address HR, IT, and CFO concerns simultaneously',
      'Demand gen programs calibrated for 12–18 month enterprise HCM sales cycles',
      'Competitive displacement strategies against entrenched incumbents',
      'Content that de-risks the implementation decision as much as the product decision',
      'Brand strategy that transcends feature comparison and wins on strategic narrative',
    ],
    relevantServiceSlugs: ['brand-strategy', 'gtm-strategy', 'demand-generation', 'content-marketing'],
    notableClients: ['ADP', 'Oracle', 'SAP/SuccessFactors', 'Ceridian', 'Ultimate Software', 'Kronos', 'Cornerstone OnDemand', 'INFOR'],
    buyerTitle: 'CHRO / CIO',
    stat: { value: '42', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market a core HCM platform against entrenched competitors?',
        answer:
          'Marketing against entrenched HCM competitors requires positioning that reframes the evaluation criteria in your favor — because you will not win a feature-by-feature comparison against a platform with a 20-year head start. We build competitive displacement strategies that identify the specific pain points incumbents create and position your platform as the strategic alternative.',
      },
      {
        question: 'How long is the typical enterprise HCM buying cycle and how does marketing support it?',
        answer:
          'Enterprise HCM buying cycles typically run 12–18 months with evaluation committees spanning HR, IT, finance, and procurement stakeholders. Marketing must sustain multi-threaded engagement across all of these personas simultaneously — technical content for IT evaluators, ROI frameworks for CFOs, transformation narratives for CHROs, and implementation confidence for project sponsors.',
      },
      {
        question: 'How do you position an HCM platform in the consolidation vs. best-of-breed debate?',
        answer:
          'Positioning in the consolidation debate depends on which side you\'re on — suites must articulate the total cost and complexity savings of a unified platform, while specialists must prove that depth of capability justifies maintaining point solutions. We help HCM companies own their side of this argument with evidence-based positioning that addresses the buyer\'s real concern: risk.',
      },
      {
        question: 'What content strategy works for HCM platform companies?',
        answer:
          'HCM content strategy must address both the strategic vision that CHROs use to justify the investment and the operational concerns that HR directors use to evaluate the technology. We build dual-track content programs with transformation-level thought leadership for executive audiences and practical, implementation-focused resources for the evaluators who control the shortlist.',
      },
    ],
  },
  {
    name: 'Employee Health & Wellbeing',
    slug: 'employee-wellbeing',
    group: 'hr-tech',
    color: '#34D399',
    colorName: 'emerald',
    tagline: 'Wellbeing tech sells outcomes. Your marketing should too.',
    description:
      'The employee wellbeing market exploded post-pandemic and is now facing a reckoning: buyers want proof that wellbeing programs actually reduce costs and improve performance, not just feel-good participation metrics. We\'ve worked with 36 wellbeing technology companies and know how to position for the ROI-driven buyer.',
    marketContext:
      'Employee wellbeing technology expanded rapidly during 2020–2022, but the market is now consolidating as HR leaders demand evidence that wellbeing spend produces measurable business outcomes. The companies that survive the shakeout will be those that can prove clinical efficacy, cost reduction, and productivity impact — not just user engagement.',
    painPoints: [
      'Post-pandemic budget scrutiny demands ROI proof for every wellbeing dollar spent',
      'Participation metrics no longer satisfy CFOs asking "what did we get for this?"',
      'Mental health, physical wellness, and financial wellbeing blur into overlapping categories',
      'Benefits brokers and EAP incumbents crowd the competitive landscape',
      'Clinical validation claims must be substantiated to maintain credibility',
      'Consolidation pressure as benefits platforms add wellbeing features',
    ],
    howWeHelp: [
      'ROI-centered positioning that connects wellbeing outcomes to business metrics',
      'Content strategies that balance empathy with evidence-based credibility',
      'Demand gen programs targeting benefits leaders, CHROs, and CFOs simultaneously',
      'Competitive positioning against EAP incumbents and benefits platform consolidation',
      'Brand strategy that navigates the clinical-commercial credibility balance',
      'AI content engines with health and wellbeing domain expertise',
    ],
    relevantServiceSlugs: ['brand-strategy', 'content-marketing', 'demand-generation', 'digital-performance'],
    notableClients: ['Virgin Pulse', 'Headspace', 'Fitbit', 'Gympass', 'Unmind', 'Limeade', 'CoachHub', 'Springbuk'],
    buyerTitle: 'CHRO / VP Benefits',
    stat: { value: '36', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market employee wellbeing technology when buyers demand ROI proof?',
        answer:
          'Marketing wellbeing technology to ROI-focused buyers requires leading with business outcomes — healthcare cost reduction, productivity gains, retention improvements — rather than engagement metrics that CFOs dismiss as soft. We build positioning that translates wellbeing outcomes into the financial language that budget holders understand, making your platform a business case rather than a nice-to-have.',
      },
      {
        question: 'How has the employee wellbeing market changed since the pandemic?',
        answer:
          'The post-pandemic wellbeing market has shifted from "any investment is good" to "prove this actually works" as HR budgets face scrutiny and CEOs question whether wellbeing spend produces measurable returns. Companies that repositioned around clinical evidence, cost containment, and productivity impact are winning; those still marketing on participation rates are losing budget.',
      },
      {
        question: 'How do you differentiate a wellbeing platform from EAP programs and benefits add-ons?',
        answer:
          'Differentiating from EAPs and benefits add-ons requires positioning the specific outcomes your platform delivers that legacy programs structurally cannot — personalization, real-time intervention, data-driven insights, and proactive rather than reactive care models. We help wellbeing companies articulate why "good enough" EAP coverage actually leaves measurable value on the table.',
      },
      {
        question: 'What content strategy works for employee wellbeing technology companies?',
        answer:
          'Wellbeing content strategy must balance empathy with evidence — buyers need to feel that you genuinely care about employee health while also seeing the clinical and financial data that justifies the investment. We build content programs that combine human-centered storytelling with rigorous outcome data, creating credibility with both the HR practitioners who champion the purchase and the executives who approve it.',
      },
    ],
  },
  {
    name: 'PEO, Staffing & HR Services',
    slug: 'peo-staffing',
    group: 'hr-tech',
    color: '#A78BFA',
    colorName: 'lavender',
    tagline: 'You\'re selling trust with other people\'s employees.',
    description:
      'PEOs, staffing firms, and HR service providers sell something uniquely personal: responsibility for other companies\' employees. That requires marketing that builds institutional trust at scale — not feature comparisons. TSC has worked with 33 HR services companies and understands the trust-first buying dynamic.',
    marketContext:
      'The PEO and HR services market serves SMBs and mid-market companies that need HR infrastructure without building it in-house. Competition ranges from national PEOs to regional specialists to tech-enabled staffing platforms, and the buying decision ultimately comes down to trust — can I hand you my employees and sleep at night?',
    painPoints: [
      'Trust is the primary purchase driver — buyers are handing over their people',
      'Commoditized service descriptions make differentiation feel impossible',
      'National PEO brands dominate awareness while regional providers struggle for visibility',
      'Compliance complexity varies by state and industry, complicating messaging',
      'Technology-enabled competitors blur the line between PEO and HCM platform',
      'Client retention depends on service experience that marketing must accurately represent',
    ],
    howWeHelp: [
      'Trust-first brand positioning that makes your reliability tangible and visible',
      'Content strategies that demonstrate compliance expertise and operational depth',
      'Demand gen programs targeting SMB decision-makers with limited HR evaluation resources',
      'Competitive positioning against national PEO brands and tech-enabled alternatives',
      'Regional market strategies that build awareness in specific geographies and industries',
      'Brand strategy that balances personal service culture with scalable growth',
    ],
    relevantServiceSlugs: ['brand-strategy', 'demand-generation', 'content-marketing', 'digital-performance'],
    notableClients: ['Insperity', 'LHH', 'Aon', 'Vaco', 'NuCompass', 'IMPACT Group'],
    buyerTitle: 'CEO / VP HR (SMB)',
    stat: { value: '33', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market a PEO when the service feels commoditized?',
        answer:
          'Marketing a PEO against commoditization requires positioning around the specific trust signals and service depth that make your organization different — because buyers choosing a PEO are making one of the most personal business decisions they\'ll ever make. We build brand positioning that makes your reliability, expertise, and client experience tangible through evidence and content that demonstrates genuine operational depth.',
      },
      {
        question: 'What marketing strategies work for HR services companies competing against national brands?',
        answer:
          'Competing against national PEO brands requires owning the advantages they structurally cannot deliver — personalized service, regional expertise, industry specialization, and the kind of hands-on relationship that disappears at scale. We help regional and mid-market HR services companies position their size and focus as competitive advantages rather than limitations.',
      },
      {
        question: 'How do you build trust in PEO and staffing company marketing?',
        answer:
          'Trust in PEO marketing is built through demonstrated competence, transparent communication, and client evidence that shows you take the employer-of-record responsibility as seriously as the buyer does. We build marketing programs that lead with compliance expertise, operational transparency, and client success stories that prove you can be trusted with someone else\'s most valuable asset — their people.',
      },
      {
        question: 'How do technology-enabled staffing platforms change PEO marketing?',
        answer:
          'Technology-enabled staffing platforms are blurring the line between PEO services and HR technology, forcing traditional PEOs to demonstrate why human expertise matters alongside digital tools. We help PEOs and staffing firms articulate the value of human judgment, compliance knowledge, and relationship management that no platform can replicate — while embracing technology as an enabler, not a threat.',
      },
    ],
  },
  {
    name: 'Benefits & Compensation',
    slug: 'benefits-compensation',
    group: 'hr-tech',
    color: '#088BA0',
    colorName: 'hurricane-sky',
    tagline: 'Benefits are invisible when they work. So is bad marketing.',
    description:
      'Benefits administration and compensation management are essential infrastructure that buyers evaluate with extreme care — because mistakes affect every employee\'s paycheck and health coverage. TSC has worked with 32 benefits and comp tech companies, building marketing that earns the trust these high-stakes decisions demand.',
    marketContext:
      'Benefits and compensation technology is a high-trust market where buyers evaluate platforms against the worst-case scenario: what happens when something goes wrong during open enrollment or a pay cycle. The competitive landscape includes established players with deep integrations and newer entrants promising modern UX and better analytics.',
    painPoints: [
      'Open enrollment is the moment of truth — failures are visible and unforgivable',
      'Integration complexity with payroll, HRIS, and carrier systems dominates evaluations',
      'Compliance requirements vary by state, industry, and employer size',
      'Benefits brokers influence purchasing decisions as much as HR teams',
      'Compensation transparency legislation is reshaping how pay data tools are marketed',
      'User experience expectations are rising but switching costs keep incumbents entrenched',
    ],
    howWeHelp: [
      'Trust-centered positioning for a market where reliability outweighs innovation',
      'Content strategies that demonstrate compliance depth and operational expertise',
      'Demand gen programs targeting benefits directors, total rewards leaders, and brokers',
      'Competitive displacement strategies against entrenched incumbents',
      'Brand positioning that navigates the compensation transparency wave',
      'Multi-audience marketing that reaches both HR buyers and benefits broker channels',
    ],
    relevantServiceSlugs: ['brand-strategy', 'content-marketing', 'demand-generation', 'digital-performance'],
    notableClients: ['Willis Towers Watson', 'Alight Solutions', 'Payscale', 'Businessolver', 'PlanSource', 'Salary.com', 'Nayya', 'Jellyvision'],
    buyerTitle: 'VP Total Rewards / Benefits Director',
    stat: { value: '32', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market benefits administration technology?',
        answer:
          'Marketing benefits administration technology requires positioning reliability and compliance expertise above all else — because buyers are evaluating what happens when 10,000 employees need to enroll in health coverage and your platform is the only thing standing between them and a catastrophe. We build marketing that leads with operational trust, integration depth, and the compliance rigor that benefits buyers demand.',
      },
      {
        question: 'How is compensation transparency legislation affecting HR tech marketing?',
        answer:
          'Compensation transparency laws are creating urgent demand for pay equity tools, salary benchmarking platforms, and total rewards communication — making this one of the fastest-moving segments in HR tech. Companies that position early around transparency compliance, pay equity analytics, and employee communication tools are capturing budget that didn\'t exist two years ago.',
      },
      {
        question: 'How do you reach benefits brokers who influence technology purchasing decisions?',
        answer:
          'Benefits brokers influence a significant share of benefits technology decisions, making broker marketing an essential channel that most vendors underinvest in. We build dual-track marketing programs that target both HR buyers directly and the broker community that advises them — because winning the broker\'s recommendation often shortens the sales cycle more than any direct campaign.',
      },
      {
        question: 'What differentiates benefits technology in an integration-driven market?',
        answer:
          'Benefits technology differentiation in an integration-driven market comes from demonstrating seamless connectivity with the payroll, HRIS, and carrier systems that buyers already use — because the best features in the world don\'t matter if the platform breaks the data flow. We position benefits companies around ecosystem compatibility and implementation confidence.',
      },
    ],
  },
  {
    name: 'Payroll & Workforce Management',
    slug: 'payroll-workforce',
    group: 'hr-tech',
    color: '#F59E0B',
    colorName: 'amber',
    tagline: 'Nobody switches payroll on a whim. Earn the decision.',
    description:
      'Payroll is the ultimate high-stakes HR technology — if it fails, everyone knows immediately. Workforce management layers scheduling, time tracking, and labor compliance on top of that pressure. TSC has worked with 30 payroll and WFM companies, building marketing that overcomes the switching inertia these categories face.',
    marketContext:
      'Payroll and workforce management technology sits at the intersection of HR and finance, with buyers who prioritize reliability above innovation. Switching payroll providers is one of the most painful technology transitions a company can make, creating massive incumbent advantage and requiring challengers to build extraordinary trust before buyers will even evaluate.',
    painPoints: [
      'Extreme switching costs create inertia that marketing alone cannot overcome',
      'Payroll errors are immediately visible and trust-destroying — buyers are risk-averse',
      'Multi-state and international compliance complexity limits market positioning',
      'Workforce management competes with scheduling features built into POS and ERP systems',
      'Price competition from bundled HCM suites that include "good enough" payroll',
      'Gig economy and contractor classification add compliance complexity',
    ],
    howWeHelp: [
      'Trust-first positioning that overcomes the switching fear embedded in payroll buying',
      'ROI frameworks that quantify the cost of staying with an inferior payroll provider',
      'Demand gen programs targeting CFOs and HR leaders with different risk profiles',
      'Competitive positioning against HCM suite bundled payroll offerings',
      'Content strategies that demonstrate compliance depth across jurisdictions',
      'Brand strategy for WFM companies competing with embedded scheduling tools',
    ],
    relevantServiceSlugs: ['brand-strategy', 'demand-generation', 'digital-performance', 'content-marketing'],
    notableClients: ['Paychex', 'Gusto', 'Paycor', 'PrismHR', 'Deputy', 'OneSource Virtual', 'Papaya', 'QUINYX'],
    buyerTitle: 'CFO / VP HR',
    stat: { value: '30', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market payroll technology when switching costs are so high?',
        answer:
          'Marketing payroll technology against high switching costs requires reframing the buyer\'s risk calculus — making the cost of staying with their current provider feel more dangerous than the cost of switching. We build marketing programs that quantify hidden costs (compliance risk, manual workarounds, integration failures) and position your platform as the lower-risk choice, not just the better-featured one.',
      },
      {
        question: 'What makes payroll technology marketing different from other HR tech?',
        answer:
          'Payroll marketing is unique because the buying decision is driven almost entirely by trust and risk avoidance — no one gets promoted for switching to great payroll, but careers end when payroll fails. Marketing must lead with reliability evidence, compliance credentials, and implementation confidence that de-risks the decision for every stakeholder involved.',
      },
      {
        question: 'How do you compete with HCM suites that bundle payroll?',
        answer:
          'Competing against bundled HCM payroll requires proving that the payroll-specific capabilities, compliance depth, and service quality of a dedicated provider justify maintaining a separate system. We position payroll companies around the hidden costs and limitations of "good enough" bundled payroll — implementation shortcuts, slower compliance updates, and support that suffers when payroll is a feature rather than the product.',
      },
      {
        question: 'How do you market workforce management technology to deskless workers\' employers?',
        answer:
          'Workforce management marketing for deskless and hourly employers requires messaging that speaks to operational managers and frontline supervisors — not just HR executives — because they are the daily users who drive adoption and renewal. We build marketing programs that demonstrate scheduling efficiency, labor compliance automation, and worker experience improvements in language that resonates with operations leaders.',
      },
    ],
  },
  {
    name: 'Talent Management & Performance',
    slug: 'talent-management',
    group: 'hr-tech',
    color: '#F472B6',
    colorName: 'rose',
    tagline: 'Performance management is personal. Your positioning should be too.',
    description:
      'Talent management and performance technology lives at the intersection of organizational strategy and individual development — making it deeply personal and politically charged in every organization. TSC has worked with 23 talent management companies, navigating the nuance that separates platforms buyers trust from those they abandon.',
    marketContext:
      'The talent management and performance category is evolving rapidly from annual review tools to continuous feedback platforms, skills-based career pathing, and AI-powered succession planning. Buyers are skeptical of vendors who rebrand old performance management as "modern" without fundamentally changing the approach.',
    painPoints: [
      'Annual performance review backlash has fragmented the market into competing philosophies',
      'Continuous feedback tools compete with free features in collaboration platforms',
      '"Modern performance management" has become as meaningless as the category it replaced',
      'Talent mobility and internal marketplace positioning is emerging but undefined',
      'Manager enablement is the real buying driver but vendors market to HR',
      'AI-powered talent insights face trust and bias concerns from HR buyers',
    ],
    howWeHelp: [
      'Positioning that takes a clear side in the performance management philosophy debate',
      'Content strategies that demonstrate understanding of organizational development',
      'Demand gen targeting HR leaders who are rebuilding their performance approach',
      'Brand strategy that navigates AI bias concerns with transparency and credibility',
      'Competitive positioning against collaboration tools with embedded feedback features',
      'Thought leadership programs that establish authority in talent strategy',
    ],
    relevantServiceSlugs: ['brand-strategy', 'content-marketing', 'gtm-strategy', 'demand-generation'],
    notableClients: ['Predictive Index', 'Fuel50', 'TalentGuard', 'TalentQuest', 'Inspire Software', 'SurePeople'],
    buyerTitle: 'CHRO / VP Talent',
    stat: { value: '23', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market performance management technology after the annual review backlash?',
        answer:
          'Marketing performance management after the annual review backlash requires taking a clear position on what replaces it — because buyers are tired of vendors who criticize the old model without offering a substantive alternative. We build positioning that articulates your specific philosophy of performance and makes that philosophy the reason buyers choose you.',
      },
      {
        question: 'How do you differentiate a talent management platform from collaboration tool features?',
        answer:
          'Differentiating from embedded collaboration features requires proving that talent management is a strategic discipline — not a module bolted onto a chat tool. We position talent management companies around the organizational outcomes (succession planning, skills visibility, internal mobility) that purpose-built platforms deliver and lightweight features cannot.',
      },
      {
        question: 'What role does AI play in talent management technology marketing?',
        answer:
          'AI in talent management marketing must address both the promise and the risk — buyers want intelligent recommendations for succession, development, and career pathing, but they\'re deeply concerned about algorithmic bias and fairness. We build messaging that leads with AI transparency, ethical safeguards, and human-in-the-loop design, making your AI capabilities a trust-builder rather than a liability.',
      },
      {
        question: 'How should talent management companies position for the internal mobility trend?',
        answer:
          'Internal mobility positioning requires reframing talent management from a compliance tool to a strategic talent marketplace — connecting employee skills, career aspirations, and organizational needs in a way that reduces external hiring costs and improves retention. Companies that position around internal mobility data and career pathing are accessing strategic budgets that traditional performance management vendors never reach.',
      },
    ],
  },
  {
    name: 'HR Analytics & People Data',
    slug: 'hr-analytics',
    group: 'hr-tech',
    color: '#FFBDAE',
    colorName: 'fing-peachy',
    tagline: 'You sell data-driven decisions. Market with the same rigor.',
    description:
      'People analytics companies sell the promise of data-driven HR — which means your marketing must be as rigorous as the product you deliver. TSC has worked with 13 HR analytics and people data companies, building marketing that speaks the language of data-literate CHROs and people analytics leaders.',
    marketContext:
      'People analytics is a maturing category where early-adopter enthusiasm is giving way to practical questions: what data do I actually need, how do I act on insights, and can this integrate with my existing HRIS? The winners will be companies that position around actionable outcomes rather than dashboards full of data nobody uses.',
    painPoints: [
      'Analytics fatigue — buyers have dashboards from every HR tool and don\'t need another one',
      'Data integration across fragmented HR tech stacks is the real barrier to adoption',
      'People analytics teams are small and under-resourced, limiting platform sophistication',
      'Privacy and ethical concerns about workforce surveillance are growing',
      'ROI of people analytics itself is hard to quantify for budget justification',
      'BI tools and HRIS-embedded analytics compete with dedicated people analytics platforms',
    ],
    howWeHelp: [
      'Positioning around actionable insights and business outcomes, not data visualization',
      'Content strategies that demonstrate analytical rigor and domain expertise',
      'Demand gen targeting CHROs, people analytics leaders, and HRIS administrators',
      'Competitive positioning against embedded analytics in HCM and BI platforms',
      'Thought leadership that advances the practice of people analytics',
      'Brand strategy that navigates workforce data ethics with transparency',
    ],
    relevantServiceSlugs: ['brand-strategy', 'content-marketing', 'demand-generation', 'gtm-strategy'],
    notableClients: ['Visier', 'One Model', 'Lightcast', 'SplashBI', 'Tabulera'],
    buyerTitle: 'CHRO / VP People Analytics',
    stat: { value: '13', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market people analytics when buyers already have dashboards everywhere?',
        answer:
          'Marketing people analytics against dashboard fatigue requires positioning around the decisions your platform enables — not the data it displays — because CHROs don\'t need more charts, they need answers that drive action. We build messaging that connects analytics capabilities to specific business outcomes rather than competing on visualization features.',
      },
      {
        question: 'How do you position a people analytics platform against HRIS-embedded analytics?',
        answer:
          'Positioning against embedded HRIS analytics requires proving that dedicated people analytics platforms deliver insights that surface-level reporting structurally cannot — cross-system data integration, predictive modeling, and the analytical depth that turns HR from a reporting function into a strategic one. We help analytics companies articulate the gap between "HR reports" and "people intelligence."',
      },
      {
        question: 'How do workforce data ethics concerns affect people analytics marketing?',
        answer:
          'Workforce data ethics is becoming a central buying concern as employees push back against surveillance-adjacent analytics, making transparency and consent foundational to your positioning. We build marketing programs that address privacy concerns proactively — leading with ethical frameworks, data governance practices, and employee-centric design principles that turn a potential objection into a competitive differentiator.',
      },
      {
        question: 'What content strategy works for people analytics companies?',
        answer:
          'People analytics content must demonstrate genuine statistical rigor and domain expertise — your buyers are data professionals who will immediately dismiss content that substitutes buzzwords for methodology. We build thought leadership programs that showcase original research, benchmark data, and analytical frameworks that establish your team as credible practitioners.',
      },
    ],
  },

  // ───────────────────────────────────────────
  // Adjacent Verticals (5)
  // ───────────────────────────────────────────
  {
    name: 'Enterprise SaaS',
    slug: 'enterprise-saas',
    group: 'adjacent',
    color: '#FF5910',
    colorName: 'atomic-tangerine',
    tagline: 'You can\'t out-feature your way to growth.',
    description:
      'Every SaaS company says "better, faster, cheaper." Differentiation is the hardest problem in enterprise software, and product-led growth only gets you so far. TSC has helped 34 enterprise SaaS companies find their strategic edge — scaling past the PLG ceiling with real brand and demand infrastructure.',
    marketContext:
      'Enterprise SaaS is a crowded, well-funded arena where the difference between category leader and also-ran often comes down to positioning and go-to-market execution, not product capabilities. PLG has hit its ceiling for many companies, and the transition to enterprise sales motion requires brand and demand generation infrastructure most startups haven\'t built.',
    painPoints: [
      'Feature parity makes differentiation a positioning problem, not a product problem',
      'PLG ceiling — self-serve growth stalls without brand and demand gen support',
      'Long enterprise sales cycles with 6–10 stakeholder buying committees',
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
    relevantServiceSlugs: ['gtm-strategy', 'demand-generation', 'digital-performance', 'brand-strategy'],
    notableClients: ['ServiceNow', 'Zendesk', 'Medallia', 'Planview', 'Unity Technologies', 'Workiva', 'Guru', 'Jotform'],
    buyerTitle: 'CMO / VP Marketing',
    stat: { value: '34', label: 'Clients served' },
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
    name: 'MarTech & Revenue Tech',
    slug: 'martech',
    group: 'adjacent',
    color: '#E1FF00',
    colorName: 'neon-cactus',
    tagline: 'Marketing to marketers is the ultimate meta-game.',
    description:
      'Your buyers know every trick in the book because they wrote half of it. MarTech and revenue technology companies face the unique challenge of marketing to professionals who evaluate marketing for a living. TSC has worked with 16 martech companies — and we know what earns their attention because we are them.',
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
    notableClients: ['Influitive', 'Madison Logic', 'Terminus', 'Goodway Group', 'SmartKarrot', 'Solutions by Text'],
    buyerTitle: 'CMO / VP Marketing Ops',
    stat: { value: '16', label: 'Clients served' },
    answerCapsules: [
      {
        question: 'How do you market to marketers who know every trick in the book?',
        answer:
          'Marketing to marketers requires radical authenticity — your audience evaluates marketing for a living, so anything that feels manufactured, exaggerated, or derivative will be dismissed immediately. We build programs that lead with genuine substance: original research, honest POVs, and content that earns respect from professionals who can spot a marketing tactic from a mile away.',
      },
      {
        question: 'How do you stand out in a 14,000-vendor MarTech landscape?',
        answer:
          'Standing out in a 14,000-vendor landscape requires category positioning sharper than "we\'re the best platform for X" — you need to own a specific problem or point of view that makes your company impossible to ignore. We build positioning around the intersection of your genuine differentiation and the specific pain point your best customers would be desperate without you to solve.',
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
    name: 'Cybersecurity & IT',
    slug: 'cybersecurity',
    group: 'adjacent',
    color: '#73F5FF',
    colorName: 'tidal-wave',
    tagline: 'FUD is dead. Substance wins.',
    description:
      'The cybersecurity market has been poisoned by fear-based marketing and acronym soup. Technical buyers see through it instantly. TSC has worked with 15 cybersecurity and IT infrastructure companies, helping them position actual differentiation for both technical evaluators and business decision-makers — without resorting to FUD.',
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
    notableClients: ['Bitwarden', 'Jumio', 'Alert Logic', 'Auvik', 'QualiSystems'],
    buyerTitle: 'CISO / VP Security',
    stat: { value: '15', label: 'Clients served' },
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
    name: 'HealthTech & Healthcare',
    slug: 'healthtech',
    group: 'adjacent',
    color: '#FFBDAE',
    colorName: 'fing-peachy',
    tagline: 'Regulated markets demand agencies that understand the guardrails.',
    description:
      'Healthcare technology companies navigate one of the most complex marketing environments in B2B — regulatory constraints, clinical buyer skepticism, and procurement cycles measured in years. TSC has worked with 12 healthtech companies, building marketing programs that earn trust within the guardrails.',
    marketContext:
      'Healthcare technology is a high-growth market constrained by HIPAA compliance, clinical validation requirements, and the inherently conservative buying behavior of health systems and payers. Winners are the companies that build systematic trust while moving faster than incumbents.',
    painPoints: [
      'HIPAA and regulatory constraints affect every marketing decision and asset',
      'Clinical buyers require evidence-based messaging, not marketing-speak',
      'Health system procurement processes are among the longest in B2B',
      'Dual audience: clinical stakeholders and administrative C-suite',
      'Trust and patient safety concerns dominate every buying conversation',
      'Competitive landscape includes both startups and massive health system incumbents',
    ],
    howWeHelp: [
      'Compliance-aware marketing that navigates healthcare regulations confidently',
      'Content strategies that balance clinical credibility with business impact messaging',
      'Demand gen programs built for health system procurement timelines',
      'Dual-track messaging for clinical and administrative decision-makers',
      'Thought leadership that establishes credibility with healthcare practitioners',
      'Brand positioning for companies selling into complex institutional buying processes',
    ],
    relevantServiceSlugs: ['brand-strategy', 'demand-generation', 'content-marketing', 'digital-performance'],
    notableClients: ['UPMC', 'Evolent Health', 'Solv Health', 'Bright Horizons', 'Experity', 'HealthcareSource'],
    buyerTitle: 'CTO / VP Digital Health',
    stat: { value: '12', label: 'Clients served' },
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
    name: 'FinTech & Financial Services',
    slug: 'fintech',
    group: 'adjacent',
    color: '#ED0AD2',
    colorName: 'sprinkles',
    tagline: 'Trust is the product. Marketing is how you earn it.',
    description:
      'FinTech buyers don\'t take risks with their money infrastructure. Every marketing asset, every claim, every piece of content is weighed against a simple question: "Can I trust this company?" TSC has worked with 11 fintech and financial services companies, building marketing that earns institutional trust.',
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
    notableClients: ['SoFi', 'Equifax', 'DailyPay', 'Bank of America', 'Payactiv', 'Comerica Bank'],
    buyerTitle: 'CMO / Head of Growth',
    stat: { value: '11', label: 'Clients served' },
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
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((ind) => ind.slug === slug);
}

export function getRelatedIndustries(currentSlug: string, count = 3): Industry[] {
  const current = INDUSTRIES.findIndex((ind) => ind.slug === currentSlug);
  const others = INDUSTRIES.filter((ind) => ind.slug !== currentSlug);
  const rotated = [...others.slice(current >= others.length ? 0 : current), ...others.slice(0, current >= others.length ? 0 : current)];
  return rotated.slice(0, count);
}
