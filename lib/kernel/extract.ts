/**
 * Shared kernel extraction logic.
 * Converts raw kernel JSON/YAML structure → typed ClientConfig.
 * Used by both scripts/sync-kernel.ts (build-time) and lib/kernel/client.ts (runtime).
 */

import type { ClientConfig } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractConfig(kernel: any, clientId: string): ClientConfig {
  const identity = kernel.identity || {};
  const brand = identity.brand || {};
  const message = identity.message || {};
  const content = identity.content || {};
  const visual = identity.visual || {};
  const product = kernel.product || {};
  const offerings = product.offerings || {};
  const radicalBuyer = kernel.radical_buyer || {};
  const icp = radicalBuyer.icp || {};
  const jtbdRaw = radicalBuyer.jtbd || [];
  const constraints = kernel.knowledge_governance?.constraints || {};

  return {
    clientId,
    version: kernel.version || '1.0.0',
    generatedAt: new Date().toISOString(),

    brand: {
      name: {
        full: brand.name?.full_name || brand.name?.full || brand.name?.legal_name || clientId,
        short: brand.name?.short_name || brand.name?.short || clientId,
        abbreviation: brand.name?.abbreviation || brand.name?.short_name || clientId.toUpperCase(),
      },
      archetype: {
        primary: brand.archetype?.primary || '',
        secondary: brand.archetype?.secondary || '',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      values: (brand.values || []).map((v: any) => ({
        value: v.value || v.name || '',
        definition: v.definition || v.description || '',
      })),
      purpose: {
        mission: brand.purpose?.mission || '',
        vision: brand.purpose?.vision || '',
      },
      brandPromise: brand.brand_promise || '',
      personality: {
        traits: brand.personality?.traits || [],
        weAre: brand.personality?.we_are || [],
        weAreNot: brand.personality?.we_are_not || [],
      },
    },

    message: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      coreClaims: (message.core_claims || []).map((c: any) => ({
        claim: c.claim || '',
        proof: c.proof_type || c.proof || '',
        whenToUse: c.when_to_use || '',
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      narrativeFrames: (message.narrative_frames || []).map((f: any) => ({
        name: f.frame_name || f.name || '',
        before: f.before_state || f.before || '',
        after: f.after_state || f.after || '',
      })),
      terminology: {
        preferred: Object.entries(message.terminology?.preferred_terms || {}).map(([key, val]: [string, unknown]) => ({
          term: typeof val === 'string' ? val : key,
          insteadOf: typeof val === 'string' ? key : '',
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        forbidden: (message.terminology?.forbidden_terms || []).map((t: any) => ({
          term: t.term || '',
          replacement: t.alternative || t.replacement || '',
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        proprietary: (message.terminology?.proprietary_terms || []).map((t: any) =>
          typeof t === 'string' ? t : t.term || ''
        ),
      },
      elevatorPitches: {
        tenSecond: message.elevator_pitches?.['10_second'] || '',
        thirtySecond: message.elevator_pitches?.['30_second'] || '',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      taglines: (message.taglines || []).map((t: any) =>
        typeof t === 'string' ? t : t.tagline || ''
      ),
    },

    content: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      voiceRules: (content.voice_rules || []).map((r: any) => ({
        rule: r.rule || '',
        exampleGood: r.example_good || '',
        exampleBad: r.example_bad || '',
        rationale: r.rationale || '',
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      structuralPatterns: (content.structural_patterns || []).map((p: any) => ({
        patternName: p.pattern_name || '',
        structure: p.structure || '',
        whenToUse: p.when_to_use || '',
      })),
      stylisticMarkers: {
        sentenceLength: content.stylistic_markers?.sentence_length || '',
        paragraphLength: content.stylistic_markers?.paragraph_length || '',
        useOfLists: content.stylistic_markers?.use_of_lists || '',
        useOfQuestions: content.stylistic_markers?.use_of_questions || '',
        useOfHumor: content.stylistic_markers?.use_of_humor || '',
        useOfJargon: content.stylistic_markers?.use_of_jargon || '',
      },
    },

    visual: {
      colorPalette: {
        primary: visual.color_palette?.primary || [],
        secondary: visual.color_palette?.secondary || [],
        accent: visual.color_palette?.accent || [],
      },
      typography: {
        primaryFont: visual.typography?.primary_font || '',
        headingStyle: visual.typography?.heading_style || '',
        bodyStyle: visual.typography?.body_style || '',
      },
    },

    icp: {
      primary: {
        label: icp.primary?.label || '',
        titles: icp.primary?.titles || [],
        seniority: icp.primary?.seniority || '',
        painPoints: icp.primary?.pain_points || [],
        successMetrics: icp.primary?.success_metrics || [],
        worldview: icp.primary?.psychographics?.worldview || '',
      },
      companyProfile: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        industries: (icp.company_profile?.industries || []).map((i: any) =>
          typeof i === 'string' ? i : i.name || ''
        ),
        employeeRange: icp.company_profile?.sweet_spot?.employees || '',
        revenueRange: icp.company_profile?.sweet_spot?.revenue || '',
      },
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jtbd: (Array.isArray(jtbdRaw) ? jtbdRaw : jtbdRaw.clusters || jtbdRaw.jobs || []).map((j: any) => ({
      jobName: j.job_name || j.name || '',
      startingState: j.starting_state || '',
      desiredState: j.desired_state || '',
      obstacles: j.obstacles || [],
      hiringCriteria: j.hiring_criteria || [],
    })),

    // offerings.provided can be either:
    //   - object { categoryKey: [service, ...] }  (local YAML shape)
    //   - array  [{ name, offering_type, ... }]    (REST API shape)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offerings: (() => {
      const provided = offerings.provided;
      if (Array.isArray(provided)) {
        // API shape: flat array — group by offering_type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const byType: Record<string, any[]> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const s of (provided as any[])) {
          const key = s.offering_type || 'services';
          if (!byType[key]) byType[key] = [];
          byType[key].push(s);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.entries(byType).map(([key, services]: [string, any[]]) => ({
          categoryKey: key,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          services: services.map((s: any) => ({
            name: s.name || '',
            description: s.description || '',
            deliveryModel: s.delivery_model || '',
            typicalScope: s.typical_scope || '',
          })),
        }));
      }
      // YAML shape: object keyed by category
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return Object.entries(provided || {}).map(([key, services]: [string, any]) => ({
        categoryKey: key,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        services: (services || []).map((s: any) => ({
          name: s.name || '',
          description: s.description || '',
          deliveryModel: s.delivery_model || '',
          typicalScope: s.typical_scope || '',
        })),
      }));
    })(),

    constraints: {
      forbiddenTopics: constraints.content_restrictions?.forbidden_topics || [],
      forbiddenClaims: constraints.content_restrictions?.forbidden_claims || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      brandGuardrails: (constraints.brand_guardrails || []).map((g: any) => ({
        guardrail: g.guardrail || '',
        rationale: g.rationale || '',
      })),
      filteringRules: {
        includeKeywords: constraints.filtering_rules?.include_keywords || [],
        excludeKeywords: constraints.filtering_rules?.exclude_keywords || [],
        requireTopicMarkers: constraints.filtering_rules?.require_topic_markers || [],
        qualityThresholds: {
          minRelevanceScore: constraints.filtering_rules?.quality_thresholds?.min_relevance_score || 0.7,
          minQualityScore: constraints.filtering_rules?.quality_thresholds?.min_quality_score || 0.6,
        },
      },
    },

    leaders: extractLeaders(kernel, clientId),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractLeaders(kernel: any, clientId: string): ClientConfig['leaders'] {
  // The kernel doesn't have a dedicated "team" component, but leadership
  // is referenced across Components 5 (authority_artifacts), 15 (message),
  // and throughout. For now, we define per-client leader rosters here.
  // Future: add a team/leadership section to the kernel spec.

  const leadersByClient: Record<string, ClientConfig['leaders']> = {
    tsc: [
      {
        name: 'Bret Starr',
        title: 'Founder & CEO',
        shortBio: '25+ years in B2B marketing. Built and led agencies, launched products, and helped hundreds of companies find their market position.',
        linkedIn: 'https://www.linkedin.com/in/bretstarr/',
        youTube: 'https://www.youtube.com/@TheStarrConspiracy',
      },
      {
        name: 'Racheal Bates',
        title: 'Chief Experience Officer',
        shortBio: 'Leads client delivery and experience design. Ensures every engagement delivers measurable strategic outcomes.',
        linkedIn: 'https://www.linkedin.com/in/rachealbates/',
      },
      {
        name: 'JJ La Pata',
        title: 'Chief Strategy Officer',
        shortBio: 'Drives go-to-market strategy and demand generation for TSC clients. Expert in building B2B growth engines.',
        linkedIn: 'https://www.linkedin.com/in/jjlapata/',
      },
    ],
  };

  return leadersByClient[clientId] || [];
}
