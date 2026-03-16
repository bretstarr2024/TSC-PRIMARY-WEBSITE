/**
 * Build-time kernel sync script.
 * Reads the GTM Kernel from the REST API (preferred) or a local YAML file (fallback).
 *
 * Usage: tsx scripts/sync-kernel.ts [clientId]
 * Default clientId: from CLIENT_ID env var or "tsc"
 *
 * API source (preferred):
 *   KERNEL_REST_URL  — base URL, e.g. https://gtm-kernel-backend-production.up.railway.app
 *   KERNEL_API_KEY   — Bearer token for the API
 *   KERNEL_ID        — kernel UUID (per-client)
 *
 * Local fallback source (when API env vars are not set):
 *   /Volumes/Queen Amara/GTM Kernel/gtm_kernel/kernels/{clientId}/kernel.yaml
 *
 * Output: lib/kernel/generated/{clientId}.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { extractConfig } from '../lib/kernel/extract';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KERNEL_BASE_PATH = '/Volumes/Queen Amara/GTM Kernel/gtm_kernel/kernels';
const OUTPUT_DIR = path.join(__dirname, '..', 'lib', 'kernel', 'generated');

function getClientId(): string {
  // CLI arg takes precedence, then env var, then default
  return process.argv[2] || process.env.CLIENT_ID || 'tsc';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchKernelFromAPI(): Promise<any | null> {
  const restUrl = process.env.KERNEL_REST_URL;
  const apiKey = process.env.KERNEL_API_KEY;
  const kernelId = process.env.KERNEL_ID;

  if (!restUrl || !apiKey || !kernelId) {
    return null;
  }

  console.log(`[sync-kernel] Fetching kernel from API: ${restUrl}/kernels/${kernelId}`);

  const response = await fetch(`${restUrl}/kernels/${kernelId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(`[sync-kernel] API returned ${response.status}: ${await response.text()}`);
  }

  const json = await response.json();

  // API response shape: { data: { identity, radical_buyer, product, market, knowledge_governance, ... } }
  if (!json.data) {
    throw new Error('[sync-kernel] API response missing .data field');
  }

  return json.data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadKernelFromDisk(clientId: string): any {
  const kernelPath = path.join(KERNEL_BASE_PATH, clientId, 'kernel.yaml');

  console.log(`[sync-kernel] Reading local kernel: ${kernelPath}`);

  if (!fs.existsSync(kernelPath)) {
    console.error(`[sync-kernel] ERROR: Kernel not found at ${kernelPath}`);
    console.log('[sync-kernel] Skipping kernel sync — website will use existing generated JSON');
    process.exit(0); // Don't fail the build
  }

  const raw = fs.readFileSync(kernelPath, 'utf-8');
  return yaml.load(raw);
}

async function main() {
  const clientId = getClientId();

  console.log(`[sync-kernel] Syncing kernel for client: ${clientId}`);

  // Try API first, fall back to local YAML
  let kernel: unknown;
  const hasApiConfig = process.env.KERNEL_REST_URL && process.env.KERNEL_API_KEY && process.env.KERNEL_ID;

  if (hasApiConfig) {
    try {
      kernel = await fetchKernelFromAPI();
      console.log('[sync-kernel] Kernel loaded from REST API');
    } catch (err) {
      console.warn('[sync-kernel] API fetch failed, falling back to local YAML:', err);
      kernel = loadKernelFromDisk(clientId);
    }
  } else {
    console.log('[sync-kernel] No API env vars set — using local YAML');
    kernel = loadKernelFromDisk(clientId);
  }

  const config = extractConfig(kernel, clientId);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const outputPath = path.join(OUTPUT_DIR, `${clientId}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));

  console.log(`[sync-kernel] Generated: ${outputPath}`);
  console.log(`[sync-kernel] Brand: ${config.brand.name.full}`);
  console.log(`[sync-kernel] Offerings: ${config.offerings.length} categories, ${config.offerings.reduce((sum, c) => sum + c.services.length, 0)} services`);
  console.log(`[sync-kernel] JTBD clusters: ${config.jtbd.length}`);
  console.log(`[sync-kernel] Leaders: ${config.leaders.length}`);
  console.log('[sync-kernel] Done.');
}

main().catch((err) => {
  console.error('[sync-kernel] Fatal error:', err);
  process.exit(1);
});
