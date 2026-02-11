# Build Roadmap: The Starr Conspiracy Smart Website

**Status: SCAFFOLDING** | Last Updated: February 10, 2026 (Phase 0)

## Scope
- Build an AI-native, self-generating content engine for The Starr Conspiracy
- Stack: Next.js 14 (App Router, TS, Tailwind), Framer Motion, Three.js, MongoDB (`tsc`), Vercel
- Grounded in the full GTM Kernel (20 components, 5 domains, 3 JTBD clusters)
- 9 content types, 10 cron jobs, video pipeline, RAG chatbot, analytics dashboard
- Donor platform: AEO site at `/Volumes/Queen Amara/AnswerEngineOptimization.com/`

## Phases

### Phase 0: Scaffolding ✅ COMPLETE (Feb 10, 2026)
- [x] Initialize Next.js 14 project with all dependencies
- [x] Write comprehensive product brief (`docs/product-brief.md`)
- [x] Write CLAUDE.md with project instructions
- [x] Create session skills (begin-session, end-session, stuck)
- [x] Create docs structure (roadmap, handoff, sessions directory)
- [x] Create placeholder `scripts/index-content.ts` for build script
- [x] Initialize git repository

**Not yet done:**
- [ ] Create GitHub repository and push
- [ ] Create Vercel project and configure deploy hook
- [ ] Set up environment variables on Vercel

---

### Phase 1: Core Platform (Sessions I–IV)

**Goal:** MongoDB connected, basic layout rendering, content pipeline plumbing.

#### Session I: Database and Library Layer
- [ ] Copy and adapt from AEO:
  - `lib/mongodb.ts` — connection helper (change default DB to `tsc`)
  - `lib/content-db.ts` — add `case_study`, `industry_brief` to ContentType
  - `lib/resources-db.ts` — add methods for new content types
  - `lib/jtbd-seeds.ts` — copy as-is (already multi-tenant)
  - `lib/gtm-kernel-db.ts` — copy as-is
  - `lib/content-relevance.ts` — widen for full TSC scope
  - `lib/utils.ts` — copy as-is
- [ ] Set up `.env.local` with MongoDB connection string, OpenAI key
- [ ] Verify database connectivity

**Donor files:**
- `/Volumes/Queen Amara/AnswerEngineOptimization.com/lib/content-db.ts`
- `/Volumes/Queen Amara/AnswerEngineOptimization.com/lib/resources-db.ts`
- `/Volumes/Queen Amara/AnswerEngineOptimization.com/lib/jtbd-seeds.ts`
- `/Volumes/Queen Amara/AnswerEngineOptimization.com/lib/gtm-kernel-db.ts`
- `/Volumes/Queen Amara/AnswerEngineOptimization.com/lib/content-relevance.ts`

#### Session II: Pipeline Core
- [ ] Copy pipeline infrastructure:
  - All `lib/pipeline/*.ts` files (circuit-breaker, error-classifier, logger, stuck-detector, etc.)
- [ ] Adapt `content-prompts.ts`:
  - New `BRAND_VOICE_CONTEXT` from kernel Identity domain (Components 14–16)
  - New `CITABILITY_GUIDELINES` (broader than AEO_GUIDELINES)
  - Per-type prompts for all 9 content types
- [ ] Adapt `content-guardrails.ts` for new collections
- [ ] Create `scripts/sync-gtm-kernel.ts`
- [ ] Create `scripts/seed-source-monitors.ts` — new source monitors for B2B/AI marketing news

**Donor files:**
- `/Volumes/Queen Amara/AnswerEngineOptimization.com/lib/pipeline/*.ts` (12 files)
- `/Volumes/Queen Amara/AnswerEngineOptimization.com/lib/pipeline/content-prompts.ts` (major rewrite)

#### Session III: Basic Layout and Routing
- [ ] Copy UI components from AEO:
  - Framer Motion: AnimatedSection, AnimatedText, MagneticButton, PageTransition, SmoothScroll
  - Three.js: Hero3D (adapt), Murmuration (adapt)
  - UI: CustomCursor, GradientBackground, NoiseOverlay, Skeleton
  - Data: RelatedContent, FaqAccordion, CtaStrip
- [ ] Create `app/layout.tsx` — new metadata
- [ ] Create `components/Header.tsx` — nav: Services, Industries, Insights, Work, About, Contact
- [ ] Create `components/Footer.tsx` — new links
- [ ] Create placeholder pages for all routes
- [ ] Set up `app/robots.ts` and `app/sitemap.ts`
- [ ] Set up `app/llms.txt/route.ts`

#### Session IV: Structured Data and AEO Effectiveness
- [ ] Create `lib/schema/people.ts` — TSC leadership structured data
- [ ] Add BreadcrumbList, Organization, Person schemas
- [ ] Add answer capsules to service pillar pages
- [ ] Set up AI crawler allowlist in robots.ts
- [ ] First deploy to Vercel, verify build

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

#### Session VIII: Content Rendering
- [ ] Create content detail pages:
  - `app/insights/blog/[slug]/page.tsx`
  - `app/insights/faq/[slug]/page.tsx`
  - `app/insights/glossary/[slug]/page.tsx`
  - `app/insights/comparisons/[slug]/page.tsx`
  - `app/insights/expert-qa/[slug]/page.tsx`
  - `app/insights/news/[slug]/page.tsx`
- [ ] Create content listing pages (paginated)
- [ ] Wire RelatedContent to all detail pages
- [ ] Add structured data to content pages
- **MILESTONE: Site goes live with autonomous content generation**

---

### Phase 3: Full Frontend (Sessions IX–XIII)

**Goal:** All pillar pages built, chatbot operational, design polish.

#### Session IX: Home Page
- [ ] Hero section (Three.js adapted from AEO)
- [ ] Value proposition from kernel's Essential Value
- [ ] Service overview cards
- [ ] Social proof section
- [ ] CTA strip

#### Session X: Service Pages
- [ ] 6 service sub-pages with content from kernel's Offerings
- [ ] Each page: hero, description, outcomes, related content, CTA
- [ ] Answer capsules for each service

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

#### Session XV: Email Distribution
- [ ] Weekly digest email
- [ ] Subscriber management
- [ ] Email templates

#### Session XVI: YouTube Integration
- [ ] YouTube upload pipeline
- [ ] Video sitemap
- [ ] Video pages and embed views

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
