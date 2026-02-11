/**
 * TypeScript types for website-relevant GTM Kernel data.
 * These types represent the subset of the 20-component kernel
 * that drives website rendering, content generation, and brand governance.
 */

// ===========================================
// Brand Identity (Component 14)
// ===========================================

export interface BrandIdentity {
  name: {
    full: string;
    short: string;
    abbreviation: string;
  };
  archetype: {
    primary: string;
    secondary: string;
  };
  values: Array<{
    value: string;
    definition: string;
  }>;
  purpose: {
    mission: string;
    vision: string;
  };
  brandPromise: string;
  personality: {
    traits: string[];
    weAre: string[];
    weAreNot: string[];
  };
}

// ===========================================
// Message Identity (Component 15)
// ===========================================

export interface MessageIdentity {
  coreClaims: Array<{
    claim: string;
    proof: string;
    whenToUse: string;
  }>;
  narrativeFrames: Array<{
    name: string;
    before: string;
    after: string;
  }>;
  terminology: {
    preferred: Array<{ term: string; insteadOf: string }>;
    forbidden: Array<{ term: string; replacement: string }>;
    proprietary: string[];
  };
  elevatorPitches: {
    tenSecond: string;
    thirtySecond: string;
  };
  taglines: string[];
}

// ===========================================
// Content Identity (Component 16)
// ===========================================

export interface ContentIdentity {
  voiceRules: Array<{
    rule: string;
    exampleGood: string;
    exampleBad: string;
    rationale: string;
  }>;
  structuralPatterns: Array<{
    patternName: string;
    structure: string;
    whenToUse: string;
  }>;
  stylisticMarkers: {
    sentenceLength: string;
    paragraphLength: string;
    useOfLists: string;
    useOfQuestions: string;
    useOfHumor: string;
    useOfJargon: string;
  };
}

// ===========================================
// Visual Identity (Component 17)
// ===========================================

export interface VisualIdentity {
  colorPalette: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
  typography: {
    primaryFont: string;
    headingStyle: string;
    bodyStyle: string;
  };
}

// ===========================================
// ICP (Component 6)
// ===========================================

export interface ICP {
  primary: {
    label: string;
    titles: string[];
    seniority: string;
    painPoints: string[];
    successMetrics: string[];
    worldview: string;
  };
  companyProfile: {
    industries: string[];
    employeeRange: string;
    revenueRange: string;
  };
}

// ===========================================
// JTBD (Component 9)
// ===========================================

export interface JTBDCluster {
  jobName: string;
  startingState: string;
  desiredState: string;
  obstacles: string[];
  hiringCriteria: string[];
}

// ===========================================
// Offerings (Component 3)
// ===========================================

export interface ServiceOffering {
  name: string;
  description: string;
  deliveryModel: string;
  typicalScope: string;
}

export interface ServiceCategory {
  categoryKey: string;
  services: ServiceOffering[];
}

// ===========================================
// Constraints (Component 20)
// ===========================================

export interface ContentConstraints {
  forbiddenTopics: string[];
  forbiddenClaims: string[];
  brandGuardrails: Array<{
    guardrail: string;
    rationale: string;
  }>;
  filteringRules: {
    includeKeywords: string[];
    excludeKeywords: string[];
    requireTopicMarkers: string[];
    qualityThresholds: {
      minRelevanceScore: number;
      minQualityScore: number;
    };
  };
}

// ===========================================
// Leadership (for author bios / expert rotation)
// ===========================================

export interface Leader {
  name: string;
  title: string;
  shortBio: string;
  linkedIn?: string;
  youTube?: string;
}

// ===========================================
// Full Client Config (website-facing)
// ===========================================

export interface ClientConfig {
  clientId: string;
  version: string;
  generatedAt: string;

  brand: BrandIdentity;
  message: MessageIdentity;
  content: ContentIdentity;
  visual: VisualIdentity;
  icp: ICP;
  jtbd: JTBDCluster[];
  offerings: ServiceCategory[];
  constraints: ContentConstraints;
  leaders: Leader[];
}
