# Build Roadmap: The Starr Conspiracy Smart Website

**Status: SESSION IV** | Last Updated: February 11, 2026

## Scope
- Build an AI-native, self-generating content engine for The Starr Conspiracy
- Stack: Next.js 14 (App Router, TS, Tailwind), Framer Motion, Three.js, MongoDB (`tsc`), Vercel
- Grounded in the full GTM Kernel (20 components, 5 domains, 3 JTBD clusters)
- 10 content types, 10 cron jobs, video pipeline, RAG chatbot, analytics dashboard
- Donor platform: AEO site at `/Volumes/Queen Amara/AnswerEngineOptimization.com/`

---

## CREATIVE MANDATE (Non-Negotiable)

**This is not a conventional agency website. This is a statement piece.**

The site must scream "We're a badass, expensive, creative agency" at every scroll position. The Sage + Rebel archetype means deep expertise delivered with irreverence — the website is the proof of that claim.

### Design Direction

- **Dark-first theme.** Heart of Darkness (#141213) background with neon brand accents (Atomic Tangerine, Neon Cactus, Sprinkles, Tidal Wave). Content/reading pages may use light theme for readability.
- **Unconventional layouts.** Break the grid. Asymmetric compositions. Oversized typography. Horizontal scroll sections where appropriate. Nothing should look like a template.
- **Motion as identity.** Framer Motion + Three.js are not decoration — they ARE the brand experience. Cursor-reactive particle fields, scroll-triggered reveals, physics-based springs, magnetic buttons, custom cursor. 60fps non-negotiable.
- **Texture and depth.** Noise/grain overlays, SVG filters, radial gradients, layered parallax. Premium feel in every pixel.
- **Copy that bites.** The messaging framework ("Luddites, Tourists, and Zealots") is confrontational by design. The typography and layout should match that energy — bold claims deserve bold presentation.

### Color System (Dark Theme)

| Role | Color | Hex |
|------|-------|-----|
| Background | Heart of Darkness | #141213 |
| Primary accent | Atomic Tangerine | #FF5910 |
| Electric highlight | Neon Cactus | #E1FF00 |
| Cool accent | Tidal Wave | #73F5FF |
| Hot accent | Sprinkles | #ED0AD2 |
| Primary text | White | #FFFFFF |
| Secondary text | Shroomy | #d1d1c6 |
| Muted text | Greige | #6D6D69 |

### Service Presentation

Present all 6 kernel service categories (Strategic, Demand, Digital, Content, Advisory, AI) with full detail pages. The kernel's Offerings (Component 3) is the source of truth for service scope.

### Brand Assets

- Logos: `docs/brand-kit/logos/` (ocho mascot + TSC wordmarks)
- Font: Inter (Google Fonts) — the only font
- Full brand kit: `docs/brand-kit/`
- Placeholder content sourced from kernel messaging framework until real assets provided

## Phases

### Phase 0: Scaffolding ✅ COMPLETE (Feb 10, 2026)
- [x] Initialize Next.js 14 project with all dependencies
- [x] Write comprehensive product brief (`docs/product-brief.md`)
- [x] Write CLAUDE.md with project instructions
- [x] Create session skills (begin-session, end-session, stuck)
- [x] Create docs structure (roadmap, handoff, sessions directory)
- [x] Create placeholder `scripts/index-content.ts` for build script
- [x] Initialize git repository

- [x] Create GitHub repository (`bretstarr2024/TSC-PRIMARY-WEBSITE`) and push
- [x] Create Vercel project (`tsc-primary-website`) and configure deploy hook
- [x] Set up environment variables on Vercel (MONGODB_URI, OPENAI_API_KEY)
- [x] Add `.npmrc` with `legacy-peer-deps=true` for React 18 compat
- [x] Set up local `.env.local`
- [x] Add brand kit to `docs/brand-kit/`

---

### Phase 1: Frontend Foundation (Sessions I–IV)

**Goal:** Homepage, service pages, and core layout rendering with full creative mandate execution.

#### Session I: Homepage + Services ✅ COMPLETE (Feb 11, 2026)

**Pivot:** User directive changed Session I scope from database layer to homepage + services. Creative mandate established: "beautiful and weird, badass expensive creative agency."

**Homepage (done):**
- [x] Tailwind config: Inter font, extended type scale, animation keyframes, brand colors
- [x] Globals: dark theme CSS vars, scrollbar styling, `.glass` / `.text-gradient` / `.section-wide` utilities
- [x] 7 animation components copied/adapted from AEO donor (AnimatedSection, AnimatedText, MagneticButton, SmoothScroll, CustomCursor, GradientBackground, PageTransition)
- [x] Logo assets copied to `public/images/`
- [x] Root layout: Inter font, dark body, SmoothScroll, CustomCursor, NoiseOverlay
- [x] Header: transparent → glass on scroll, mobile fullscreen takeover menu
- [x] Hero: 3000 cursor-reactive Three.js particles, word-by-word animated type, gradient text
- [x] Problem section: Luddites / Tourists / Zealots confrontational manifesto
- [x] Approach section: Fundamentals + AI split with animated center divider
- [x] Services section: 6 horizontal-scroll cards with category colors
- [x] Credibility section: animated counting stats + Bret Starr quote
- [x] CTA section: pulsing tangerine glow + MagneticButtons
- [x] Footer: 4-column dark footer with AI content engine easter egg

**Services (/services + 6 sub-pages, done):**
- [x] Service data layer: 6 categories, 21 services, full detail (`lib/services-data.ts`)
- [x] Services hub: cinematic hero with fork SVG animation, dual universe intro, 5 strategic category strips with expandable cards, AI cascade waterfall layout, bridge statement, CTA
- [x] 6 dynamic sub-pages (`/services/[slug]`) with full service detail, outcomes, related services
- [x] Downgraded @react-three/fiber to v8 + @react-three/drei to v9 for React 18 compat

**Donor files referenced:**
- `AnimatedSection.tsx`, `AnimatedText.tsx`, `MagneticButton.tsx`, `SmoothScroll.tsx`, `CustomCursor.tsx`, `GradientBackground.tsx`, `PageTransition.tsx` — all from AEO `components/`
- `Hero3D.tsx` → adapted to `HeroParticles.tsx`

#### Session II: Multi-Tenant Kernel Sync + Insights Section + MongoDB ✅ COMPLETE (Feb 11, 2026)

**Pivot:** User directive added multi-tenant architecture from day one, aligned with GTM Kernel and USG (AI GTM Engine). Also pulled content rendering (originally Session VIII) forward to deliver a complete Insights section with all 8 content types.

**Layer 0 — Multi-Tenant Kernel Sync (done):**
- [x] `lib/kernel/types.ts` — TypeScript types for kernel data (brand, offerings, ICP, JTBD, constraints, leaders)
- [x] `scripts/sync-kernel.ts` — Build-time: reads kernel YAML → generates JSON config
- [x] `lib/kernel/generated/tsc.json` — Generated TSC kernel extraction (brand, 3 JTBD, 6 offering categories, 16 services, 3 leaders)
- [x] `lib/kernel/client.ts` — Runtime config accessor (`getClientConfig()`) with fallback for builds without kernel

**Layer 1 — Database Infrastructure (done):**
- [x] `lib/mongodb.ts` — MongoDB connection singleton (shared `tsc` database, clientId-scoped queries)
- [x] `lib/content-db.ts` — Content queue + blog posts with `clientId` on every document and query
- [x] `lib/resources-db.ts` — 7 resource types (FAQ, glossary, comparison, expert-qa, news, case study, industry brief) with `clientId` everywhere
- [x] `lib/related-content.ts` — Cross-type related content engine (tag matching + JTBD cluster boost)

**Layer 2 — Schema + Components (done):**
- [x] `lib/schema/people.ts` — Kernel-driven leadership structured data
- [x] `lib/schema/breadcrumbs.ts` — Breadcrumb generators for all `/insights/` routes
- [x] 6 shared components: ContentRenderer, InsightCard, FaqAccordion, CtaStrip, AuthorBio, RelatedContent

**Layer 3 — 17 Insights Pages (done):**
- [x] `/insights` — Hub with hero, JTBD clusters (from kernel), content type grid
- [x] `/insights/blog` + `/insights/blog/[slug]` — Listing + detail with author bios
- [x] `/insights/faq` + `/insights/faq/[faqId]` — Accordion listing + detail with FAQ schema
- [x] `/insights/glossary` + `/insights/glossary/[termId]` — A-Z listing + detail
- [x] `/insights/comparisons` + `/insights/comparisons/[comparisonId]` — Listing + detail with comparison tables
- [x] `/insights/expert-qa` + `/insights/expert-qa/[qaId]` — Listing + detail with expert bios
- [x] `/insights/news` + `/insights/news/[newsId]` — Listing + detail with source attribution
- [x] `/insights/case-studies` + `/insights/case-studies/[caseStudyId]` — Listing + detail with metrics
- [x] `/insights/industry-briefs` + `/insights/industry-briefs/[briefId]` — Listing + detail

**Layer 4 — MongoDB Setup (done):**
- [x] 8 collections created with clientId-prefixed indexes
- [x] 20 seed documents (3 blogs, 3 FAQs, 3 glossary, 2 comparisons, 3 expert Q&A, 2 news, 2 case studies, 2 industry briefs)
- [x] `scripts/seed-content.ts` — Reusable seed script using project's own DB layer

**Build pipeline update:**
- [x] `npm run build` = `sync-kernel` → `next build` → `index-content`
- [x] 41 static pages generated (up from 12)

**Donor files referenced:**
- `lib/rag/mongodb.ts` → adapted to `lib/mongodb.ts`
- `lib/content-db.ts` → adapted (added `clientId`, removed AEO-specific fields)
- `lib/resources-db.ts` → adapted (added `clientId`, added case_study + industry_brief types)
- `components/insights/*` patterns from AEO `components/` (adapted to dark theme)

#### Session III: Videos + Tools + Content Generation + SEO/AEO ✅ COMPLETE (Feb 11, 2026)

**Pivot:** User directive added Videos and Tools as content types 9 and 10, plus kernel-driven content generation and SEO/AEO infrastructure — ahead of pipeline cron plumbing.

**Layer 0 — Data Layer (done):**
- [x] `lib/resources-db.ts` — Added Video interface + CRUD (create, getById, getPublished, getAllIds) and Tool interface + sub-types (ChecklistItem, AssessmentQuestion, AssessmentResult, CalculatorConfig) + CRUD
- [x] Updated `getResourceCounts()` and `ensureResourcesIndexes()` for both new types
- [x] `lib/content-db.ts` — Added `'tool'` to ContentType union
- [x] `lib/related-content.ts` — Added `'video'` + `'tool'` to RelatedItemType union + TYPE_CONFIG

**Layer 1 — Pages + Components (done):**
- [x] Updated InsightCard, RelatedContent, breadcrumbs, Insights hub for Video (#10B981) + Tool (#F472B6)
- [x] `app/insights/videos/page.tsx` + `app/insights/videos/[videoId]/page.tsx` — Video listing + detail (embed, transcript, answer capsule)
- [x] `app/insights/tools/page.tsx` + `app/insights/tools/[toolId]/page.tsx` — Tool listing + detail (interactive renderers)
- [x] `components/insights/ChecklistRenderer.tsx` — Interactive checklist with progress bar (copied from AEO, dark theme)
- [x] `components/insights/AssessmentRenderer.tsx` — Interactive quiz with scoring + results (copied from AEO, dark theme)

**Layer 2 — SEO/AEO Infrastructure (done):**
- [x] `app/robots.ts` — AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
- [x] `app/sitemap.ts` — Dynamic sitemap querying all 10 content collections
- [x] `app/llms.txt/route.ts` — Structured markdown for LLM consumption (1hr cache)

**Layer 3 — Content Generation (done):**
- [x] `lib/pipeline/content-prompts.ts` — TSC brand voice context + citability guidelines + per-type prompt functions (all 10 types)
- [x] `scripts/generate-content.ts` — Kernel-driven content generation via OpenAI (pure fetch, ~55 pieces)
- [x] `scripts/seed-content.ts` — Updated with 2 video + 2 tool sample documents (24 total seed docs)
- [x] `package.json` — Added `generate-content` script

**Build:** 46 static pages (up from 41). New routes: `/insights/videos`, `/insights/tools`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`

**Donor files referenced:**
- `components/insights/ChecklistRenderer.tsx`, `AssessmentRenderer.tsx` — copied from AEO, restyled dark theme
- `lib/pipeline/content-prompts.ts` — adapted for TSC brand voice and 10 content types
- `lib/resources-db.ts` — Tool/Video types adapted from AEO

#### Session IV: Content Population + Copy Feedback + CTA Integration ✅ COMPLETE (Feb 11, 2026)

**Pivot:** User directive prioritized running content generation, applying colleague homepage copy feedback, wiring all CTAs to Cal.com booking, and creating a custom 404 page — ahead of pipeline cron plumbing.

**Layer 0 — Content Generation (done):**
- [x] Ran `npm run generate-content` — populated 56 kernel-driven content pieces in MongoDB via OpenAI
- [x] Removed all fractional CMO content from generation script (user directive)
  - Replaced comparison topic with "Brand Strategy vs. Demand Generation"
  - Replaced news topic with "B2B agency relationships" piece
  - Filtered "Fractional CMO" service from glossary generation
- [x] Forbidden term guardrail caught 1 "synergy" violation (rejected automatically)

**Layer 1 — Homepage Copy Feedback (done):**
- [x] Hero tagline: "fundamentals meet AI transformation" → "fundamentals meet the future" + expanded copy
- [x] Problem section: updated Luddites/Tourists/Zealots summary copy
- [x] Approach section: "We reject the false choice" → "We offer the best of both worlds"

**Layer 2 — CTA + Navigation Overhaul (done):**
- [x] All CTA buttons → "Let's Talk!" linking to `cal.com/team/tsc/25-50` (external, target="_blank")
- [x] Updated: HeroSection, CtaSection, ServiceCTA, Header (desktop + mobile), Footer, CtaStrip
- [x] Removed 404 nav links (Work, About, Contact) from Header and Footer
- [x] Collapsed dual-button CTAs to single "Let's Talk!" button

**Layer 3 — Custom 404 Page (done):**
- [x] Created `app/not-found.tsx` — "Hi, Melissa!" with Charlie's Angels 70s treatment
- [x] Melissa photo with mix-blend-mode screen, 70s contrast/saturation filter
- [x] 4 concentric glow rings in brand colors (rotating, pulsing)
- [x] Sparkle accents, radial background glow, gradient text
- [x] Full Framer Motion entrance animations

**Build:** 102 static pages (up from 46 — generated content is live)

#### Session V (upcoming): Pipeline Infrastructure + Structured Data
- [ ] Copy pipeline infrastructure from AEO:
  - `lib/pipeline/*.ts` (circuit-breaker, error-classifier, logger, stuck-detector, etc.)
- [ ] Adapt `content-guardrails.ts` for new collections
- [ ] Create source monitors for B2B/AI marketing news
- [ ] Add BreadcrumbList, Organization, Person schemas to all pages
- [ ] Add answer capsules to service pillar pages

---

### Phase 2: Content Pipeline Live (Sessions V–VIII)

**Goal:** The autonomous content pipeline runs. Content generates daily.

#### Session V: Source Monitoring
- [ ] Create `app/api/cron/check-sources/route.ts`
- [ ] Seed initial source monitors:
  - B2B marketing: MarTech, Marketing AI Institute, HubSpot, Gartner, Forrester
  - AI marketing: OpenAI blog, Google AI blog, TechCrunch AI
  - Industry-specific sources per ICP vertical
- [ ] Verify source monitoring works

#### Session VI: Content Seeding
- [ ] Create `app/api/cron/seed-resource-queue/route.ts` — multi-cluster seeding
  - Round-robin across 3 JTBD clusters
  - Weighted by commercial intent score
  - Demand-state-aware type selection
- [ ] Create `app/api/cron/sync-jtbd-coverage/route.ts`
- [ ] Run initial seed to populate content_queue

#### Session VII: Content Generation
- [ ] Create `app/api/cron/generate-content/route.ts` — all 9 content types
- [ ] Verify end-to-end: seed → queue → generate → publish
- [ ] Create `app/api/cron/send-digest/route.ts`
- [ ] Set up `vercel.json` with all cron schedules

#### Session VIII: Content Rendering ✅ PULLED FORWARD to Session II
(See Phase 1 Session II above — all 17 Insights pages built with RelatedContent, schema.org, and 8 content types)

- **MILESTONE: Content rendering complete. Pipeline generation is next.**

---

### Phase 3: Full Frontend (Sessions IX–XIII)

**Goal:** All pillar pages built, chatbot operational, design polish.

#### Session IX: Home Page ✅ PULLED FORWARD to Session I
(See Phase 1 Session I above)

#### Session X: Service Pages ✅ PULLED FORWARD to Session I
(See Phase 1 Session I above)

#### Session XI: Industry Pages
- [ ] 8 industry pages from kernel's ICP industries
- [ ] Each: industry-specific pain points, how TSC helps, related content

#### Session XII: About, Contact, Work
- [ ] About: Team profiles, company story, 25+ years
- [ ] Contact: Form (Resend integration), booking link
- [ ] Work: Case study showcase

#### Session XIII: Chatbot (chaDbot)
- [ ] Copy RAG infrastructure from AEO
- [ ] Copy chat components
- [ ] Adapt system prompt for full TSC scope
- [ ] Wire to OpenAI GPT-5.2

---

### Phase 4: Video & Distribution (Sessions XIV–XVI)

**Goal:** Video pipeline running, content distributed.

#### Session XIV: Video Pipeline
- [ ] Copy video infrastructure (HeyGen, Cloudinary, ElevenLabs, YouTube upload)
- [ ] Adapt video scripts for broader content
- [ ] Create video crons
- Note: Video listing + detail pages already built in Session III

#### Session XV: Email Distribution
- [ ] Weekly digest email
- [ ] Subscriber management
- [ ] Email templates

#### Session XVI: YouTube Integration
- [ ] YouTube upload pipeline
- [ ] Video sitemap
- Note: Video embed views already built in Session III (`/insights/videos/[videoId]`)

---

### Phase 5: Dashboard & Observability (Sessions XVII–XIX)

**Goal:** Analytics dashboard live, full observability.

#### Session XVII: Dashboard
- [ ] Copy dashboard components from AEO
- [ ] Adapt analytics integrations (new GA4, new Wincher, etc.)
- [ ] Pipeline diagnostics API

#### Session XVIII: Sentry Observability
- [ ] Sentry setup (errors, performance, session replay)
- [ ] Tunnel route `/monitoring`
- [ ] Error monitoring dashboard

#### Session XIX: Analytics Integrations
- [ ] GA4, Wincher, DataForSEO, SEMrush, SerpAPI, Ahrefs, GSC
- [ ] Reporting aggregator
- [ ] Data source status indicators

---

### Phase 6: Polish & Optimization (Sessions XX+)

**Goal:** Performance, SEO audit, cross-linking, content quality.

- [ ] Lighthouse performance audit and fixes
- [ ] Cross-site linking (TSC ↔ AEO)
- [ ] Content quality tuning
- [ ] Source monitor expansion
- [ ] SEO technical audit
- [ ] A/B testing framework
