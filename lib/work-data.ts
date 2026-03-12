export interface CaseStudy {
  slug: string;
  client: string;
  website: string;
  headline: string;
  subheading: string;
  intro: string;
  sectionHeading: string;
  sectionBody: string;
  outcomeHeading?: string;
  outcomeBody?: string;
  stats?: Array<{ value: string; label: string }>;
  quote?: { text: string; attribution: string };
  tags: string[];
  color: string;
  /** Card thumbnail shown in the /examples grid */
  cardImage?: string;
  /** Work sample images shown in the detail page gallery */
  images?: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'papaya-global',
    client: 'Papaya Global',
    website: 'www.papayaglobal.com',
    headline: 'One acquisition. Global attention. Zero wasted motion.',
    subheading: 'Big story, bigger stage',
    intro:
      'After beginning work together, we leveraged news around Papaya\'s acquisition of Azimo, a London-based money transfer business. We secured coverage in TechCrunch, including coordinating exclusive interviews with CEOs from both Papaya and Azimo.',
    sectionHeading: 'The Move: Big Story, Bigger Stage',
    sectionBody:
      'After beginning work together, the agency leveraged news around Papaya\'s acquisition of Azimo, a London-based money transfer business. We secured coverage in TechCrunch, including coordinating exclusive interviews with CEOs from both Papaya and Azimo.',
    outcomeHeading: 'The Outcome: KPIs Blown Out. Press Delivered.',
    outcomeBody:
      'Within the first 3 months of engagement, Papaya experienced immediate impact. The brand achieved a 100% increase in share of voice against competitors, a 4X increase in website traffic month-over-month from historic highs of brand impressions, and additional marquee press wins in CNBC, Fortune, Time, and Authority Magazine.',
    stats: [
      { value: '100%', label: 'Increase in share of voice' },
      { value: '4X', label: 'Website traffic increase MoM' },
    ],
    quote: {
      text: 'The past month has been monumental. It was a tall order to fill, and you all executed the month flawlessly and made my life SO much easier!',
      attribution: 'Papaya Global Executive',
    },
    tags: ['PR', 'Share of Voice', 'Global Payroll'],
    color: '#73F5FF',
    cardImage: '/images/work/papaya-global/card.jpg',
  },
  {
    slug: 'unmind',
    client: 'Unmind',
    website: 'www.unmind.com',
    headline: 'Breaking through all the noise in a buzzy market.',
    subheading: 'Science, strategy, and a smarter PR playbook',
    intro:
      'When Unmind entered the U.S. in 2020, the mental health tech space was crowded and loud. Competing for mindshare against big-spending, big-press rivals like Headspace, Lyra, and Modern Health meant Unmind had to be smart, strategic, and targeted.',
    sectionHeading: 'The Approach: Science, Strategy, and a Smarter PR Playbook',
    sectionBody:
      'TSC worked hand-in-hand with Unmind to build an editorial calendar that delivered signal, not noise. We prioritized contributed articles in HR and Benefits publications, crafted themes to spotlight Unmind\'s science-backed approach, and amplified credibility with a well-timed Series B funding announcement in key tech press. It wasn\'t about chasing headlines. It was about building trust with the people who actually make the buying decisions.',
    outcomeHeading: 'The Outcome: More Mindshare, More Momentum',
    outcomeBody:
      'By Q3 of 2021, Unmind\'s share of voice had jumped 24.3% year over year, surpassing major competitors in a hot market. The strategy worked: Unmind gained traction with the right audiences and built sustainable momentum as a credible, science-first wellbeing platform.',
    stats: [
      { value: '24.3%', label: 'Share of voice increase YoY' },
    ],
    quote: {
      text: 'Great partnership and appreciate the help with the work! We had a tight deadline and you made it happen!',
      attribution: 'Unmind PR Director',
    },
    tags: ['PR', 'Mental Health Tech', 'Share of Voice'],
    color: '#E1FF00',
    cardImage: '/images/work/unmind/card.png',
  },
  {
    slug: 'archetype',
    client: 'Archetype Solutions Group',
    website: 'www.archetypegrowth.com',
    headline: 'A unique, powerful model needing a clearer story.',
    subheading: 'Sharper identity + stronger pipeline',
    intro:
      'Philadelphia-based Archetype Solutions Group (ASG) blends consulting, venture capital, and shared services to accelerate growth for healthcare, fintech, and HR tech businesses. But their brand didn\'t reflect the sophistication or scale of their model, and stakeholders across their ecosystem were struggling to grasp the full value.',
    sectionHeading: 'Taking a Brand from Complex to Cohesive',
    sectionBody:
      'TSC partnered with ASG\'s senior leadership team to evolve the brand from the inside out. We refined the logo and identity system, rebuilt the website from scratch (UX to dev), and shaped a messaging strategy that illuminated the full breadth of ASG\'s engagement model and investment thesis. The result was a bold, modern brand experience that matched their ambition.',
    tags: ['Brand', 'Website', 'Messaging'],
    color: '#FF5910',
    cardImage: '/images/work/archetype/card.jpg',
    images: [
      '/images/work/archetype/gallery-1.jpg',
      '/images/work/archetype/gallery-2.jpg',
      '/images/work/archetype/gallery-3.jpg',
      '/images/work/archetype/gallery-4.jpg',
      '/images/work/archetype/gallery-5.jpg',
      '/images/work/archetype/gallery-6.jpg',
    ],
  },
  {
    slug: 'mobile-health',
    client: 'Mobile Health',
    website: 'mobilehealthconsumer.com',
    headline: 'Great product, stronger brand, growth followed.',
    subheading: '50K new customers + 3M new users',
    intro:
      'Mobile Health had a great wellbeing product but a brand that felt outdated, overly corporate, and too quiet. Its growth strategy hinged on selling through large consulting firms, but they needed more polish to stand out competitively.',
    sectionHeading: 'From Competitive Insight to a Brand That Wins Deals',
    sectionBody:
      'Deep-dive competitive research revealed a significant positioning opportunity around the product\'s ease, agility, and partnership-ready value. We brought it to life with a refreshed brand and GTM activation that gave the sales team plenty to run with.',
    stats: [
      { value: '50K', label: 'New customers' },
      { value: '3M', label: 'New users' },
    ],
    quote: {
      text: 'The rebrand and new website allowed us to become the fastest growing health and well-being platform in the industry. Because of this work, we were able to add 50,000 new customers and 3 million new users.',
      attribution: 'Mobile Health Executive',
    },
    tags: ['Brand', 'GTM', 'Wellbeing Tech'],
    color: '#73F5FF',
    cardImage: '/images/work/mobile-health/card.jpg',
  },
  {
    slug: 'axonify',
    client: 'Axonify',
    website: 'www.axonify.com',
    headline: 'From two brands to one bigger, bolder global voice.',
    subheading: 'Research-backed rebrand that energized 3.5M+ employees',
    intro:
      'Based on great work TSC did for Nudge, Axonify asked TSC to step in and refresh its brand after it acquired Nudge. The goal: Tell a bigger, bolder together story about the two combined companies forming a frontline employee platform that supports more than 3.5 million employees in 160+ countries.',
    sectionHeading: 'Backed by Research, Designed to Move',
    sectionBody:
      'TSC worked closely with Axonify\'s senior leadership team on market research, brand development, and activation that told the brand story in ways that would appeal to stakeholders across their ecosystem. The result was a clear visual articulation of the motion, connection, and fluid energy that is key to Axonify\'s brand experience.',
    stats: [
      { value: '3.5M+', label: 'Employees supported' },
      { value: '160+', label: 'Countries served' },
    ],
    tags: ['Brand', 'Research', 'Frontline Tech'],
    color: '#E1FF00',
    cardImage: '/images/work/axonify/card.png',
    images: [
      '/images/work/axonify/gallery-1.png',
      '/images/work/axonify/gallery-2.png',
      '/images/work/axonify/gallery-3.png',
      '/images/work/axonify/gallery-4.png',
    ],
  },
  {
    slug: 'searchlight',
    client: 'Searchlight',
    website: 'searchlight.ai',
    headline: 'Shining a brighter light on a breakthrough platform.',
    subheading: 'New brand + Multiverse acquisition',
    intro:
      'Searchlight set out to reinvent quality-of-hire intelligence with a predictive platform built on real post-hire data. What it lacked was a brand that expressed the sharp, ambitious company it already was.',
    sectionHeading: 'Turning a Sharp Idea into a Beam of Impact',
    sectionBody:
      'TSC worked with the founders to refine Searchlight\'s strategic positioning, sharpen its messaging, and relaunch the brand with a modern identity system rooted in the physics of light. Inspired by convergence, the precise moment when scattered rays focus into clarity, we developed a visual language that captured both precision and human insight. The new logo marked that intersection, built with layered gradients, movement, and meaning, turning complex ideas into an elegant, intuitive experience.',
    outcomeHeading: 'The Outcome',
    outcomeBody:
      'Not long after the new brand hit the market, Searchlight was acquired by Multiverse, a clear signal that the story landed and the vision resonated.',
    tags: ['Brand', 'Positioning', 'Talent Tech'],
    color: '#FF5910',
    cardImage: '/images/work/searchlight/card.jpg',
    images: [
      '/images/work/searchlight/gallery-1.jpg',
      '/images/work/searchlight/gallery-2.jpg',
      '/images/work/searchlight/gallery-3.jpg',
      '/images/work/searchlight/gallery-4.jpg',
      '/images/work/searchlight/gallery-5.jpg',
      '/images/work/searchlight/gallery-6.jpg',
      '/images/work/searchlight/gallery-7.jpg',
    ],
  },
  {
    slug: 'talent-lms',
    client: 'TalentLMS',
    website: 'www.talentlms.com',
    headline: 'The right phrase doesn\'t trend. It takes over.',
    subheading: '337% SOV surge and a breakout buzzword',
    intro:
      'HR tech is loud. TalentLMS didn\'t want more noise. They wanted the storyline everyone else would have to follow. Not fleeting press hits. Narrative control.',
    sectionHeading: 'The Move: Define the Moment. Dominate the Conversation.',
    sectionBody:
      'TSC partnered with TalentLMS to coin the term "Quiet Cracking," a new phrase capturing how employees emotionally crack under the pressure of quiet quitting\'s expectations. We built the research strategy, fielded the survey, validated the insight with data, and launched a PR campaign that hit analysts, press, and social influencers hard.',
    outcomeHeading: 'The Outcome: 337% SOV Surge and a Breakout Buzzword',
    outcomeBody:
      'In less than 30 days, "Quiet Cracking" made noise: Over 30 media mentions, six Tier 1 placements, including Forbes, Inc., and HR Executive, and a wave of LinkedIn influencer posts. TalentLMS surged 337% in PR share of voice, tying with key competitors.',
    stats: [
      { value: '337%', label: 'PR share of voice increase' },
      { value: '30+', label: 'Media mentions' },
      { value: '6', label: 'Tier 1 placements' },
    ],
    quote: {
      text: 'TSC\'s expertise in the research process, coupled with its public relations approach, helped us coin the term "Quiet Cracking," which has been our best performing PR initiative ever.',
      attribution: 'TalentLMS Executive',
    },
    tags: ['PR', 'Research', 'Learning Tech'],
    color: '#73F5FF',
  },
  {
    slug: 'cornerstone',
    client: 'Cornerstone OnDemand',
    website: 'www.cornerstoneondemand.com',
    headline: 'Reskilling reality check. The story everyone had to follow.',
    subheading: 'Global research meets ground-level reality',
    intro:
      'TSC partnered with Cornerstone to design and execute a comprehensive global survey of 500 executives and 1,000 employees. The study surfaced hard truths: a widening confidence gap between employers and employees, urgent talent shortages, and critical misalignments in how organizations approach skills development.',
    sectionHeading: 'Global Research Meets Ground-Level Reality',
    sectionBody:
      'Wrapped in a bold editorial frame, the report, "Thriving in the Global Skills Shortage," gave Cornerstone a compelling story and concrete proof points to back it up.',
    outcomeHeading: 'The Outcome: 14,000 Views, Countless Conversations',
    outcomeBody:
      'Within six months of launch, the main report drew 7,000+ unique views, while supporting content (blog, press release) doubled that reach. The campaign sparked internal engagement, media coverage, and sales conversations, proving that smart research, sharp storytelling, and strategic amplification still punch above their weight.',
    stats: [
      { value: '14K+', label: 'Total content views' },
      { value: '1,500', label: 'Survey respondents' },
    ],
    quote: {
      text: 'I cannot tell you all how pleased I am with this fielding result. Like we said, I love it when a plan comes together.',
      attribution: 'Cornerstone Senior Executive',
    },
    tags: ['Research', 'Content', 'HCM'],
    color: '#E1FF00',
    cardImage: '/images/work/cornerstone/card.webp',
  },
  {
    slug: 'docebo',
    client: 'Docebo',
    website: 'www.docebo.com',
    headline: 'Come si dice "Totally crushed it" in Italiano?',
    subheading: 'Lake Como. 24 analysts. One big bet.',
    intro:
      'They are a publicly-traded industry leader now, but back in the day, Docebo was breaking out of its home country in Italy and into the U.S. market, barely making a brand dent. With growth goals on the line, they needed fast traction with analysts, influencers, and enterprise buyers.',
    sectionHeading: 'The Move: Lake Como. 24 Analysts. One Big Bet.',
    sectionBody:
      'TSC partnered with Docebo to orchestrate a high-touch, high-impact analyst event at a luxury Italian resort. We brought two dozen top analysts to Lake Como for intimate briefings, product roadmap reveals, and deep conversations on the future of learning, all wrapped in an unforgettable experience that put Docebo\'s vision (and vibe) on full display.',
    outcomeHeading: 'The Outcome: A Game-Changing Deal and IPO Momentum',
    outcomeBody:
      'Shortly after the event, an attending analyst was running an RFP for a major global retailer. The resulting RFP win was the largest analyst-attributed deal in company history, fueling its path to IPO and solidifying its position as a true industry leader.',
    quote: {
      text: 'There is no doubt in my mind that the RFP win was directly connected to the analyst event.',
      attribution: 'Senior Docebo Executive',
    },
    tags: ['Analyst Relations', 'Events', 'Learning Tech'],
    color: '#FF5910',
    cardImage: '/images/work/docebo/card.png',
  },
  {
    slug: 'nudge',
    client: 'Nudge',
    website: 'www.nudge.co',
    headline: 'Rebrand ignites 34% growth and acquisition.',
    subheading: '34% YoY growth, acquired by Axonify',
    intro:
      'Nudge Rewards, a Canadian startup helping deskless teams stay in the know, was ready for more. With a bigger vision and a broader solution set (think engagement, not just comms) they came to us for a bold new strategy, sharper story, and a brand identity built to scale.',
    sectionHeading: 'Dropping a Word and Picking Up a Spark',
    sectionBody:
      'First move: drop "Rewards." It was confusing prospects and holding the brand back. Then we rebuilt the look and feel, modern, energetic, and built to reflect a platform with serious power. The new identity didn\'t just click. It wowed.',
    outcomeHeading: 'The Outcome',
    outcomeBody:
      'The success of the rebrand helped propel Nudge to 34% YoY growth, leading to its acquisition in June 2022 by the learning leader for frontline employees, Axonify.',
    stats: [
      { value: '34%', label: 'Year-over-year growth' },
    ],
    quote: {
      text: 'This is why you hire an agency. I wish everyone who\'s ever asked that question could\'ve seen this presentation. It was fantastic.',
      attribution: 'Nudge Executive',
    },
    tags: ['Brand', 'Strategy', 'Frontline Tech'],
    color: '#73F5FF',
    cardImage: '/images/work/nudge/card.jpg',
    images: [
      '/images/work/nudge/gallery-1.jpg',
      '/images/work/nudge/gallery-2.jpg',
      '/images/work/nudge/gallery-3.jpg',
      '/images/work/nudge/gallery-4.jpg',
      '/images/work/nudge/gallery-5.jpg',
      '/images/work/nudge/gallery-6.jpg',
      '/images/work/nudge/gallery-7.jpg',
      '/images/work/nudge/gallery-8.jpg',
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}

export function getAdjacentCaseStudies(slug: string): { prev: CaseStudy | undefined; next: CaseStudy | undefined } {
  const index = CASE_STUDIES.findIndex((cs) => cs.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? CASE_STUDIES[index - 1] : CASE_STUDIES[CASE_STUDIES.length - 1],
    next: index < CASE_STUDIES.length - 1 ? CASE_STUDIES[index + 1] : CASE_STUDIES[0],
  };
}
