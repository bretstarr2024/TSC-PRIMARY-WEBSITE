# Session Handoff: The Starr Conspiracy Smart Website

**Last Updated:** February 11, 2026 (Session III)

---

## Current Phase: Phase 1 — Frontend Foundation COMPLETE + Content Generation Ready

The site now has a homepage, services section, and a complete Insights section with **10 content types** backed by MongoDB. Multi-tenant architecture is baked in from day one. The GTM Kernel drives brand identity, messaging, JTBD clusters, and leader data at build time. SEO/AEO infrastructure is live (robots.txt, sitemap.xml, llms.txt). A content generation script is ready to produce ~55 kernel-driven content pieces via OpenAI.

- **Active systems:** Vercel deployment (tsc-primary-website.vercel.app), GitHub (bretstarr2024/TSC-PRIMARY-WEBSITE), MongoDB Atlas (`tsc` database with 8 collections, 20+4 seed documents)
- **Next actions:** Run `npm run generate-content` to populate ~55 content pieces, then build pipeline crons
- **Roadmap:** See `docs/roadmap.md` Session III

### Session III Summary (February 11, 2026)

**Focus:** Added Videos + Tools content types, SEO/AEO infrastructure, kernel-driven content generation script

**What was done:**

1. **Video + Tool data layer** (4 modified files):
   - `lib/resources-db.ts` — Added Video interface (videoId, embed, transcript, answerCapsule, speaker) + Tool interface with sub-types (ChecklistItem, AssessmentQuestion, AssessmentResult, CalculatorConfig). Full CRUD + indexes for both.
   - `lib/content-db.ts` — Added `'tool'` to ContentType union
   - `lib/related-content.ts` — Added `'video'` + `'tool'` to RelatedItemType + TYPE_CONFIG
   - `lib/schema/breadcrumbs.ts` — Added `videoBreadcrumb()` + `toolBreadcrumb()`

2. **Video + Tool pages** (6 new files, 3 modified):
   - `app/insights/videos/page.tsx` — Video listing page
   - `app/insights/videos/[videoId]/page.tsx` — Video detail with embed, transcript, answer capsule
   - `app/insights/tools/page.tsx` — Tool listing page grouped by type
   - `app/insights/tools/[toolId]/page.tsx` — Tool detail with interactive ChecklistRenderer or AssessmentRenderer
   - `components/insights/ChecklistRenderer.tsx` — Interactive checklist (from AEO, dark theme)
   - `components/insights/AssessmentRenderer.tsx` — Interactive quiz (from AEO, dark theme)
   - Updated: InsightCard, RelatedContent, Insights hub for Video (#10B981) + Tool (#F472B6)

3. **SEO/AEO infrastructure** (3 new files):
   - `app/robots.ts` — AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
   - `app/sitemap.ts` — Dynamic sitemap querying all 10 content collections
   - `app/llms.txt/route.ts` — Structured markdown for LLM consumption (1hr cache)

4. **Content generation pipeline** (2 new files, 2 modified):
   - `lib/pipeline/content-prompts.ts` — TSC brand voice (Sage+Rebel), citability guidelines, per-type prompt functions for all 10 content types
   - `scripts/generate-content.ts` — Reads kernel JSON, generates ~55 content pieces via OpenAI (pure fetch). Maps: ICP pain points → FAQs, offerings → glossary, JTBD → blogs, leaders x JTBD → expert Q&A, etc.
   - `scripts/seed-content.ts` — Added 2 video + 2 tool sample documents (24 total)
   - `package.json` — Added `generate-content` script

**Commits this session:**
- `aceed8e` — feat: Video + Tool data layer — types, CRUD, indexes, related content
- `da91740` — feat: Video + Tool pages with interactive components
- `73d2c36` — feat: SEO/AEO infrastructure — robots.ts, sitemap.ts, llms.txt
- `764d7a5` — feat: Kernel-driven content generation + seed script update
- `2ae1e12` — docs: Update roadmap, CLAUDE.md for Session III (10 content types)

**Results:**
- 46 static pages generated (up from 41)
- 10 content types with pages (up from 8)
- SEO/AEO endpoints live: `/robots.txt`, `/sitemap.xml`, `/llms.txt`
- Content generation script ready (~55 pieces pending execution)
- Build passes cleanly

**Donor files referenced:**
- `components/insights/ChecklistRenderer.tsx`, `AssessmentRenderer.tsx` — copied from AEO, restyled dark theme
- `lib/pipeline/content-prompts.ts` — adapted for TSC brand voice and 10 content types
- `lib/resources-db.ts` — Tool/Video types adapted from AEO

**Key decisions:**
- Videos (#10B981) and Tools (#F472B6) are content types 9 and 10
- Content generation uses pure fetch to OpenAI (no SDK)
- Content generation is a CLI script, not a cron (bulk generation first, crons later)
- Tool types: checklist, assessment, calculator (calculator is stub)
- Video pages pulled forward from Phase 4 to Phase 1
- AI crawler allowlist includes GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Amazonbot, cohere-ai

**What NOT to re-debate:**
- 10 content types is the final count (video + tool are committed)
- Content type accent colors are locked (10 colors assigned)
- ChecklistItem uses `text`/`description`/`order` (not `label`/`tip`) — matches AEO donor
- AssessmentQuestion options use `{ text, value }` (not `{ label, score }`)
- AssessmentResult uses `minScore`/`maxScore` (not `range: { min, max }`)
- Tool requires `downloadable: boolean` field
- Content generation is CLI-first (not cron) — crons come in Phase 2

---

### Session II Summary (February 11, 2026)

**Focus:** Multi-tenant kernel sync, MongoDB infrastructure, complete Insights section (8 content types x listing + detail pages)

**What was done:**

1. **Multi-tenant kernel sync** (4 files):
   - `lib/kernel/types.ts` — TypeScript types for all kernel-driven data
   - `scripts/sync-kernel.ts` — Build-time: reads `/Volumes/Queen Amara/GTM Kernel/gtm_kernel/kernels/{clientId}/kernel.yaml` → extracts brand, offerings, ICP, JTBD, constraints, leaders → writes `lib/kernel/generated/{clientId}.json`
   - `lib/kernel/generated/tsc.json` — Generated TSC extraction (brand "The Starr Conspiracy", 3 JTBD clusters, 6 offering categories, 16 services, 3 leaders)
   - `lib/kernel/client.ts` — `getClientConfig()` returns typed config for current `CLIENT_ID`

2. **MongoDB infrastructure** (4 files):
   - `lib/mongodb.ts` — Connection singleton (shared `tsc` database)
   - `lib/content-db.ts` — Content queue + blog posts with `clientId` on every document/query
   - `lib/resources-db.ts` — 7 resource types (FAQ, glossary, comparison, expert-qa, news, case study, industry brief) with `clientId` everywhere
   - `lib/related-content.ts` — Cross-type related content engine (tag matching + JTBD cluster boost)

3. **Components and schema** (8 files):
   - `components/insights/` — ContentRenderer, InsightCard, FaqAccordion, CtaStrip, AuthorBio, RelatedContent
   - `lib/schema/people.ts` — Kernel-driven Person, Organization, Article schemas
   - `lib/schema/breadcrumbs.ts` — Breadcrumb generators for all `/insights/` routes

4. **17 Insights pages**:
   - Hub (`/insights`) — hero, JTBD clusters from kernel, content type grid
   - Blog, FAQ, Glossary, Comparisons, Expert Q&A, News, Case Studies, Industry Briefs — each with listing + detail page
   - All pages: ISR (1hr revalidation), dark theme, glass cards, type-specific accent colors, RelatedContent cross-linking

5. **MongoDB setup**:
   - 8 collections with clientId-prefixed indexes (unique constraints on `{clientId, typeId}`)
   - 20 seed documents: 3 blogs, 3 FAQs, 3 glossary, 2 comparisons, 3 expert Q&A, 2 news, 2 case studies, 2 industry briefs
   - `scripts/seed-content.ts` — reusable seed script

6. **Build pipeline update**: `npm run build` = `sync-kernel` → `next build` → `index-content` (41 pages generated)

**Key decisions:**
- Multi-tenant architecture from day one (clientId on every document/query/index)
- Build-time kernel sync (YAML → JSON) — no runtime Python dependency
- One Vercel project per client, same codebase, `CLIENT_ID` env var
- Shared `tsc` database with clientId field isolation (not per-client databases)
- 8 content type accent colors locked in (Blog=#FF5910, FAQ=#E1FF00, etc.)
- Content rendering pulled forward from Session VIII to Session II

**What NOT to re-debate:**
- Multi-tenant architecture is committed — clientId is on every document
- Build-time kernel sync is the approach — not runtime kernel access
- Shared database with clientId isolation — not per-client databases
- TypeScript `let` variables MUST have explicit types (narrowing issue)

---

### Session I Summary (February 11, 2026)

**Focus:** Homepage and services pages with full creative mandate — "beautiful and weird"

**What was done:**

1. Set up deployment infrastructure: GitHub repo, Vercel project, deploy hook, env vars
2. Dark theme foundation: `tailwind.config.ts` (Inter font, extended type scale, animation keyframes, brand colors), `app/globals.css` (dark CSS vars, scrollbar, `.glass`/`.section-wide` utilities), `app/layout.tsx` (Inter font, dark body, SmoothScroll, CustomCursor, NoiseOverlay)
3. Copied/adapted 7 animation components from AEO donor: AnimatedSection, AnimatedText, MagneticButton, SmoothScroll, CustomCursor, GradientBackground, PageTransition
4. Brand assets: logos to `public/images/`, full brand kit to `docs/brand-kit/`
5. Header: transparent → glass on scroll, ocho logo, uppercase nav, mobile fullscreen takeover menu
6. Footer: 4-column dark layout, "Built by an AI content engine" easter egg
7. Homepage (`/`): 6 sections — Hero (3000 cursor-reactive Three.js particles), Problem (Luddites/Tourists/Zealots manifesto), Approach (Fundamentals vs Innovation), Services (6 horizontal-scroll cards), Credibility (animated stats + quote), CTA (pulsing glow + MagneticButtons)
8. Services data layer: `lib/services-data.ts` — 6 categories, 21 services
9. Services hub (`/services`): cinematic hero, dual universe intro, 5 strategic category strips, AI cascade layout
10. 6 service sub-pages (`/services/[slug]`): category hero, service detail, related services, CTA
11. Fixed react-three compatibility: downgraded to v8/v9 for React 18

**Key decisions:**
- Dark-first theme, creative mandate: "badass expensive creative agency"
- 6 kernel service categories, AI-Native as expanded category
- react-three pinned to v8/v9 until React 19 migration

---

### Phase 0 Summary (February 10, 2026)

**Focus:** Full project scaffolding.

**What was done:** Initialized Next.js 14 project, installed dependencies, wrote product brief + CLAUDE.md, created session skills, initialized git.

**Key decisions:** Database name `tsc`, content hub path `/insights/`, 10 content types, multi-cluster seeding.

**Donor platform:** `/Volumes/Queen Amara/AnswerEngineOptimization.com/`
**GTM Kernel:** `/Volumes/Queen Amara/GTM Kernel/`

---
