Review the architecture and structural decisions of this Next.js 14 codebase.

## Context
Read these files first to understand the project conventions:
- `CLAUDE.md` — project instructions, invariants, deploy rules
- `package.json` — dependencies and scripts
- `app/layout.tsx` — root layout, providers, global wrappers
- `lib/mongodb.ts` — database connection singleton
- `vercel.json` — cron job configuration
- `next.config.mjs` — Next.js configuration
- `tsconfig.json` — TypeScript configuration

## What to Check

1. **App Router structure** — verify all routes under `app/` follow Next.js 14 conventions (page.tsx, layout.tsx, route.ts, loading.tsx, error.tsx, not-found.tsx). Check for missing error boundaries or loading states on dynamic routes.

2. **Server vs Client boundary** — scan for `'use client'` directives. Verify that:
   - Server components don't import client-side hooks (useState, useEffect, useRef)
   - Client components don't export metadata or generateStaticParams
   - JSON-LD schema modules (`lib/schema/*.ts`) are server-only (no 'use client')
   - Game trigger components use the client wrapper pattern (`*GameTrigger.tsx`)

3. **Module dependency flow** — check that:
   - `lib/` modules don't import from `components/` or `app/`
   - `components/` don't import from `app/`
   - No circular dependencies between `lib/` modules
   - Pipeline modules (`lib/pipeline/`) don't leak into client bundles

4. **Data layer separation** — verify:
   - `lib/mongodb.ts` is the only MongoDB connection point
   - `lib/content-db.ts` and `lib/resources-db.ts` are the only DB write paths
   - No direct MongoDB operations in route handlers (except through these modules)
   - Static data files (`lib/services-data.ts`, `lib/industries-data.ts`) don't import MongoDB

5. **API route conventions** — check all routes under `app/api/`:
   - `app/api/lead/route.ts`
   - `app/api/track/route.ts`
   - `app/api/arcade-boss/route.ts`
   - `app/api/cron/generate-content/route.ts`
   - `app/api/cron/seed-content-queue/route.ts`
   - `app/api/cron/sync-jtbd-coverage/route.ts`
   - Verify all cron routes validate `CRON_SECRET` via Authorization header
   - Verify all public routes (lead, track, arcade-boss) have appropriate input validation

6. **Bundle boundaries** — check that heavy dependencies don't leak into client bundles:
   - `mongodb` driver should never appear in client components
   - `openai` SDK should only be imported in `lib/pipeline/openai-client.ts`
   - `resend` should only be imported in API route handlers
   - Three.js (`three`, `@react-three/fiber`, `@react-three/drei`) should only appear in components that need 3D
   - Game components should all use `next/dynamic` for lazy loading

7. **Kernel integration** — verify the GTM Kernel flow:
   - `scripts/sync-kernel.ts` reads YAML → writes `lib/kernel/generated/tsc.json`
   - `lib/kernel/client.ts` reads the generated JSON
   - No runtime YAML parsing in the app itself

8. **Build script chain** — verify `npm run build` = `sync-kernel` → `next build` → `index-content` and that each step can fail independently without corrupting state.

## Anti-Patterns to Flag
- SDK dependencies where pure fetch should be used (project invariant: all API clients use pure fetch, except OpenAI which is exempted)
- Direct `MongoClient` instantiation outside `lib/mongodb.ts`
- `'use client'` on files that export metadata or generateStaticParams
- Pipeline modules imported in client components (causes mongodb to bundle into client)
- Missing `maxDuration` on cron route handlers (Vercel serverless timeout)
- Hardcoded database name anywhere other than `lib/mongodb.ts` (must always be `tsc`)

## Output Format
Report findings as:
- **CRITICAL**: [issue] — [file:line] — [why it matters]
- **WARNING**: [issue] — [file:line] — [recommendation]
- **INFO**: [observation] — [file:line]

End with: Summary paragraph + Top 3 recommended actions.
