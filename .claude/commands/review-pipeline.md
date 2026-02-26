Review the autonomous content generation pipeline — idempotency, error recovery, data flow, cost controls, logging.

## Context
Read these files first:
- `CLAUDE.md` — pipeline daily budget, content types, invariants
- `app/api/cron/generate-content/route.ts` — main pipeline handler
- `app/api/cron/seed-content-queue/route.ts` — queue seeding cron
- `app/api/cron/sync-jtbd-coverage/route.ts` — JTBD coverage sync cron
- `lib/pipeline/content-guardrails.ts` — caps, budget, quality checks, dedup
- `lib/pipeline/content-prompts.ts` — per-type system/user prompts
- `lib/pipeline/openai-client.ts` — OpenAI API wrapper
- `lib/pipeline/schemas.ts` — Zod schemas for content validation
- `lib/pipeline/circuit-breaker.ts` — OpenAI circuit breaker
- `lib/pipeline/error-classifier.ts` — error categorization
- `lib/pipeline/logger.ts` — pipeline_logs writer
- `lib/pipeline/cost-estimator.ts` — token/cost estimation
- `lib/pipeline/timeout-guard.ts` — timeout wrapper
- `lib/content-db.ts` — content queue operations (getNextPendingItems, updateQueueItemStatus, etc.)
- `vercel.json` — cron schedules (seed at 7:30 UTC, generate at 8:00 UTC, sync 1st of month at 3:00 UTC)

## What to Check

1. **Pipeline data flow** — Trace the full lifecycle:
   - `sync-jtbd-coverage` (monthly) → writes JTBD query coverage data
   - `seed-content-queue` (daily 7:30 UTC) → reads coverage → writes `content_queue` items with status `pending`
   - `generate-content` (daily 8:00 UTC) → reads `pending` items → generates → writes to content collections → updates queue to `published`/`failed`
   - Is the 30-minute gap between seed and generate sufficient?
   - What happens if seed hasn't finished when generate starts?

2. **Queue state machine integrity** — In `lib/content-db.ts`:
   - States: `pending` → `generating` → `published` | `failed`
   - Is the `pending` → `generating` transition atomic? (use `findOneAndUpdate` with status condition)
   - Can items get stuck in `generating` if the function crashes/times out?
   - Is there a recovery mechanism for stuck items? (e.g., reset items stuck in `generating` for >10 minutes)
   - `maxDuration` is 300s (5 min) on generate-content — what happens at timeout?

3. **Cost controls** — Verify enforcement:
   - Daily budget: $5/day (`DAILY_BUDGET_USD`) — is this enforced across multiple runs on the same day?
   - Current implementation: `totalSpend` is in-memory and resets each invocation — **flag this**
   - Per-type caps (`DAILY_CAPS`): `publishedToday` counter is also in-memory — does it query the DB for items already published today?
   - What's the actual model being used in `openai-client.ts`? (GPT-4 vs GPT-3.5 vs GPT-4o — huge cost difference)

4. **Error handling and recovery** — Check:
   - `error-classifier.ts`: Does it categorize retryable vs non-retryable errors?
   - Are API rate limits (429) handled with backoff?
   - Does the circuit breaker properly protect against cascading OpenAI failures?
   - Circuit breaker state is in-memory (module-level singleton) — does it persist across serverless cold starts? (No — each invocation starts fresh. Is this appropriate?)
   - If one item fails, does the pipeline continue processing remaining items? (yes, via the for loop — verify)

5. **Content quality gates** — Review `content-guardrails.ts`:
   - Forbidden terms list: `thought leader`, `synergy`, `pioneers of aeo`, `customer`, `contract`, `vendor`
   - Is "fractional CMO" blocked? (CLAUDE.md says no fractional CMO content)
   - Brand voice scoring: Starting at 70, various adjustments. Is the scoring too lenient or too strict?
   - Jaccard title dedup: Threshold is 0.50 — is this appropriate? (0.50 is fairly loose)
   - `existingTitles` is passed to `runPreFlight` — where does it come from? Is the full title list loaded from DB or just in-memory from this run?

6. **Prompt engineering** — Read `content-prompts.ts`:
   - Do prompts include the forbidden terms list so the LLM avoids them?
   - Do prompts specify the brand voice rules (conversational, Sage + Rebel, "clients" not "customers")?
   - Is there a system prompt that establishes TSC context consistently?
   - Are expert-qa prompts rotating experts correctly? (Bret Starr, Racheal Bates, JJ La Pata)

7. **Schema validation completeness** — Read `lib/pipeline/schemas.ts`:
   - Does every Zod schema match its corresponding DB write function in `resources-db.ts`?
   - Are slug/ID fields validated for URL-safety?
   - Are required fields truly required (not `.optional()`)?
   - Does `parseGeneratedContent` handle malformed JSON from OpenAI gracefully?

8. **Logging and observability** — Read `lib/pipeline/logger.ts`:
   - Is every pipeline phase logged? (preflight, generation, validation, quality check, DB write)
   - Are errors logged with enough context to debug? (contentId, pipelineRunId, phase)
   - Is the `pipeline_logs` TTL (30 days) sufficient for debugging production issues?
   - Are cost estimates logged for budget tracking?

9. **Timeout safety** — Read `lib/pipeline/timeout-guard.ts`:
   - Is it used in the generate-content handler?
   - What happens when OpenAI takes >60s to respond?
   - Does the Vercel 300s `maxDuration` leave enough headroom?

## Anti-Patterns to Flag
- In-memory budget/cap tracking that doesn't query DB for same-day totals
- Queue items stuck in `generating` with no recovery mechanism
- Circuit breaker state lost on cold starts (may re-trigger failures)
- `Promise.all` on multiple OpenAI calls without individual error handling
- Missing "fractional CMO" in forbidden terms list
- Jaccard dedup not loading existing titles from DB (only in-memory)
- No backoff/retry on OpenAI rate limits
- `maxDuration` set but no internal timeout guard before the edge

## Output Format
Report findings as:
- **CRITICAL**: [issue] — [file:line] — [why it matters]
- **WARNING**: [issue] — [file:line] — [recommendation]
- **INFO**: [observation] — [file:line]

End with: Summary paragraph + Top 3 recommended actions.
