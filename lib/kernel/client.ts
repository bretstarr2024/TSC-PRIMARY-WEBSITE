/**
 * Client config accessor.
 * Reads the generated kernel JSON for the current CLIENT_ID.
 * All components/pages import from here instead of hardcoding values.
 */

import type { ClientConfig } from './types';

// Cache the loaded config in memory
let cachedConfig: ClientConfig | null = null;
let cachedClientId: string | null = null;

/**
 * Get the current client ID from the environment.
 * Defaults to "tsc" if CLIENT_ID is not set.
 */
export function getClientId(): string {
  return process.env.CLIENT_ID || 'tsc';
}

/**
 * Get the client config for the current CLIENT_ID.
 * Uses dynamic require to load the generated JSON at runtime.
 * Caches the result for the lifetime of the process.
 */
export function getClientConfig(): ClientConfig {
  const clientId = getClientId();

  if (cachedConfig && cachedClientId === clientId) {
    return cachedConfig;
  }

  try {
    // Dynamic import of the generated JSON
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const config = require(`./generated/${clientId}.json`) as ClientConfig;
    cachedConfig = config;
    cachedClientId = clientId;
    return config;
  } catch {
    console.warn(`[kernel/client] Config not found for client "${clientId}", using fallback`);
    return getFallbackConfig(clientId);
  }
}

/**
 * Minimal fallback config when the generated JSON doesn't exist.
 * This allows the site to build even without running sync-kernel first.
 */
function getFallbackConfig(clientId: string): ClientConfig {
  return {
    clientId,
    version: '0.0.0',
    generatedAt: new Date().toISOString(),
    brand: {
      name: { full: clientId, short: clientId, abbreviation: clientId.toUpperCase() },
      archetype: { primary: '', secondary: '' },
      values: [],
      purpose: { mission: '', vision: '' },
      brandPromise: '',
      personality: { traits: [], weAre: [], weAreNot: [] },
    },
    message: {
      coreClaims: [],
      narrativeFrames: [],
      terminology: { preferred: [], forbidden: [], proprietary: [] },
      elevatorPitches: { tenSecond: '', thirtySecond: '' },
      taglines: [],
    },
    content: {
      voiceRules: [],
      structuralPatterns: [],
      stylisticMarkers: {
        sentenceLength: '',
        paragraphLength: '',
        useOfLists: '',
        useOfQuestions: '',
        useOfHumor: '',
        useOfJargon: '',
      },
    },
    visual: {
      colorPalette: { primary: [], secondary: [], accent: [] },
      typography: { primaryFont: '', headingStyle: '', bodyStyle: '' },
    },
    icp: {
      primary: {
        label: '',
        titles: [],
        seniority: '',
        painPoints: [],
        successMetrics: [],
        worldview: '',
      },
      companyProfile: { industries: [], employeeRange: '', revenueRange: '' },
    },
    jtbd: [],
    offerings: [],
    constraints: {
      forbiddenTopics: [],
      forbiddenClaims: [],
      brandGuardrails: [],
      filteringRules: {
        includeKeywords: [],
        excludeKeywords: [],
        requireTopicMarkers: [],
        qualityThresholds: { minRelevanceScore: 0.7, minQualityScore: 0.6 },
      },
    },
    leaders: [],
  };
}
