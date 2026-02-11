# Build Roadmap: The Starr Conspiracy Smart Website

**Status: SESSION I** | Last Updated: February 11, 2026

## Scope
- Build an AI-native, self-generating content engine for The Starr Conspiracy
- Stack: Next.js 14 (App Router, TS, Tailwind), Framer Motion, Three.js, MongoDB (`tsc`), Vercel
- Grounded in the full GTM Kernel (20 components, 5 domains, 3 JTBD clusters)
- 9 content types, 10 cron jobs, video pipeline, RAG chatbot, analytics dashboard
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

#### Session II (upcoming): Database and Library Layer
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
