Review all API route contracts — request validation, response shapes, error handling, auth middleware.

## Context
Read these files first:
- `CLAUDE.md` — project conventions, deploy rules
- `app/api/lead/route.ts` — POST: lead capture (name, email, message, source, ctaId)
- `app/api/track/route.ts` — POST: CTA interaction tracking
- `app/api/arcade-boss/route.ts` — POST: arcade high score submission
- `app/api/cron/generate-content/route.ts` — GET: autonomous content generation
- `app/api/cron/seed-content-queue/route.ts` — GET: content queue seeding
- `app/api/cron/sync-jtbd-coverage/route.ts` — GET: JTBD coverage sync
- `vercel.json` — cron schedules

## What to Check

1. **Request validation completeness** — For each public endpoint:
   - `/api/lead` POST: Validates name + email required, email regex. But:
     - Is `message` field length-bounded?
     - Is `source` validated against known values (contact, careers)?
     - Is `ctaId` validated against the CTA ID registry?
     - Can extra fields be injected via the JSON body?
   - `/api/track` POST: Validates `type` and `sessionId` exist, then `...body` spreads everything into MongoDB. Flag this.
   - `/api/arcade-boss` POST: Validates `email` and `game` exist. But:
     - Is `email` format validated?
     - Is `game` validated against known game names?
     - Is `score` validated as a number?
     - Is `initials` length-bounded (should be 3 chars)?

2. **Response shape consistency** — Check that all endpoints follow a consistent pattern:
   - Success: `{ success: true }` or `{ ok: true }` — are these inconsistent?
   - Error: `{ error: "message" }` with appropriate HTTP status
   - Do cron endpoints return structured results with `status`, `summary`, etc.?

3. **HTTP method handling** — Verify:
   - Each route only exports the expected method (POST for public, GET for crons)
   - Unexpected methods return 405 (Next.js handles this by default, but verify)

4. **Error response leakage** — Check that error responses don't expose:
   - Stack traces
   - Internal error messages from MongoDB or Resend
   - Environment variable values
   - File paths or server internals

5. **Cron auth pattern** — All three cron routes should:
   - Read `CRON_SECRET` from env
   - Compare against `Authorization: Bearer <token>` header
   - Return 401 on mismatch
   - **CRITICAL CHECK**: What happens when `CRON_SECRET` is not set? Current code in generate-content allows all requests — is this replicated in seed and sync routes?

6. **Timeout and limits** — Check:
   - `maxDuration` is set on cron routes (Vercel serverless function timeout)
   - Is `maxDuration` set on the lead and track endpoints? (should be short — 10s max)
   - Is there a request body size limit? (Next.js default is 1MB but should be explicit for public endpoints)

7. **Idempotency** — Check:
   - Can the same lead be submitted twice? (duplicate email + name)
   - Can the same tracking event be sent twice? (duplicate sessionId + timestamp)
   - Can the same arcade boss claim be sent twice? (duplicate email + game)
   - Are cron jobs idempotent if they run twice in the same day?

8. **Email sending reliability** — In lead and arcade-boss routes:
   - Emails are sent via `Promise.all` — if one fails, does the other still send?
   - Is there retry logic on email failures?
   - Are email sending errors properly caught and logged?

## Anti-Patterns to Flag
- `...body` spread into MongoDB without field allowlisting (`/api/track`)
- Inconsistent success response shapes (`{ success: true }` vs `{ ok: true }`)
- CRON_SECRET not set = open access (should default to DENY)
- No rate limiting on any public endpoint
- Email failures in `Promise.all` causing both to fail (one rejection kills both)
- Missing input length validation on string fields

## Output Format
Report findings as:
- **CRITICAL**: [issue] — [file:line] — [why it matters]
- **WARNING**: [issue] — [file:line] — [recommendation]
- **INFO**: [observation] — [file:line]

End with: Summary paragraph + Top 3 recommended actions.
