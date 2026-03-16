/**
 * Client config accessor.
 * Reads the generated kernel JSON for the current CLIENT_ID.
 * All components/pages import from here instead of hardcoding values.
 *
 * Two access modes:
 *   getClientConfig()      — sync, reads build-time generated JSON (for SSR/components)
 *   getClientConfigAsync() — async, fetches live from REST API if env vars are set (for cron jobs)
 */

import type { ClientConfig } from './types';
import { extractConfig } from './extract';

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
 * Fetch the latest kernel from the REST API and return a fresh ClientConfig.
 * Falls back to getClientConfig() (build-time JSON) if env vars are not set or the API fails.
 *
 * Use this in cron jobs and server actions where freshness matters more than speed.
 * env vars required: KERNEL_REST_URL, KERNEL_API_KEY, KERNEL_ID
 */
export async function getClientConfigAsync(): Promise<ClientConfig> {
  const restUrl = process.env.KERNEL_REST_URL;
  const apiKey = process.env.KERNEL_API_KEY;
  const kernelId = process.env.KERNEL_ID;
  const clientId = getClientId();

  if (restUrl && apiKey && kernelId) {
    try {
      const response = await fetch(`${restUrl}/kernels/${kernelId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        // Cache for 1 hour in Next.js fetch cache
        next: { revalidate: 3600 },
      });

      if (response.ok) {
        const json = await response.json();

        // API response shape: { data: { identity, radical_buyer, product, ... } }
        if (json.data) {
          const config = extractConfig(json.data, clientId);
          // Warm the sync cache so subsequent getClientConfig() calls in the same process get fresh data
          cachedConfig = config;
          cachedClientId = clientId;
          return config;
        }
      } else {
        console.warn(`[kernel/client] API returned ${response.status} — falling back to build-time config`);
      }
    } catch (err) {
      console.warn('[kernel/client] API fetch failed — falling back to build-time config:', err);
    }
  }

  return getClientConfig();
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
