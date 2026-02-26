Review MongoDB query patterns — index usage, unbounded fetches, connection handling, collection operations.

## Context
Read these files first:
- `CLAUDE.md` — database is `tsc`, content types, collection names
- `lib/mongodb.ts` — connection singleton
- `lib/content-db.ts` — blog posts + content queue CRUD
- `lib/resources-db.ts` — all other content type CRUD (9 types)
- `lib/pipeline/logger.ts` — pipeline_logs writes
- `app/api/lead/route.ts` — leads collection write
- `app/api/track/route.ts` — interactions collection write
- `app/api/arcade-boss/route.ts` — arcade_bosses collection write

## What to Check

1. **Connection management** — Review `lib/mongodb.ts`:
   - Singleton pattern: `let client: MongoClient | null` — is this safe in serverless?
   - Vercel serverless functions may share the module cache between warm invocations — singleton reuse is correct
   - But: is `closeConnection()` ever called? If not, connections may leak on serverless cold starts
   - Is there a connection pool size configuration? (`MongoClient` defaults to 100 connections — too many for serverless)
   - Should use `{ maxPoolSize: 10 }` or similar for Vercel serverless

2. **Read queries — index alignment** — For each collection, check query patterns vs known indexes:
   - **content_queue**:
     - `getNextPendingItems()` — what fields does it filter on? (status, contentType). Are these indexed?
     - Does it use `.sort()` — on what field? Is that field indexed?
   - **blogs / content collections**:
     - List queries: What fields are queried? (status, slug, tags). Are these indexed?
     - Single-item lookups: By slug/ID — indexed?
   - **pipeline_logs**: Has indexes on timestamp and contentId — are queries using these fields?

3. **Write patterns** — Check for:
   - `insertOne` vs `insertMany` — are bulk operations used where appropriate?
   - `updateOne` with proper filter conditions (avoiding full collection scans)
   - `findOneAndUpdate` with `returnDocument: 'after'` for atomic state transitions
   - Are write concerns set? (default is `w:1` which is fine for this use case)

4. **Unbounded queries** — Search for any `find()` without `.limit()`:
   - `lib/content-db.ts` — all list operations must have limits
   - `lib/resources-db.ts` — all list operations must have limits
   - `getNextPendingItems()` — does it limit results to the daily cap?
   - Are there any `toArray()` calls on potentially large result sets?

5. **Projection usage** — Check if queries fetch only needed fields:
   - List queries for content pages — do they project only the fields needed for cards/listings?
   - Or do they fetch full document bodies (content, fullDefinition, etc.) when only titles are needed?

6. **Aggregation pipelines** — Search for any `.aggregate()` calls:
   - Are pipeline stages ordered efficiently? (`$match` before `$sort`, `$limit` early)
   - Are there `$lookup` stages that could cause N+1 patterns?

7. **TTL index correctness** — Verify:
   - `pipeline_logs` TTL on `timestamp` field, 30 days — matches the `createdAt`/`timestamp` field name used in writes?
   - `interactions` TTL on `timestamp` field, 180 days — same check
   - `leads` has NO TTL — correct (leads are permanent)
   - Are TTL index field names exactly matching what the write operations use?

8. **Collection naming** — Verify consistent collection name strings across all files:
   - Search for all `db.collection('...')` calls and `collection('...')` patterns
   - Known collections: `leads`, `interactions`, `arcade_bosses`, `content_queue`, `pipeline_logs`, plus content type collections
   - Flag any typos or inconsistencies

9. **Error handling on DB operations** — Check:
   - Are MongoDB errors caught and classified? (network errors vs validation errors vs timeout)
   - Do failed DB operations cause API endpoints to 500, or is there graceful degradation?
   - `app/api/track/route.ts` and `app/api/arcade-boss/route.ts` have try/catch around DB ops — does `/api/lead`?

10. **Connection string safety** — Verify:
    - `MONGODB_URI` is read from `process.env` only in `lib/mongodb.ts`
    - No secondary connection patterns elsewhere
    - No connection string logged or returned in responses

## Anti-Patterns to Flag
- `find()` without `.limit()` on any collection
- Missing indexes on fields used in `$match`/`$sort` operations
- Full document fetches when only a subset of fields is needed (missing `projection`)
- `new MongoClient()` outside of `lib/mongodb.ts`
- Connection pool not configured for serverless (`maxPoolSize` too high)
- TTL index field name mismatch (e.g., index on `timestamp` but write uses `createdAt`)
- Inconsistent collection name strings across files
- `toArray()` on unbounded queries

## Output Format
Report findings as:
- **CRITICAL**: [issue] — [file:line] — [why it matters]
- **WARNING**: [issue] — [file:line] — [recommendation]
- **INFO**: [observation] — [file:line]

End with: Summary paragraph + Top 3 recommended actions.
