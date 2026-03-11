/**
 * Shared context builder for content generation.
 * Builds a rich context string from the GTM kernel for any content type.
 * Universal — works for any brand/client, not TSC-specific.
 */

import { getClientConfig } from '@/lib/kernel/client';
import type { ClientConfig } from '@/lib/kernel/types';

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
