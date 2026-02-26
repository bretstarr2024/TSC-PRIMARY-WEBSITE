Review data integrity — MongoDB schema consistency, race conditions, pipeline data flow, collection scoping.

## Context
Read these files first to understand the project conventions:
- `CLAUDE.md` — database is `tsc` (never `aeo`), content types, pipeline rules
- `lib/mongodb.ts` — connection singleton, database name
- `lib/content-db.ts` — blog posts + content queue operations
- `lib/resources-db.ts` — all other content type CRUD (FAQ, glossary, comparison, expert-qa, news, case_study, industry_brief, video, tool)
- `lib/pipeline/schemas.ts` — Zod schemas for generated content validation
- `lib/pipeline/content-guardrails.ts` — quality checks, dedup, caps
- `app/api/cron/generate-content/route.ts` — the main pipeline handler

## What to Check

1. **Database name consistency** — Verify `tsc` is the ONLY database name used:
   - `lib/mongodb.ts` should have `mongoClient.db('tsc')` and nothing else
   - Search entire codebase for string `'aeo'` or `"aeo"` in MongoDB contexts — must be zero matches
   - Check scripts (`scripts/*.ts`) for hardcoded database names

2. **Collection naming consistency** — Verify all MongoDB collection references match:
   - `leads` — used in `app/api/lead/route.ts`
   - `interactions` — used in `app/api/track/route.ts`
   - `arcade_bosses` — used in `app/api/arcade-boss/route.ts`
   - `content_queue` — used in `lib/content-db.ts`
   - `pipeline_logs` — used in `lib/pipeline/logger.ts`
   - Blog/content collections in `lib/content-db.ts` and `lib/resources-db.ts`
   - Check for typos or inconsistent collection names across files

3. **Schema validation with Zod** — Read `lib/pipeline/schemas.ts`:
   - Are all 10 content types (blog, faq, glossary, comparison, expert-qa, news, case_study, industry_brief, video, tool) covered by Zod schemas?
   - Do the Zod schemas match the fields written to MongoDB in `lib/resources-db.ts`?
   - Are there fields in the DB write that aren't in the Zod schema, or vice versa?
   - Is `parseGeneratedContent()` handling all content types?

4. **Content queue state machine** — Check `lib/content-db.ts` for queue item lifecycle:
   - States should be: `pending` → `generating` → `published` or `failed`
   - Can items get stuck in `generating` state? Is there a timeout/recovery mechanism?
   - Are state transitions atomic (using MongoDB update conditions)?
   - What happens if the cron job crashes mid-generation? Are items recoverable?

5. **Race conditions in pipeline** — The generate-content cron runs daily. Check:
   - Can two concurrent invocations process the same queue item? (no locking visible)
   - `publishedToday` counter is in-memory — does it account for items published by previous runs today?
   - Budget tracking (`totalSpend`) resets each run — is cross-run daily budget enforced at DB level?

6. **Data consistency in writes** — For each content type write in `app/api/cron/generate-content/route.ts`:
   - The `writeContentToDb()` function casts everything with `as` — are there type mismatches?
   - Empty string fallbacks (`|| ''`) for required fields — will these create invalid documents?
   - The `common` object adds `clusterName`, `status`, `origin`, `publishedAt` — are these consistently present?

7. **Index coverage** — Cross-reference known indexes with actual query patterns:
   - `pipeline_logs`: Has `timestamp_desc`, `contentId_timestamp`, `ttl_30d` — are all queries using indexed fields?
   - `interactions`: Has `timestamp_desc`, `ctaId_timestamp`, `sessionId_timestamp`, `ttl_180d`
   - `leads`: Has `timestamp_desc`
   - `content_queue`: What indexes exist? Are `getNextPendingItems()` queries indexed?
   - `arcade_bosses`: Any indexes? Needed?

8. **TTL safety** — Check:
   - `pipeline_logs` TTL is 30 days — appropriate for debugging
   - `interactions` TTL is 180 days — appropriate for analytics
   - `leads` has NO TTL — correct, leads are permanent
   - `arcade_bosses` has no TTL — is this intentional?
   - Are TTL indexes set on the correct field (`timestamp` vs `createdAt` vs other)?

9. **ID generation** — Check how content IDs (slugs, faqId, termId, etc.) are generated:
   - Are they deterministic or random?
   - Can collisions occur?
   - Are they URL-safe?

## Anti-Patterns to Flag
- Database name `aeo` anywhere in the codebase (must be `tsc`)
- Queue items that can get stuck in `generating` state with no recovery
- In-memory budget/cap tracking that doesn't account for previous cron runs on the same day
- `as` type casts on MongoDB document fields without runtime validation
- Missing indexes on query patterns used by cron jobs
- Inconsistent `timestamp` vs `createdAt` field names across collections

## Output Format
Report findings as:
- **CRITICAL**: [issue] — [file:line] — [why it matters]
- **WARNING**: [issue] — [file:line] — [recommendation]
- **INFO**: [observation] — [file:line]

End with: Summary paragraph + Top 3 recommended actions.
