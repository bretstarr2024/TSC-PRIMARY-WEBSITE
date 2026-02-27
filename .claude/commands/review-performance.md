Review performance across frontend bundle size, MongoDB queries, rendering, pipeline efficiency, and live Lighthouse metrics.

## Context
Read these files first to understand the project conventions:
- `CLAUDE.md` — build command, content types, pipeline info
- `package.json` — dependency list (Three.js, Framer Motion, Recharts, etc.)
- `app/layout.tsx` — root layout with providers
- `lib/mongodb.ts` — connection singleton
- `lib/content-db.ts` — content database queries
- `lib/resources-db.ts` — resource database writes
- `lib/pipeline/content-guardrails.ts` — pipeline budget/caps

## What to Check

1. **Bundle size analysis** — Check for heavy dependencies that may be client-bundled:
   - `three` + `@react-three/fiber` + `@react-three/drei` — are they tree-shaken? Only loaded on pages that use 3D?
   - `recharts` — only used on tool pages? Verify lazy loading.
   - `framer-motion` — used everywhere, but check for unnecessarily large animation configs
   - `openai` SDK — must NEVER appear in client bundle
   - `mongodb` driver — must NEVER appear in client bundle
   - `zod` — used in pipeline schemas, should not be in client bundle
   - All 9 arcade games — MUST use `next/dynamic` with `ssr: false`. Check every game component import.

2. **Image optimization** — Check:
   - Are images using `next/image` with proper `width`/`height` or `fill`?
   - Is `unoptimized` used only where necessary (pixel art assets like `1_player.png`, `coin_slot.png`)?
   - Are there any raw `<img>` tags that should be `next/image`?
   - Check for missing `alt` attributes

3. **MongoDB query patterns** — Read `lib/content-db.ts` and `lib/resources-db.ts`:
   - Are there unbounded queries (missing `.limit()`)? Every list query should have a limit.
   - Are queries using indexed fields? Cross-reference with known indexes:
     - `pipeline_logs`: `timestamp_desc`, `contentId_timestamp`, `ttl_30d`
     - `interactions`: `timestamp_desc`, `ctaId_timestamp`, `sessionId_timestamp`, `ttl_180d`
     - `leads`: `timestamp_desc`
   - Are there N+1 query patterns? (fetching related content in a loop)
   - Is the MongoDB connection singleton properly reused? (no `new MongoClient()` in hot paths)

4. **Static generation** — Check `app/` pages:
   - Which pages use `generateStaticParams`? Are they properly pre-rendering all known slugs?
   - Are any pages accidentally dynamic when they could be static?
   - Check `app/insights/*/[slug]/page.tsx` patterns — do they all have `generateStaticParams`?

5. **Framer Motion performance** — Check for:
   - Layout animations on large component trees (causes layout thrashing)
   - Missing `layoutId` on components that animate between states
   - `whileInView` with missing `viewport={{ once: true }}` (re-triggers on every scroll)
   - Heavy spring animations on low-priority elements

6. **Three.js rendering** — Check components that use `@react-three/fiber`:
   - Is the canvas properly sized and not rendering when off-screen?
   - Are geometries and materials disposed on unmount?
   - Is `frameloop="demand"` used where constant rendering isn't needed?

7. **Pipeline cost efficiency** — Review `lib/pipeline/`:
   - `content-guardrails.ts`: Daily budget is $5/day — verify caps are enforced
   - `cost-estimator.ts`: Are token estimates accurate?
   - `openai-client.ts`: What model is being used? (GPT-4 vs GPT-3.5 cost difference is 30x)
   - Is the circuit breaker recovery timeout (60s) appropriate?

8. **Font loading** — Check `app/layout.tsx`:
   - Are fonts using `display: "swap"` for FOUT prevention?
   - Is Press Start 2P (arcade font) only loaded on pages that need it, or globally?
   - Could the arcade font be loaded with `next/dynamic` or font subsetting?

9. **Lighthouse audit (live site)** — Run `npx lighthouse` against the live Vercel URL (`https://tsc-primary-website.vercel.app`) to measure real-world performance. Test these pages:
   - Homepage (`/`) — heaviest page (Three.js sphere, Framer Motion, hero animations)
   - A content detail page (e.g., `/insights/blog/[any-slug]`) — typical reading page
   - `/contact` — form + Cal.com iframe + Three.js stars

   For each page, capture:
   - **Performance score** (0-100)
   - **Largest Contentful Paint (LCP)** — should be < 2.5s
   - **Total Blocking Time (TBT)** — should be < 200ms
   - **Cumulative Layout Shift (CLS)** — should be < 0.1
   - **Speed Index** — should be < 3.4s
   - **Total page weight** (transferred bytes)
   - **Number of requests**
   - Any specific opportunities Lighthouse flags (unused JS, render-blocking resources, image optimization, etc.)

   Run with: `npx lighthouse <URL> --output=json --chrome-flags="--headless --no-sandbox" --only-categories=performance`
   Parse the JSON output for the metrics above.

   Rate each metric:
   - **CRITICAL** if Performance score < 50 or LCP > 4s or TBT > 600ms
   - **WARNING** if Performance score 50-89 or LCP 2.5-4s or TBT 200-600ms or CLS > 0.1
   - **INFO** if all metrics are green (Performance >= 90, LCP < 2.5s, TBT < 200ms, CLS < 0.1)

## Anti-Patterns to Flag
- Game components imported with regular `import` instead of `next/dynamic`
- MongoDB queries without `.limit()` on list operations
- Three.js canvas rendering continuously when not visible
- `framer-motion` animations without `viewport={{ once: true }}` on scroll triggers
- Large static data arrays (services-data.ts, industries-data.ts) duplicated in client and server bundles
- Missing `loading.tsx` on dynamic route segments

## Output Format
Report findings as:
- **CRITICAL**: [issue] — [file:line] — [why it matters]
- **WARNING**: [issue] — [file:line] — [recommendation]
- **INFO**: [observation] — [file:line]

End with: Summary paragraph + Top 3 recommended actions.
