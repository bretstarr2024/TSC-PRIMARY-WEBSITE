/**
 * Shared context builder for content generation.
 * Builds a rich context string from the GTM kernel for any content type.
 * Universal — works for any brand/client, not TSC-specific.
 */

import { getClientConfig } from '@/lib/kernel/client';
import type { ClientConfig } from '@/lib/kernel/types';

/**
 * Build the kernel-driven portion of the brand voice system prompt.
 * Sources brand identity, voice rules, terminology, and guardrails directly
 * from the generated kernel JSON — no hardcoded values for brand data.
 * Called by content-prompts.ts; combined with the static prompt-engineering layer there.
 */
export function buildBrandVoiceContext(kernel?: ClientConfig): string {
  const config = kernel || getClientConfig();
  const { brand, message, content, leaders, constraints } = config;
  const lines: string[] = [];

  // Identity
  lines.push(`You are writing content for ${brand.name.full} (${brand.name.short}).`);
  lines.push('');

  // Archetype + personality
  lines.push(`BRAND ARCHETYPE: ${brand.archetype.primary} (primary) + ${brand.archetype.secondary} (secondary)`);
  if (brand.personality.weAre.length > 0) {
    lines.push(`We are: ${brand.personality.weAre.join(', ')}`);
  }
  if (brand.personality.weAreNot.length > 0) {
    lines.push(`We are not: ${brand.personality.weAreNot.join(', ')}`);
  }
  lines.push('');

  // Brand values
  if (brand.values.length > 0) {
    lines.push('BRAND VALUES:');
    brand.values.forEach((v) => lines.push(`- ${v.value}: ${v.definition}`));
    lines.push('');
  }

  // Leadership
  if (leaders.length > 0) {
    lines.push('LEADERSHIP (rotate attribution naturally):');
    leaders.forEach((l) => lines.push(`- ${l.name} — ${l.title}. ${l.shortBio}`));
    lines.push('');
  }

  // Voice rules with examples
  if (content.voiceRules.length > 0) {
    lines.push('VOICE RULES:');
    content.voiceRules.forEach((r, i) => {
      lines.push(`${i + 1}. ${r.rule}`);
      if (r.exampleGood) lines.push(`   Good: "${r.exampleGood}"`);
      if (r.exampleBad) lines.push(`   Bad: "${r.exampleBad}"`);
    });
    lines.push('');
  }

  // Stylistic markers
  const sm = content.stylisticMarkers;
  const smEntries = [
    sm.sentenceLength && `Sentence length: ${sm.sentenceLength}`,
    sm.paragraphLength && `Paragraphs: ${sm.paragraphLength}`,
    sm.useOfLists && `Lists: ${sm.useOfLists}`,
    sm.useOfHumor && `Humor: ${sm.useOfHumor}`,
    sm.useOfJargon && `Jargon: ${sm.useOfJargon}`,
  ].filter(Boolean);
  if (smEntries.length > 0) {
    lines.push('STYLISTIC GUIDELINES:');
    smEntries.forEach((e) => lines.push(`- ${e}`));
    lines.push('');
  }

  // Structural patterns
  if (content.structuralPatterns.length > 0) {
    lines.push('STRUCTURAL PATTERNS:');
    content.structuralPatterns.forEach((p) =>
      lines.push(`- ${p.patternName}: ${p.structure} (when to use: ${p.whenToUse})`)
    );
    lines.push('');
  }

  // Preferred terminology
  const preferredTerms = message.terminology.preferred.filter((t) => t.insteadOf);
  if (preferredTerms.length > 0) {
    lines.push('PREFERRED TERMINOLOGY (always use these):');
    preferredTerms.forEach((t) => lines.push(`- "${t.insteadOf}" → "${t.term}"`));
    lines.push('');
  }

  // Forbidden terminology
  if (message.terminology.forbidden.length > 0) {
    lines.push('FORBIDDEN TERMS (zero tolerance — content will be rejected if used):');
    message.terminology.forbidden.forEach((t) =>
      lines.push(`- "${t.term}" → use "${t.replacement}" instead`)
    );
    lines.push('');
  }

  // Brand guardrails
  if (constraints.brandGuardrails.length > 0) {
    lines.push('BRAND GUARDRAILS:');
    constraints.brandGuardrails.forEach((g) => lines.push(`- ${g.guardrail} (${g.rationale})`));
    lines.push('');
  }

  // Forbidden claims
  if (constraints.forbiddenClaims.length > 0) {
    lines.push('NEVER CLAIM:');
    constraints.forbiddenClaims.forEach((c) => lines.push(`- ${c}`));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Build a rich context string from the kernel for a given query/cluster.
 * This context is passed to content generation prompts so the AI
 * understands the brand's products, positioning, and buyer context.
 */
export function buildKernelContext(
  clusterName?: string,
  targetQueries?: string[],
  kernel?: ClientConfig
): string {
  const config = kernel || getClientConfig();
  const parts: string[] = [];

  // Target queries (what triggered this content)
  if (targetQueries && targetQueries.length > 0) {
    parts.push(`Target queries: ${targetQueries.join(', ')}`);
  }

  // Find matching JTBD cluster
  if (clusterName) {
    const cluster = config.jtbd.find((j) => j.jobName === clusterName);
    if (cluster) {
      parts.push(`JTBD: ${cluster.jobName}`);
      parts.push(`Starting state: ${cluster.startingState}`);
      parts.push(`Desired state: ${cluster.desiredState}`);
      parts.push(`Obstacles: ${cluster.obstacles.join(', ')}`);
    }
  }

  // Add ICP context
  parts.push(`ICP: ${config.icp.primary.label}`);
  parts.push(`Pain points: ${config.icp.primary.painPoints.slice(0, 3).join(', ')}`);

  // Brand promise
  parts.push(`Brand promise: ${config.brand.brandPromise}`);

  // Core claims
  if (config.message.coreClaims.length > 0) {
    parts.push(`Core claims: ${config.message.coreClaims.map((c) => c.claim).join(' | ')}`);
  }

  // Value proposition / elevator pitch
  if (config.message.elevatorPitches.thirtySecond) {
    parts.push(`Value proposition: ${config.message.elevatorPitches.thirtySecond}`);
  }

  // Offerings — include all so the AI can connect content to relevant products/services
  if (config.offerings.length > 0) {
    const offeringSummary = config.offerings
      .flatMap((cat) =>
        cat.services.map((s) => `${s.name}: ${s.description}`)
      )
      .join('\n  - ');
    parts.push(`Products & services:\n  - ${offeringSummary}`);
  }

  return parts.join('\n');
}
