Review security posture of this Next.js 14 codebase — auth, secrets, injection vectors, API safety.

## Context
Read these files first to understand the project conventions:
- `CLAUDE.md` — project instructions, deploy rules, env var expectations
- `app/api/lead/route.ts` — lead capture endpoint (public, stores in MongoDB, sends emails)
- `app/api/track/route.ts` — CTA tracking endpoint (public, stores in MongoDB)
- `app/api/arcade-boss/route.ts` — arcade high score endpoint (public, stores in MongoDB, sends emails)
- `app/api/cron/generate-content/route.ts` — cron route (must be auth-protected)
- `app/api/cron/seed-content-queue/route.ts` — cron route (must be auth-protected)
- `app/api/cron/sync-jtbd-coverage/route.ts` — cron route (must be auth-protected)
- `lib/mongodb.ts` — database connection
- `lib/tracking.ts` — client-side tracking (sendBeacon)
- `.env.local` — local environment variables (DO NOT output contents)

## What to Check

1. **Cron route authentication** — ALL three cron routes MUST verify `CRON_SECRET` via Bearer token in the Authorization header. Check that:
   - Each route calls a `verifyAuth()` function or equivalent
   - Returns 401 on auth failure
   - The fallback when CRON_SECRET is not set is appropriate (currently allows request — flag if still true)

2. **Input validation on public endpoints** — For each of `/api/lead`, `/api/track`, `/api/arcade-boss`:
   - Is `request.json()` wrapped in try/catch? (malformed JSON shouldn't 500)
   - Are string fields sanitized before MongoDB insertion? (NoSQL injection via `$gt`, `$regex` operators)
   - Are email addresses validated before being passed to Resend?
   - Is there rate limiting or abuse prevention? (can someone spam the lead endpoint?)
   - Are field lengths bounded? (can someone insert megabytes of text?)

3. **XSS vectors in email templates** — Check all HTML email templates in:
   - `app/api/lead/route.ts` (teamHtml, replyHtml)
   - `app/api/arcade-boss/route.ts` (teamHtml, replyHtml)
   - User-supplied data (name, email, message, initials, game) is interpolated directly into HTML. Flag any unescaped interpolation: `${data.name}`, `${data.email}`, `${data.message}`, `${playerInitials}`, `${email}`.

4. **Environment variable handling** — Check that:
   - `MONGODB_URI`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `CRON_SECRET` are never logged or returned in API responses
   - No env vars are exposed to the client (Next.js `NEXT_PUBLIC_` prefix check)
   - Fallback behavior when env vars are missing is safe (e.g., `CRON_SECRET` missing = open access?)

5. **MongoDB security** — Check:
   - Connection string is not hardcoded anywhere (must come from env)
   - Database name `tsc` is correct everywhere (never `aeo`)
   - No raw user input passed as MongoDB query operators (potential NoSQL injection via `$` prefix in field values)
   - The `interactions` collection accepts arbitrary body fields from `/api/track` — is this safe? (`...body` spread)

6. **Secrets in source control** — Scan for:
   - `.env` or `.env.local` not in `.gitignore`
   - Hardcoded API keys, tokens, or connection strings anywhere in the codebase
   - Comments containing real credentials or sensitive URLs

7. **CORS and headers** — Check:
   - Are API routes properly restricting CORS origins?
   - Is there a `middleware.ts` with security headers (X-Frame-Options, CSP, etc.)?
   - Does `next.config.mjs` set appropriate security headers?

8. **Client-side tracking privacy** — Review `lib/tracking.ts` and `components/TrackingProvider.tsx`:
   - Is `userAgent` and `viewport` data stored — any GDPR/privacy concerns?
   - Session IDs use `sessionStorage` + `crypto.randomUUID()` — confirm no PII leakage
   - Is there a cookie banner or privacy notice if tracking EU visitors?

## Anti-Patterns to Flag
- User input interpolated directly into HTML email templates without escaping (XSS via email)
- `...body` spread into MongoDB documents without field allowlisting (NoSQL injection, storage abuse)
- CRON_SECRET missing = open access to pipeline (should default to DENY, not ALLOW)
- No rate limiting on any public API endpoint
- `@clerk/nextjs` is in package.json — is it configured and used, or dead dependency?

## Output Format
Report findings as:
- **CRITICAL**: [issue] — [file:line] — [why it matters]
- **WARNING**: [issue] — [file:line] — [recommendation]
- **INFO**: [observation] — [file:line]

End with: Summary paragraph + Top 3 recommended actions.
