# Build Roadmap: The Starr Conspiracy Smart Website

**Status: SESSION XLVI** | Last Updated: February 25, 2026

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

#### Session V: /book Page + Internal CTA Routing ✅ COMPLETE (Feb 11, 2026)

**Pivot:** User loved the 404 motion graphics and requested the same treatment for the Cal.com booking experience. Built a dedicated `/book` page and rewired all CTAs to keep users on-site.

**Layer 0 — /book Page (done):**
- [x] Created `app/book/page.tsx` — Cal.com calendar embedded via iframe with `?embed=true&theme=dark`
- [x] Three.js HeroParticles (same cursor-reactive stars as homepage)
- [x] 4 concentric brand-color glow rings (rotating, pulsing) behind calendar
- [x] Melissa floating photo with 10-sparkle constellation, dual glow rings, enhanced box-shadow
- [x] Cal.com postMessage resize listener for dynamic iframe height
- [x] Glass card container, 1000px iframe height, max-w-4xl layout

**Layer 1 — CTA Routing Overhaul (done):**
- [x] All CTAs rewired from external `cal.com/team/tsc/25-50` to internal `/book`
- [x] Changed `<a>` tags to `<Link>` components (HeroSection, Header desktop + mobile, Footer)
- [x] Removed `isExternal` from MagneticButton usages (CtaSection, ServiceCTA)
- [x] Updated CtaStrip default `buttonHref` to `/book`
- [x] Added `Link` import to HeroSection

**Build:** 103 static pages (new `/book` route)

#### Out-of-Band: Phase 1 Website Edits (Racheal, Feb 19, 2026)

**Commit `8d8894e`** — Major site-wide edit pass done outside of session workflow:
- [x] Services restructured: Advisory/fractional CMO removed, GTM Strategy & Architecture added, AI services updated (7 new), Visual Brand Development added, Digital Performance → Paid/Earned/Owned Media
- [x] Homepage rework: "Who We Are" section added, archetypes renamed (Holdouts/Bandwagoners/Overcorrectors), Approach section updated with convergence + GTM Kernel callout, carousel fixed with horizontal scroll + arrows
- [x] Content: FAQ rebuilt as flip cards, 2 fabricated case studies replaced with 10 real ones, GTM Strategy Gap Assessment tool added
- [x] Book page: solo Melissa → 6-person team carousel with all headshots
- [x] JTBD cleanup: "Fill Leadership Gap" removed, JTBD acronym eliminated from user-facing text
- [x] Videos page hidden from navigation (route preserved)
- [x] Kernel data updated in `tsc.json`

#### Session VI: Stub Pages + Nav (Feb 23, 2026) ✅ COMPLETE

**Focus:** Add all missing website sections as stub pages, wire into navigation.

- [x] Pull Racheal's out-of-band Phase 1 edits (`8d8894e`)
- [x] Create `/about` stub page with metadata
- [x] Create `/contact` stub page with metadata
- [x] Create `/work` stub page with metadata
- [x] Create `/industries` stub page with metadata
- [x] Create `/careers` stub page with metadata
- [x] Update Header nav: Services, Work, Industries, Insights, About + Let's Talk!
- [x] Update Footer Company column: About, Work, Industries, Insights, Careers, Contact

**Build:** 108 static pages (up from 103 — 5 new routes)

#### Session VII: About Page + Headline Animations + AEO Structured Data ✅ COMPLETE (Feb 24, 2026)

**Focus:** Build complete About page with full content, AEO optimization, and fix animation consistency across stub pages.

**Layer 0 — Headline Animation Fix (done):**
- [x] Added `AnimatedSection` + `GradientText` wrappers to `/about`, `/work`, `/industries` pages
- [x] All section headlines now animate consistently with Services and Insights pages

**Layer 1 — About Page Content (done):**
- [x] `components/about/AboutHero.tsx` — Word-by-word 3D animated headline, AEO answer capsule
- [x] `components/about/OriginStory.tsx` — Founding story (1999), stats grid, book callout
- [x] `components/about/ApproachSection.tsx` — Three kernel values as animated cards
- [x] `components/about/LeadershipSection.tsx` — 10 leaders, expand-on-click bios, LinkedIn links
- [x] `components/about/ClientMarquee.tsx` — 52 client names, dual-row infinite scroll
- [x] `components/about/AboutFaq.tsx` — 6 FAQ items with animated accordion
- [x] Reused `ServiceCTA` for CTA section

**Layer 2 — AEO Structured Data (done):**
- [x] Organization JSON-LD schema on About page
- [x] FAQPage JSON-LD schema (6 questions) — `lib/schema/about-faq.ts`
- [x] BreadcrumbList JSON-LD schema — added `aboutBreadcrumb()` to `lib/schema/breadcrumbs.ts`
- [x] AEO answer capsule in hero (20-word summary for AI extraction)
- [x] Keywords in metadata (8 targeted terms)

**Key content gathered from user:**
- 10 leadership bios (Bret Starr, Dan McCarron, Racheal Bates, JJ La Pata, Nancy Crabb, Noah Johnson, Joanna Castle, Evan Addison Payne, Melissa Casey, Skylin Solaris)
- 52 highlighted clients from 500+ client CRM list
- Founding story: 1999, Bret's brand-side frustration principle
- Stats: 3,000+ B2B tech clients, 1,000+ shots of tequila, Founded 1999
- Bret's book: A Humble Guide to Fixing Everything in Brand, Marketing, and Sales
- All leadership LinkedIn URLs

**Build:** 108 static pages (same count — About page replaced stub)

#### Session VIII: Asteroids Easter Egg ✅ COMPLETE (Feb 24, 2026)

**Focus:** Add hidden Asteroids video game easter egg to homepage hero.

- [x] `components/home/AsteroidsGame.tsx` — Full canvas-based Asteroids clone: classic triangle ship, jagged polygon asteroids (split large→medium→small), bullet physics, particle explosions, screen wrapping, level progression, score/lives/HUD
- [x] Brand-colored game: ship/bullets in Atomic Tangerine, asteroids in Tidal Wave, score in Neon Cactus, explosions in all brand colors
- [x] `components/home/HeroSection.tsx` — Replaced "THE STARR CONSPIRACY" pre-headline with clickable Asteroids ship SVG that floats above headline, glows on hover, launches game on click
- [x] Game lazy-loaded via `next/dynamic` — zero bundle cost until activated
- [x] Controls: Arrow keys/WASD + Space to fire, ESC to exit, Enter to restart
- [x] Screen shake, thrust flame flicker, invulnerability blink, particle effects

**Build:** 108 static pages (unchanged count)

#### Session IX: Asteroids Game Enhancements ✅ COMPLETE (Feb 24, 2026)

**Focus:** Five gameplay improvements to the hidden Asteroids easter egg per user feedback.

- [x] **Bullets cross the screen** — Bullet life now computed dynamically from screen diagonal (`Math.hypot(w,h) * 0.8 / BULLET_V`), scales with any display resolution. Was 400px (BULLET_LIFE=50), now ~1760px on 1080p, ~3520px on 4K.
- [x] **Ocho UFO enemy** — The ocho pixel-art mascot (`/images/ocho-color.png`) spawns every 10-20 seconds, flies across the screen with sinusoidal bobbing, fires pink (Sprinkles) bullets at the player. Accuracy increases with level. Worth 300 points. Rendered with pink glow effect via canvas shadow. Fallback ellipse if image hasn't loaded.
- [x] **High score table with 3-initial entry** — Classic arcade-style. Top 10 scores persisted in localStorage (`tsc-asteroids-scores`). On game over, qualifying scores get the initial entry screen (up/down cycle letters, left/right move cursor, or type directly). Player's entry highlighted in Neon Cactus on the leaderboard.
- [x] **Game over shake fix** — Shake decay (`g.shake *= 0.9`) was inside the `if (!g.over)` block, so it froze at 15 and shook violently forever on game over. Moved decay outside, with faster rate (0.8) when game is over. Settles in ~0.25 seconds.
- [x] **Game over input delay** — 40-frame delay (~0.67s) before accepting input on game over screen, prevents accidental Enter-mashing through the initial entry.

**Build:** 108 static pages (unchanged count)

#### Session X: Asteroids — Sound Effects + Mobile Touch Controls + Bullet Fix ✅ COMPLETE (Feb 24, 2026)

**Focus:** Three enhancements to the hidden Asteroids easter egg: Web Audio API sound effects, mobile touch controls, and bullet physics fix.

- [x] **Sound engine (Web Audio API)** — `SFX` class in `components/home/AsteroidsGame.tsx`. Retro synth sounds generated programmatically (no audio files). Discrete sounds: shoot (square wave 880→220Hz), rock explosion (filtered white noise, size-dependent), ship explosion (deep LP noise), UFO shoot (sawtooth 600→200Hz), UFO explosion, level up (ascending arpeggio), game over (descending arpeggio). Continuous sounds: thrust (looping LP white noise), UFO hum (dual detuned square oscillators 120/126Hz). Mute toggle via M key or touch button.
- [x] **Mobile touch controls** — Virtual buttons rendered on canvas. Gameplay: 4 buttons (◀ rotate left, ▶ rotate right, ▲ thrust, ● fire). Game over initials entry: 5 buttons (◀ ▶ ▲ ▼ ✓). Game over restart: single ▶ button. Always visible: ✕ close (top-left), ♪ mute (top-right). Multi-touch supported. Auto-appear on first touch event (hidden on desktop). `touch-action: none` prevents browser gestures.
- [x] **Bullets stop at screen edge** — Player bullets and UFO bullets no longer wrap around the screen. They travel in a straight line and are removed when they exit the screen bounds (4px grace margin). Ship and asteroids still wrap as before.

**Build:** 108 static pages (unchanged count)

#### Session XI: About Page Polish + Generative Avatars ✅ COMPLETE (Feb 24, 2026)

**Focus:** Content polish on About page and replacement of static leadership avatars with generative animated SVG art.

- [x] **Origin story stat update** — "100+ Brands repositioned" → "1,000+ Shots of tequila" (irreverent brand personality)
- [x] **Book rating update** — "45 ratings on Amazon" → "451 ratings on Amazon"
- [x] **Generative orbital avatars** — Replaced static gradient-circle initials in leadership section with unique animated SVG avatars per leader. Each avatar is seeded deterministically from the person's name hash via a PRNG, producing unique counter-rotating elliptical orbits, orbital dots, a pulsing center core, ambient spark, and radial glow — all in brand color pairs. Pure SVG animation (no JS animation loop). Removed `initials` field from Leader interface and data.

**Build:** 108 static pages (unchanged count)

#### Session XII: About Page UX — Leadership Modal + Client Frogger ✅ COMPLETE (Feb 24, 2026)

**Focus:** Three UX improvements to the About page: cinematic leadership bio modal, client list Frogger easter egg, and tequila stat update.

- [x] **Leadership bio modal** — Replaced in-card bio expansion (which stretched grid cells and was unreadable) with a cinematic centered modal overlay. Features: backdrop blur, spring-animated entrance, 80px scaled-up generative avatar, gradient accent bar in leader's brand colors, readable `text-base` bio typography, gradient divider, prev/next navigation to browse between leaders, keyboard support (ESC close, arrow keys navigate), body scroll lock. Grid stays undisturbed.
- [x] **Client Frogger easter egg** — Turned the scrolling client marquee into a playable Frogger game. The Ocho mascot appears at bottom-right of the client section (subtle bob + pink glow, 40%→100% opacity on hover). Click to play: 5 lanes of scrolling client name pills as traffic, Ocho as the frog, navigate from START to SAFE ZONE. Level progression (speed increases), 3 lives, score multiplied by level, screen shake on hit, invulnerability blink on respawn. Canvas-based, lazy-loaded via `next/dynamic`. Keyboard (arrows/WASD) + mobile touch D-pad. ESC exits.
- [x] **Tequila stat update** — "1,000+ Shots of tequila" → "100,000 Shots of tequila"

**Build:** 108 static pages (unchanged count)

#### Session XIII: Frogger Game Polish ✅ COMPLETE (Feb 24, 2026)

**Focus:** Fix four critical UX issues with the client Frogger easter egg per user feedback.

- [x] **Canvas DPI scaling** — Added `devicePixelRatio` scaling to fix blurry rendering on Retina displays. Canvas renders at native resolution with CSS sizing.
- [x] **Speed reduction** — Base speed reduced ~70% (1.2→0.35), random variance reduced (0.8→0.25), per-lane increment halved (0.15→0.08). Level-up ramp also reduced (multiplier 0.15→0.08, lane bump 0.2→0.06). Game is now playable and progressively challenging.
- [x] **Pill spacing** — Gaps between client name pills tripled (pillH×1.8→pillH×4.5 base, random×1.2→random×3). Clear navigable lanes between obstacles.
- [x] **Start screen** — Added "CLIENT FROGGER" title screen with Ocho icon, instructions, pulsing "Press any key or tap to start" CTA, and ESC hint. Pills drift slowly in background. Game no longer dumps player into action immediately.

**Build:** 108 static pages (unchanged count)

#### Session XIV: Frogger Game Critical Bug Fixes ✅ COMPLETE (Feb 24, 2026)

**Focus:** Fix three critical bugs that made the Frogger game non-functional: broken collisions, broken scoring, broken input bounds.

- [x] **Player Y position fix (root cause)** — `getPlayerY` formula had an extra `- laneH` term, placing the player one full lane above their actual lane. The collision hitbox and pill hitbox never overlapped, so collisions never fired and the player walked through all traffic unharmed. Fixed formula to `h - laneH * (playerLane + 0.5)`.
- [x] **Keyboard DPR fix** — `handleKeyDown` used raw `canvas.width` (includes devicePixelRatio scaling) for horizontal movement bounds. On Retina displays, the player could move 2x off-screen to the right. Now divides by DPR.
- [x] **Touch DPR fix** — Touch handler computed button hit-test positions in DPR-scaled coordinates, but `drawTouchControls` rendered buttons in logical coordinates. Touch targets didn't align with visual buttons on Retina. Now uses logical coordinates throughout.

**Build:** 108 static pages (unchanged count)

#### Session XV: Frogger UX — Cars, Ocho Trigger, Overlap Fix ✅ COMPLETE (Feb 24, 2026)

**Focus:** Three Frogger easter egg UX improvements per user feedback: discoverable trigger, fix overlapping obstacles, turn pills into cars.

- [x] **Ocho trigger moved below client list** — Moved from hidden absolute-positioned bottom-right to centered below marquee rows. Added "Start" text beneath bobbing Ocho. More discoverable while still subtle.
- [x] **Overlap fix** — Wrapping logic now checks positions of all other cars in the lane before placing. Ensures minimum `pillH * 3` gap + random variance. No more overlapping/blurred client names.
- [x] **Cars instead of pills** — Side-view car shapes: rounded body with boxy corners, colored hood/bumper, tinted windshield, semicircle wheels with rims, yellow headlights, red taillights. Direction-aware (headlights face travel direction). Client names in bold on car body. Wider padding for hood/windshield accommodation.

**Build:** 108 static pages (unchanged count)

#### Session XVI: Client Marquee Car Teaser ✅ COMPLETE (Feb 24, 2026)

**Focus:** Replace pill badges in the client marquee with CSS car shapes matching the Frogger game aesthetic, serving as a visual teaser for the hidden game.

- [x] **CSS CarBadge component** — New `CarBadge` component in `ClientMarquee.tsx` renders each client name inside a miniature car shape: boxy body (border-radius 6px), colored hood/bumper, tinted windshield, yellow headlights, red taillights, dark semicircle wheels. Matches the canvas `drawCar` function from `FroggerGame.tsx`.
- [x] **Lane-colored rows** — Row 1 (left-moving) uses tangerine, row 2 (right-moving) uses tidal, matching the first two Frogger lanes. Direction-aware: headlights face the direction of travel.
- [x] **Frogger teaser effect** — The two opposing rows of car-shaped client badges create a "two lanes of traffic" visual that directly hints at the Frogger gameplay.

**Build:** 108 static pages (unchanged count)

#### Session XVII: Industries Page Content ✅ COMPLETE (Feb 24, 2026)

**Focus:** Build complete Industries section with 9 vertical-specific landing pages, seeded from the About FAQ industries answer.

- [x] **Industries data layer** — `lib/industries-data.ts` with `Industry` interface, 9 industries (HR Tech, Enterprise SaaS, FinTech, Cybersecurity, HealthTech, MarTech, DevTools, Cloud Infrastructure, AI/ML Platforms), helper functions (`getIndustryBySlug`, `getRelatedIndustries`)
- [x] **IndustriesHero component** — `components/industries/IndustriesHero.tsx` — Animated hero with dual-glow background (Sprinkles + Tidal), gradient text headline, vertical label
- [x] **IndustryCard component** — `components/industries/IndustryCard.tsx` — Glass card with color dot, stat callout, tagline, description preview, notable client badges, staggered entrance animation
- [x] **IndustryHero component** — `components/industries/IndustryHero.tsx` — Sub-page hero matching ServiceSubpageHero pattern: color glow, breadcrumb back-link, stat + buyer title display
- [x] **IndustryContent component** — `components/industries/IndustryContent.tsx` — Full detail sections: glass market context box, side-by-side pain points (numbered) vs. how-we-help (checkmarks), notable clients display, relevant services grid (links to service categories), industry-colored CTA section
- [x] **RelatedIndustries component** — `components/industries/RelatedIndustries.tsx` — 3-column cross-linking grid matching RelatedServices pattern
- [x] **Industries pillar page** — `app/industries/page.tsx` — 3×3 grid of IndustryCards + ServiceCTA, full metadata
- [x] **Industry sub-pages** — `app/industries/[slug]/page.tsx` — SSG with `generateStaticParams`, BreadcrumbList JSON-LD, full metadata per industry
- [x] **Breadcrumb schemas** — `lib/schema/breadcrumbs.ts` — Added `industriesBreadcrumb()` and `industryBreadcrumb(name)` functions

**Build:** 117 static pages (up from 108 — 9 new industry sub-pages)

#### Session XVIII: Homepage Ship SVG Fix ✅ COMPLETE (Feb 24, 2026)

**Focus:** Match the homepage hero ship SVG to the exact Asteroids game ship shape and add subtle ambient animation.

- [x] **Ship SVG replaced** — Old 6-point diamond/arrow path (`M20 40 L8 12 L16 18 L20 4 L24 18 L32 12 Z`) replaced with the exact 4-point Asteroids game ship geometry rotated to point downward (`M18 46 L32 6 L18 14 L4 6 Z`). Nose, two wings, rear notch — matches `AsteroidsGame.tsx` canvas `drawShip` proportions.
- [x] **Subtle ambient animation** — Float increased from ±4px to ±6px, added ±2° gentle rotation oscillation, slowed from 3s to 4s cycle. Added always-on soft orange glow (`drop-shadow 0.3 opacity`) that brightens on hover.

**Build:** 117 static pages (unchanged count)

#### Session XIX: Hero Ship Thruster Animation ✅ COMPLETE (Feb 24, 2026)

**Focus:** Add game-authentic thruster flame, exhaust sparks, and game-like micro-turn animations to the homepage hero ship SVG.

- [x] **Thruster flame** — Two-layer SVG flame (outer orange gradient + inner white-hot core) fires from the rear notch between wings. Rapid `scaleY` flicker on each layer for choppy retro exhaust. Intermittent bursts synced to ship rotation on 8s cycle.
- [x] **Game-like micro-turns** — Ship snaps -4° left, holds, drifts back, then snaps +3.5° right, holds, drifts back. Coordinated with thruster bursts via `times` keyframe arrays. Replaces old smooth sinusoidal rocking.
- [x] **Exhaust sparks** — 3 tiny particles (gold, orange, tangerine) drift upward from flame area on staggered timings, fade out.
- [x] **Ship drift** — Subtle -1 to -2px upward nudge during each thruster burn.

**Build:** 117 static pages (unchanged count)

#### Session XX: Pricing Page + Hero Ship Fix ✅ COMPLETE (Feb 24, 2026)

**Focus:** Build complete Pricing page with 6 sections telling the agency model story, and fix hero ship animation (rotation visibility + thruster size).

**Hero Ship Fix (done):**
- [x] **Rotation increased** — From ±4°/±3.5° (imperceptible) to ±15°/±12° (clearly visible snappy turns). Drift increased from -1/-2px to -3/-5px during burns.
- [x] **Thruster flame 4x larger** — Flame polygons relocated from dead space above ship to engine rear notch (y=14). Outer flame from 7px to 30px tall, inner flame from 5px to 20px tall. ViewBox expanded from `0 0 36 50` to `-4 -24 44 74` with SVG dimensions 44x80 to accommodate. Gradient coordinates and transform-origins updated.
- [x] **Exhaust sparks scaled** — Particle radii increased ~60%, travel distance extended to match larger flame.

**Pricing Page — 6 sections (done):**
- [x] `components/pricing/PricingHero.tsx` — "We don't sell hours. We sell growth." Word-by-word 3D animated headline with gradient text, dual background glows (tangerine + sprinkles), scroll indicator.
- [x] `components/pricing/ModelOverview.tsx` — Core premise + model inversion. Side-by-side contrast panels (conventional agency vs TSC) + 4 outcome metric cards (Pipeline, CAC, Time-to-Revenue, Efficiency) in brand colors.
- [x] `components/pricing/FourPillars.tsx` — 2x2 glass card grid: 01 Senior Talent Only (tangerine), 02 Proprietary AI Infrastructure (neon cactus), 03 AI Solutions Built Into Your World (tidal wave), 04 Continuity Compounds Results (sprinkles). Each with watermark number, colored left border, hook + description.
- [x] `components/pricing/WhyDifferent.tsx` — Visual pyramid: two limitation cards (Senior Talent Alone / AI Alone with ✕ markers) feeding into full-width "Combination" card with tangerine border glow and ✓ marker.
- [x] `components/pricing/PricingCards.tsx` — Two glass pricing cards: Subscription ($15K/mo, "Most Popular" badge, tangerine CTA) and Project ($30K minimum, "Defined Scope" badge, tidal checkmarks). Both link to /book.
- [x] Reused `ServiceCTA` for final call-to-action section.
- [x] `app/pricing/page.tsx` — Page with full metadata, keywords, OpenGraph, BreadcrumbList JSON-LD.
- [x] `lib/schema/breadcrumbs.ts` — Added `pricingBreadcrumb()`.
- [x] Navigation updated: Header navLinks + Footer companyLinks.

**Build:** 118 static pages (up from 117 — new `/pricing` route)

#### Session XXI: Services CTA Direct-to-Book ✅ COMPLETE (Feb 24, 2026)

**Focus:** Replace "Explore" buttons on /services hub with direct-to-book CTAs that pass service context through to Cal.com.

- [x] **ServiceCategoryStrip CTAs** — "Explore {name} →" ghost buttons replaced with "Let's Talk about {name}" tangerine primary CTAs linking to `/book?service={name}`
- [x] **Book page service context** — `useSearchParams()` reads `?service=` param, displays "You're interested in / {service}" above calendar, prefills Cal.com notes with `Interested in: {service}`
- [x] **Suspense boundary** — Wrapped BookPageContent in `<Suspense>` for Next.js 14 static build compatibility

**Build:** 118 static pages (unchanged — no new routes)

#### Session XXII: Answer Capsules Sitewide ✅ COMPLETE (Feb 24, 2026)

**Focus:** Add AI-citation-optimized answer capsules (FAQ accordions with FAQPage JSON-LD) to every major section of the site.

- [x] **Generic AnswerCapsulesSection component** — `components/AnswerCapsulesSection.tsx` — Reusable accordion component with configurable heading, subheading, accent color. Glass cards, Framer Motion expand/collapse, staggered entrance animations. Replaced initial service-specific component.
- [x] **Service answer capsules** — 24 Q&As (4 per service category) added to `lib/services-data.ts`. `AnswerCapsule` interface defined. Wired into `/services/[slug]` pages with FAQPage JSON-LD schema.
- [x] **Industry answer capsules** — 36 Q&As (4 per industry vertical) added to `lib/industries-data.ts`. Wired into `/verticals/[slug]` pages with FAQPage JSON-LD schema. Subheading personalized per buyer title.
- [x] **Pricing answer capsules** — 5 Q&As about engagement models, ROI, and pricing rationale. `lib/schema/pricing-faq.ts` created. Wired into `/pricing` page with FAQPage JSON-LD schema.
- [x] **Schema infrastructure** — `lib/schema/service-faq.ts` updated with `getFaqSchema` alias for cross-section reuse.

**Content approach:** Every answer's first sentence is a standalone quotable capsule (20-25 words) optimized for AI citation — following the AEO pattern where AI engines can cite just the first sentence as a complete answer.

**Coverage:** 71 total answer capsules across 17 pages (6 service + 9 industry + 1 pricing + 1 about [pre-existing]).

**Build:** 118 static pages (unchanged — no new routes)

#### Session XXIII: Industries → Verticals Rename + Hub Page Answer Capsules ✅ COMPLETE (Feb 24, 2026)

**Focus:** Rename "Industries" section to "Verticals" sitewide. Add answer capsules (FAQ accordions with FAQPage JSON-LD) to all major hub pages and homepage.

**Rename — Industries → Verticals (done):**
- [x] Route change: `app/industries/` → `app/verticals/` (new URL paths: `/verticals` and `/verticals/[slug]`)
- [x] Navigation: Header + Footer labels and hrefs updated to "Verticals" / `/verticals`
- [x] Sub-page components: "← All Industries" → "← All Verticals", "Related Industries" → "Related Verticals"
- [x] IndustryCard links: `/industries/[slug]` → `/verticals/[slug]`
- [x] Breadcrumb schema: `industriesBreadcrumb`/`industryBreadcrumb` → `verticalsBreadcrumb`/`verticalBreadcrumb`
- [x] Page metadata: "Industries | TSC" → "Verticals | TSC" in titles
- [x] About FAQ: "What industries does TSC serve?" → "What verticals does TSC specialize in?"
- [x] Sitemap: Added `/verticals` hub + 9 sub-pages (were missing before)
- [x] Internal types/data files (`Industry`, `INDUSTRIES`, `lib/industries-data.ts`) kept as-is — implementation detail

**Hub page answer capsules (done):**
- [x] **Homepage** — 5 Q&As (agency-level buyer questions): why hire agency, what types of companies, AI approach, timeline to impact, getting started. Accent: Atomic Tangerine.
- [x] **Services hub** — 5 Q&As (service model questions): what services offered, starting with one, AI-native meaning, measurement. Accent: Atomic Tangerine.
- [x] **Verticals hub** — 4 Q&As (vertical expertise questions): which verticals, only these, how expertise helps, longest vertical. Accent: Sprinkles.
- [x] **Insights hub** — 4 Q&As (content engine questions): content types, how different, using insights, who creates. Accent: Tidal Wave.
- [x] **New data file** — `lib/schema/hub-faqs.ts` with all 18 capsules across 4 page sets.
- [x] FAQPage JSON-LD schema on all 4 pages.

**Coverage:** 89 total answer capsules across 21 pages (6 service sub + 9 vertical sub + 1 pricing + 1 about + 1 homepage + 1 services hub + 1 verticals hub + 1 insights hub).

**Build:** 118 static pages (unchanged — route rename is 1:1 swap)

#### Session XXIV: Easter Egg Arcade System — Breakout Game + Boss Celebration + Frogger Upgrades ✅ COMPLETE (Feb 24, 2026)

**Focus:** Add Breakout game to Services page, unify all easter egg triggers sitewide, add boss celebration system with email capture, upgrade Frogger with SFX and high scores.

**New files:**
- [x] `components/OchoTrigger.tsx` — Shared easter egg trigger (bobbing Ocho mascot with Sprinkles glow). Replaces per-game trigger implementations.
- [x] `components/services/BreakoutGame.tsx` — Full Breakout game with canvas, Web Audio SFX, high scores, touch controls. 6 rows of brand-colored bricks, gradient paddle, level progression.
- [x] `components/ArcadeBossOverlay.tsx` — Shared confetti + email capture overlay. 80 animated confetti pieces, "YOU'RE THE NEW BOSS OF THE ARCADE!" heading, email → POST `/api/arcade-boss`.
- [x] `app/api/arcade-boss/route.ts` — POST endpoint for #1 high score email capture. Stores in `arcade_bosses` collection. Graceful degradation without MongoDB.

**Modified files:**
- [x] `components/home/HeroSection.tsx` — Replaced ship SVG trigger with shared OchoTrigger.
- [x] `components/about/ClientMarquee.tsx` — Replaced inline Ocho trigger with shared OchoTrigger.
- [x] `components/services/BridgeStatement.tsx` — Added game state + BreakoutGame + OchoTrigger.
- [x] `components/about/FroggerGame.tsx` — Full rewrite: added SFX class (hop, hit, levelUp, gameOver), high scores with initials entry, close/mute touch buttons, game over overlay, boss overlay trigger.
- [x] `components/home/AsteroidsGame.tsx` — Added bossActive ref, bossData state, boss overlay trigger on #1 high score.
- [x] `components/services/BreakoutGame.tsx` — Added bossActive ref, bossData state, boss overlay trigger on #1 high score.

**Build:** 119 pages (added `/api/arcade-boss` route)

#### Session XXV: Tron Light Cycle Game on Pricing Page ✅ COMPLETE (Feb 24, 2026)

**Focus:** Add Tron light cycle racing game as 4th arcade easter egg on the Pricing page. Same pattern as all other games: OchoTrigger, SFX, high scores, boss celebration, touch controls, lazy loading.

**New files:**
- [x] `components/pricing/TronGame.tsx` — Full Tron light cycle game. Player vs AI cycles on a grid, neon glow trails, tick-based movement, levels (1–4 enemies), Web Audio SFX (engine hum, turn clicks, crash, enemy crash, countdown, level-up, game-over), high scores with initials, boss overlay on #1, touch D-pad, 3-2-1 countdown.

**Modified files:**
- [x] `components/pricing/WhyDifferent.tsx` — Added game state, dynamic import of TronGame, OchoTrigger below "The Combination" card.

**Build:** 119 pages (unchanged — no new routes)

#### Session XXVI: Tron Visual Overhaul + Arcade Cursor Fix ✅ COMPLETE (Feb 24, 2026)

**Focus:** Upgrade Tron game visuals to match the classic Tron arcade aesthetic (brighter grid, directional light cycle sprites, neon glow trails, vignette). Fix invisible cursor on all game high score/boss overlay screens.

**Modified files:**
- [x] `components/pricing/TronGame.tsx` — Visual overhaul: CELL 4→8, blue-black background, major/minor grid lines, neon border with glow, 3-layer trail rendering (outer glow + core + center line), directional arrow/chevron light cycle sprites, vignette effect, bigger sparks. Cursor fix: `isOver` state toggles cursor visibility on game-over.
- [x] `components/ArcadeBossOverlay.tsx` — Cursor fix: `data-arcade-boss` attribute + CSS rules restoring native cursor (default, pointer on buttons, text on inputs) with `!important` to override global `cursor: none`.
- [x] `components/home/AsteroidsGame.tsx` — Cursor fix: `isOver` state + `data-asteroids-game` attribute + `<style>` tag to show cursor on game-over screen.
- [x] `components/services/BreakoutGame.tsx` — Cursor fix: `isOver` state + `data-breakout-game` attribute + `<style>` tag to show cursor on game-over screen.

**Build:** 119 pages (unchanged — no new routes)

#### Session XXVII: Pricing Cards Polish ✅ COMPLETE (Feb 24, 2026)

**Focus:** Clean up pricing cards — remove badge pills, update copy, add booking context passthrough. User declared pricing page "done" after these fixes.

**Modified files:**
- [x] `components/pricing/PricingCards.tsx` — Removed "Most Popular" and "Defined Scope" badge pills. Changed "Starting at" to "minimum" on both cards. Updated subscription checklist (Strategic planning, Opportunity prioritization, Traditional agency services, AI workflows and custom builds). CTA buttons now read "Let's talk about a subscription" / "Let's talk about a project". Links pass `?service=Subscription` / `?service=Project` to `/book` page, which flows into Cal.com embed notes. Added flex-col layout with mt-auto on CTAs for equal-height cards.

**Build:** 119 pages (unchanged — no new routes)

#### Session XXVIII: 5 New Arcade Games — Complete Arcade on Every Page ✅ COMPLETE (Feb 24, 2026)

**Focus:** Add arcade easter egg games to all 5 remaining pages (Insights, Verticals, Work, Careers, Contact). Every page now has a hidden game triggered by the shared OchoTrigger component. All games follow the same infrastructure: canvas-based, Web Audio SFX, high scores with initials, boss celebration overlay, touch controls, lazy-loaded via `next/dynamic`.

**New files:**
- [x] `components/contact/PongGame.tsx` — Classic Pong vs AI. Player paddle (mouse/touch/keyboard) vs AI paddle. Set-based scoring (first to 11), level progression, CRT scanline aesthetic, ball trail effect.
- [x] `components/contact/PongGameTrigger.tsx` — Client wrapper for dynamic import + OchoTrigger.
- [x] `components/insights/SnakeGame.tsx` — Classic Snake/Nibbles. Tick-based grid movement, food eating, snake growth. Neon Cactus snake with glow, Sprinkles food with pulsing glow.
- [x] `components/insights/SnakeGameTrigger.tsx` — Client wrapper.
- [x] `components/industries/SpaceInvadersGame.tsx` — Classic Space Invaders. 5x11 enemy formation, destructible shields, UFO bonus, march rhythm SFX, 2-frame enemy animation.
- [x] `components/industries/SpaceInvadersGameTrigger.tsx` — Client wrapper.
- [x] `components/work/GalagaGame.tsx` — Classic Galaga. Curved formation, bezier dive attacks, boss capture/tractor beam mechanic, dual fighter mode, parallax starfield.
- [x] `components/work/GalagaGameTrigger.tsx` — Client wrapper.
- [x] `components/careers/PacManGame.tsx` — Classic Pac-Man. 28x31 maze, 4 ghost AIs (Blinky/Pinky/Inky/Clyde), power pellets, frightened mode, ghost eating streak, tunnel wrap, fruit bonus.
- [x] `components/careers/PacManGameTrigger.tsx` — Client wrapper.

**Modified files:**
- [x] `app/contact/page.tsx` — Added PongGameTrigger import and placement.
- [x] `app/insights/page.tsx` — Added SnakeGameTrigger between Content Type Grid and AnswerCapsulesSection.
- [x] `app/verticals/page.tsx` — Added SpaceInvadersGameTrigger between Industry Cards and AnswerCapsulesSection.
- [x] `app/work/page.tsx` — Added GalagaGameTrigger below hero section.
- [x] `app/careers/page.tsx` — Added PacManGameTrigger below hero section.

**New directories:**
- `components/work/`, `components/careers/`, `components/contact/`

**Build:** 119 pages (unchanged — all games are lazy-loaded, zero bundle cost until played)

#### Session XXIX: Arcade Game Enhancements — Space Invaders, Asteroids, Snake ✅ COMPLETE (Feb 24, 2026)

**Focus:** Visual and gameplay upgrades to 3 arcade games: classic arcade aesthetic for Space Invaders, UFO standardization across games, multi-food system for Snake.

**Modified files:**
- [x] `components/industries/SpaceInvadersGame.tsx` — Classic arcade visual overhaul: deep navy CRT background (#0a0a1e), Neon Cactus shields with glow, Atomic Tangerine ground line, scanlines. Reduced UFO frequency (timer 500→1200 base, all 4 reset points fixed). Added Ocho mascot rendering for commander row (type 0 enemies) with Sprinkles glow and bob animation.
- [x] `components/home/AsteroidsGame.tsx` — UFO standardization: replaced Ocho image UFO with drawn classic saucer (ellipse body + dome arc). Changed UFO hum from square to sawtooth oscillators to match Space Invaders. Removed unused ochoImg ref and image loading code.
- [x] `components/insights/SnakeGame.tsx` — Multi-food system overhaul: 3 regular foods always present (was 1), bonus food (cyan diamond, +5pts, spawns every ~12s, lasts ~7s), golden food (orange star, +10pts, spawns every ~24s, lasts ~5s). Combo system (eat within ~1s for escalating multipliers up to x6). Eat sparks, floating score text, food blink when expiring. New SFX for bonus/golden/combo.

**Build:** 119 pages (unchanged — no new routes)

#### Session XXX: Snake → Serpent Arena Rewrite ✅ COMPLETE (Feb 24, 2026)

**Focus:** Complete ground-up rewrite of the Snake easter egg game into "Serpent Arena" — a battle royale Snake with AI opponents, waves, power-ups, and a shrinking arena.

**Modified files:**
- [x] `components/insights/SnakeGame.tsx` — Total rewrite (1107 → 918 lines). New game: player vs 3-6 AI snakes with 3 behavior types (Hunter targets player, Forager targets food, Aggressive targets nearest snake). Wave system with escalating difficulty. 3 power-ups (Shield, Ghost, Lightning). Boost mechanic (Space key, costs body segments). Shrinking arena border with red danger zone. Dead snakes drop food pellets. 10 SFX (kill boom, lightning zap, shield clang, boost pulse, wave start sweep, etc.). All existing infrastructure preserved (high scores, boss overlay, touch controls with added boost button).

**Build:** 119 pages (unchanged — no new routes)

#### Session XXXI: "Game Over" Concept — Arcade Components + Trigger Overhaul ✅ COMPLETE (Feb 25, 2026)

**Focus:** Begin "Game Over" concept-driven site evolution. Created two new arcade-themed components and replaced all 9 game triggers with a new 1-Player arcade button.

**What was done:**
- [x] Added Press Start 2P font (Google Fonts via `next/font/google`, `--font-arcade` CSS variable, `font-arcade` Tailwind class)
- [x] Created `components/CoinSlotCTA.tsx` — arcade coin slot CTA button (metallic frame, corner screws, recessed LED display, "25¢" / "PUSH" in Press Start 2P with LED glow, idle pulse/flicker, press-in animation, links to `/book`)
- [x] Created `components/ArcadeButton.tsx` — classic 1-Player arcade cabinet button (dark bezel housing, concave Atomic Tangerine button face, white stick figure SVG icon, bob animation, hover glow, press-in depression)
- [x] Replaced OchoTrigger with ArcadeButton in all 9 game trigger locations (5 dedicated trigger files + 4 inline in HeroSection, WhyDifferent, BridgeStatement, ClientMarquee)
- [x] Deleted `components/OchoTrigger.tsx` (zero remaining references)

**Modified files:**
- `app/layout.tsx` — Added Press Start 2P font import + CSS variable
- `tailwind.config.ts` — Added `arcade` font family
- `components/CoinSlotCTA.tsx` — NEW
- `components/ArcadeButton.tsx` — NEW
- `components/OchoTrigger.tsx` — DELETED
- `components/home/HeroSection.tsx` — OchoTrigger → ArcadeButton
- `components/about/ClientMarquee.tsx` — OchoTrigger → ArcadeButton
- `components/services/BridgeStatement.tsx` — OchoTrigger → ArcadeButton
- `components/pricing/WhyDifferent.tsx` — OchoTrigger → ArcadeButton
- `components/contact/PongGameTrigger.tsx` — OchoTrigger → ArcadeButton
- `components/careers/PacManGameTrigger.tsx` — OchoTrigger → ArcadeButton
- `components/insights/SnakeGameTrigger.tsx` — OchoTrigger → ArcadeButton
- `components/industries/SpaceInvadersGameTrigger.tsx` — OchoTrigger → ArcadeButton
- `components/work/GalagaGameTrigger.tsx` — OchoTrigger → ArcadeButton

**Build:** 119 pages (unchanged — no new routes)

#### Session XXXII: ArcadeButton Photo Upgrade ✅ COMPLETE (Feb 25, 2026)

**Focus:** Replace CSS-gradient ArcadeButton with real arcade button photo for all 9 easter egg triggers.

**What was done:**
- [x] Replaced ArcadeButton's CSS-gradient circle + inline SVG stick figure with real 3D arcade button photo (`public/images/1_player.png`, 25KB transparent PNG exported from Canva at 128×128)
- [x] Switched from inline styling to `next/image` for optimized loading
- [x] Hover glow now uses CSS `drop-shadow` filter instead of `boxShadow` (works on transparent PNG)
- [x] Removed `PlayerIcon` component and all CSS-gradient bezel/button-face styling
- [x] Cleaned up unused files: `1_player.svg` (158KB) and `1_player_backup.svg`

**Modified files:**
- `components/ArcadeButton.tsx` — Complete rewrite: photo-based button via `next/image`
- `public/images/1_player.png` — NEW: 25KB transparent PNG of real arcade 1-Player button
- `public/images/1_player.svg` — DELETED (158KB, raster data wrapped in SVG)

**Build:** 119 pages (unchanged — no new routes)

#### Session XXXIII: ArcadeButton Focus Outline Fix ✅ COMPLETE (Feb 25, 2026)

**Focus:** Fix browser focus outline box appearing on ArcadeButton after exiting games.

**What was done:**
- [x] Fixed focus outline/ring appearing on ArcadeButton after closing games (ESC back to page)
- [x] Added `focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0` to suppress both native and Tailwind focus indicators

**Modified files:**
- `components/ArcadeButton.tsx` — Added focus/ring reset classes to button element

**Build:** 119 pages (unchanged — no new routes)

#### Session XXXIV: "GAME OVER" Homepage Hero + ArcadeButton Fix ✅ COMPLETE (Feb 25, 2026)

**Focus:** First visible execution of the "Game Over" creative concept — replace homepage hero headline with arcade-styled "GAME OVER" in Press Start 2P. Also fix persistent ArcadeButton square/box rendering issue.

**What was done:**
- [x] Rewrote homepage hero headline: "See marketing in a whole new light." → "GAME OVER" in Press Start 2P with LED glow + CRT flicker + scanline overlay
- [x] New sub-headline copy: "The SaaS marketing era is over. AI-native marketing is a whole new game. TSC is the B2B agency you can trust to help you level up."
- [x] "level up" rendered with animated GradientText (tangerine→cactus→tidal-wave)
- [x] Animation choreography: staggered entrance (scale 1.15→1), CRT flicker loop (5s), scanline fade-in, sub-headline + CTA slide-up
- [x] Reduced motion support: static glow only, no flicker/scale animations
- [x] Crisp pixel rendering via `-webkit-font-smoothing: none` on headline
- [x] Added reusable `.crt-scanlines` CSS utility to globals.css
- [x] Updated OG title metadata: "Game Over for Traditional B2B Marketing"
- [x] Fixed ArcadeButton square box: switched from `<motion.button>` to `<motion.div>` with `role="button"` to eliminate browser default button styling; added `unoptimized` to Image to prevent PNG→WebP conversion artifacts

**Modified files:**
- `components/home/HeroSection.tsx` — Complete hero rewrite (headline, sub-headline, animation choreography)
- `components/ArcadeButton.tsx` — Changed from motion.button to motion.div, added unoptimized Image
- `app/globals.css` — Added `.crt-scanlines` utility class
- `app/layout.tsx` — Updated OG title string

**Build:** 119 pages (unchanged — no new routes)

#### Session XXXV: ArcadeButton Focus Ring Fix (/stuck protocol) ✅ COMPLETE (Feb 25, 2026)

**Focus:** Fix persistent ArcadeButton square box that reappears after game exit. Used /stuck protocol to diagnose root cause after two prior sessions failed to fix it.

**Root cause found:**
- Session XXXIII added focus-suppressing Tailwind classes (`focus:outline-none`, `focus-visible:outline-none`, `focus:ring-0`, `focus-visible:ring-0`) to `motion.button`
- Session XXXIV rewrote the component from `motion.button` → `motion.div` but **dropped all focus-suppressing classes** in the rewrite
- The `motion.div` retained `tabIndex={0}`, so the browser rendered its default focus ring when focus returned to the element after game exit (Escape key)

**What was done:**
- [x] Restored focus-suppressing Tailwind classes on the `motion.div`: `outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0`
- [x] Added belt-and-suspenders inline `style={{ outline: 'none' }}` to guarantee no browser or Framer Motion override

**Modified files:**
- `components/ArcadeButton.tsx` — Restored focus classes + inline outline suppression

**Build:** 119 pages (unchanged — no new routes)

#### Session XXXVI: Homepage ArcadeButton Conditional Render Fix ✅ COMPLETE (Feb 25, 2026)

**Focus:** Fix the persistent square focus box around the ArcadeButton that appeared ONLY on the homepage — the bug that Sessions XXXIII–XXXV failed to fix by modifying the shared component.

**Root cause found:**
- The homepage was the ONLY page that rendered ArcadeButton unconditionally (always in the DOM)
- All 8 other pages used `{!playing && <ArcadeButton />}` to unmount the button during gameplay
- On the homepage, when Asteroids closed, browser focus returned to the still-mounted `motion.div[tabIndex=0]`, triggering the browser's focus indicator
- On other pages, the button was freshly mounted after game close — no focus state, no box
- Three sessions of CSS focus-suppression on the shared `ArcadeButton.tsx` couldn't fix it because the problem was never in the component — it was in the homepage's rendering pattern

**What was done:**
- [x] Wrapped homepage ArcadeButton in `{!playing && (...)}` conditional, matching all other pages

**Modified files:**
- `components/home/HeroSection.tsx` — Added conditional render around ArcadeButton (line 54)

**Build:** 119 pages (unchanged — no new routes)

#### Session XXXVII: CTA Attribution System + AEO Gap Analysis ✅ COMPLETE (Feb 25, 2026)

**Focus:** Build site-wide interaction tracking infrastructure, CTA attribution to Cal.com bookings, swap homepage hero CTA to CoinSlotCTA, and comprehensive AEO donor gap analysis.

**New files:**
- [x] `lib/tracking.ts` — Client-side tracking utility (sendBeacon, sessionStorage UUID, TrackEvent type)
- [x] `app/api/track/route.ts` — POST endpoint → MongoDB `interactions` collection (follows arcade-boss pattern)
- [x] `components/TrackingProvider.tsx` — Global `data-track-*` click listener + automatic page view tracking

**Modified files:**
- [x] `app/layout.tsx` — Added `<TrackingProvider />` for site-wide tracking
- [x] `components/CoinSlotCTA.tsx` — Added optional `ctaId` prop + data-track attributes
- [x] `components/MagneticButton.tsx` — Added optional `ctaId` prop + data-track attributes
- [x] `components/insights/CtaStrip.tsx` — Added optional `ctaId` prop (default: `'insights-strip'`) + auto-appends `?cta=` to href
- [x] `components/home/HeroSection.tsx` — **Swapped plain "Let's Talk" Link to CoinSlotCTA** (`ctaId="homepage-hero"`)
- [x] `components/home/CtaSection.tsx` — `ctaId="homepage-cta"`
- [x] `components/Header.tsx` — Desktop `ctaId="header-nav"`, mobile `ctaId="header-mobile"`
- [x] `components/Footer.tsx` — `ctaId="footer"`
- [x] `components/services/ServiceCTA.tsx` — `ctaId="services-bottom"`
- [x] `components/services/ServiceCategoryStrip.tsx` — Dynamic `ctaId="services-{slug}"`
- [x] `components/pricing/PricingCards.tsx` — `pricing-subscription` + `pricing-project`
- [x] `components/industries/IndustryContent.tsx` — `ctaId="vertical-bottom"`
- [x] `app/book/page.tsx` — Reads `?cta=` param, includes in Cal.com notes as `"Source: {ctaId}"`

**AEO Gap Analysis:** Comprehensive comparison of AEO vs TSC infrastructure documented in plan file. See `docs/sessions/session-xxxvii-ledger.yaml` for full gap table.

**Build:** 119 pages (unchanged — new `/api/track` route added, no new static pages)

#### Session XXXVIII: CoinSlotCTA Image Swap + "New Game" CTA Rebrand ✅ COMPLETE (Feb 25, 2026)

**Focus:** Replace CSS-drawn CoinSlotCTA with real coin_slot.png image + background glow. Rebrand all site-wide CTA buttons from "Let's Talk!" to "New Game" (Game Over concept alignment).

**Modified files:**
- [x] `components/CoinSlotCTA.tsx` — Replaced entire CSS-drawn coin slot (metallic frame, screws, LED text, divider) with `coin_slot.png` image via `next/image` + radial background glow + drop-shadow
- [x] `components/Header.tsx` — Desktop + mobile nav CTA: "Let's Talk!" → "New Game"
- [x] `components/Footer.tsx` — Footer CTA link: "Let's Talk! →" → "New Game →"
- [x] `components/home/CtaSection.tsx` — Homepage bottom CTA: "Let's Talk!" → "New Game"
- [x] `components/services/ServiceCTA.tsx` — Services/about/pricing/verticals bottom CTA: "Let's Talk!" → "New Game"
- [x] `components/services/ServiceCategoryStrip.tsx` — Per-category CTA: "Let's Talk about {name}" → "New Game"
- [x] `components/industries/IndustryContent.tsx` — Verticals sub-page bottom CTA: "Let's Talk!" → "New Game"
- [x] `components/insights/CtaStrip.tsx` — Default button text on all insight pages: "Let's Talk!" → "New Game"

**New assets:**
- [x] `public/images/coin_slot.png` — 128×128 transparent PNG, real "25¢ INSERT COIN TO PLAY" arcade panel

**Not changed (pricing page is DONE per user directive):**
- Pricing cards still say "Let's talk about a subscription" / "Let's talk about a project"

**Build:** 120 pages, PASS

#### Session XXXIX: CoinSlotCTA Pixel-Perfect Rendering Fix ✅ COMPLETE (Feb 25, 2026)

**Focus:** Fix blurry upscaled CoinSlotCTA image — render at native 128×128, add pixelated rendering, scale glow proportionally, tighten hero spacing.

**Modified files:**
- [x] `components/CoinSlotCTA.tsx` — Image 200×200 → 128×128, added `imageRendering: 'pixelated'`, drop-shadow 8px/20px → 5px/14px
- [x] `components/home/HeroSection.tsx` — CTA wrapper `mt-12` → `mt-8`

**Build:** 120 pages, PASS

#### Session XL: Hero Composition Polish ✅ COMPLETE (Feb 25, 2026)

**Focus:** Refine homepage hero composition — GAME OVER gradient, spatial layout within sphere, subhead tightening.

**Modified files:**
- [x] `components/home/HeroSection.tsx` — Moving gradient on GAME OVER headline, arcade button spacing mb-6→mb-10, subhead narrowed max-w-2xl→max-w-[600px] with text-base/md:text-lg, coin slot pushed below sphere mt-8→mt-20, "level up" changed from animated gradient to white bold
- [x] Removed `GradientText` import and `ledGlow` constant (replaced by gradient classes + drop-shadow)

**Build:** 120 pages, PASS

#### Session XLI: Infrastructure Ops — Vercel Env Vars + MongoDB Indexes + Resend Domain ✅ COMPLETE (Feb 25, 2026)

**Focus:** Clear carry-forward ops debt — set up Resend email infrastructure, create MongoDB indexes, link Vercel CLI.

- [x] Link Vercel CLI to tsc-primary-website project
- [x] Add RESEND_API_KEY, LEAD_RECIPIENTS, RESEND_FROM to Vercel env vars (all 3 environments)
- [x] Create MongoDB indexes for `interactions` collection (timestamp_desc, ctaId_timestamp, sessionId_timestamp, ttl_180d)
- [x] Add thestarrconspiracy.com domain to Resend dashboard
- [x] Add Resend DNS records at domain provider for thestarrconspiracy.com (user confirmed done)

**Build:** 120 pages, PASS

#### Session XLII: Contact Page "CONTINUE?" + CTA Routing ✅ COMPLETE (Feb 25, 2026)

**Focus:** Build full Contact page with "CONTINUE?" arcade headline, dual-path UX (form + calendar), lead API, CTA routing migration.

**New files created:**
- [x] `app/api/lead/route.ts` — Lead API: validates name+email, stores in MongoDB `leads` collection, sends team notification + auto-reply via Resend
- [x] `lib/schema/contact-faq.ts` — 5 answer capsules about the engagement process
- [x] `components/contact/ContactHero.tsx` — "CONTINUE?" headline with animated gradient (same treatment as GAME OVER), CRT flicker, scanlines, HeroParticles
- [x] `components/contact/ContactDualPath.tsx` — Side-by-side glass cards: "Drop a line" form + "Book a call" Cal.com embed
- [x] `components/contact/ContactForm.tsx` — 3-field form (name, email, message) with idle/loading/success/error states
- [x] `components/contact/ContactCalendar.tsx` — Cal.com iframe with postMessage resize + query param forwarding

**Files modified:**
- [x] `app/contact/page.tsx` — Replaced placeholder with full page (hero, dual-path, Pong trigger, FAQ capsules, JSON-LD)
- [x] `lib/schema/breadcrumbs.ts` — Added `contactBreadcrumb()`
- [x] CTA routing migration (8 files): general CTAs `/book` → `/contact`; service-specific CTAs stay on `/book`
  - `components/Header.tsx` (desktop + mobile), `components/Footer.tsx`, `components/home/HeroSection.tsx`, `components/home/CtaSection.tsx`, `components/services/ServiceCTA.tsx`, `components/industries/IndustryContent.tsx`, `components/insights/CtaStrip.tsx`, `components/CoinSlotCTA.tsx`

**Build:** 121 pages, PASS

#### Session XLIII: Homepage Hero Refinement ✅ COMPLETE (Feb 25, 2026)

**Focus:** Declutter homepage hero — move CoinSlotCTA to bottom-of-page CTA section, center remaining hero content within the particle sphere.

**Files modified:**
- [x] `components/home/HeroSection.tsx` — Removed CoinSlotCTA, tightened subhead (max-w 600→480px, mt-8→mt-10), hero content now: arcade button + GAME OVER headline + subhead only
- [x] `components/home/CtaSection.tsx` — Replaced MagneticButton "New Game" with CoinSlotCTA coin slot image

**Build:** 121 pages, PASS

#### Session XLIV: Hero-to-Content Transition Polish ✅ COMPLETE (Feb 25, 2026)

**Focus:** Smooth the harsh transition between the starfield hero and the "Who We Are" section — add gradient fade, layer content over fading stars, reduce gap by ~20%.

**Files modified:**
- [x] `components/home/HeroSection.tsx` — Added h-64 bottom gradient overlay (transparent → #141213) to dissolve starfield; scroll indicator gets z-10
- [x] `components/home/WhoWeAreSection.tsx` — Negative margin (-mt-20 md:-mt-28) to overlap fading starfield; z-10 for layering; py split into explicit pt/pb

**Build:** 121 pages, PASS

#### Session XLV: Homepage Hero Button + Contact Fade ✅ COMPLETE (Feb 25, 2026)

**Focus:** Final homepage hero polish — move 1_player arcade button below the sphere; add starfield fade to contact page hero.

**Files modified:**
- [x] `components/home/HeroSection.tsx` — Moved ArcadeButton from above headline to below sphere, absolutely positioned at bottom-[22%] (1/3 into gap between sphere and WhoWeAre section)
- [x] `components/contact/ContactHero.tsx` — Added h-64 bottom gradient fade (transparent → #141213), same treatment as homepage hero

**Build:** 121 pages, PASS

#### Session XLVI: ArcadeButton Scroll Indicator + Cal.com Fixes ✅ COMPLETE (Feb 25, 2026)

**Focus:** Move ArcadeButton to replace scroll indicator on homepage hero; fix Cal.com calendar embed (metadata leak, jumpiness, black box).

**Files modified:**
- [x] `components/home/HeroSection.tsx` — ArcadeButton replaces scroll indicator at bottom-8; delay 2.8s (fades in after headline animation)
- [x] `components/contact/ContactCalendar.tsx` — Removed source tracking from Cal.com notes param; smooth CSS height transitions; container ref replaces iframe ref
- [x] `components/contact/ContactDualPath.tsx` — Removed unused ctaSource prop from ContactCalendar
- [x] `app/book/page.tsx` — Same Cal.com fixes: removed source tracking, smooth height transitions, container ref

**Build:** 121 pages, PASS

#### Session XLVII (upcoming): Pipeline Infrastructure + Game Over Expansion
- [ ] Copy pipeline infrastructure from AEO:
  - `lib/pipeline/*.ts` (circuit-breaker, error-classifier, logger, stuck-detector, etc.)
- [ ] Adapt `content-guardrails.ts` for new collections
- [ ] Create source monitors for B2B/AI marketing news
- [ ] Expand "Game Over" concept to other page copy/headlines
- [ ] Build chatbot (chaDbot) — copy RAG from AEO
- [ ] Initialize Vercel Analytics (`@vercel/analytics` already installed)
- [ ] Create MongoDB index on `leads` collection (timestamp: -1)

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

#### Session XI: Vertical Pages ✅ COMPLETE (Session XVII, renamed Session XXIII)
- [x] `/verticals` hub page (originally `/industries`, renamed Session XXIII)
- [x] 9 vertical sub-pages from kernel ICP + FAQ verticals (Session XVII)
- [x] Each: vertical-specific pain points, how TSC helps, relevant services, related verticals, BreadcrumbList JSON-LD
- [x] Answer capsules on hub + all sub-pages with FAQPage JSON-LD (Sessions XXII–XXIII)

#### Session XII: About, Contact, Work, Careers
- [x] `/about`, `/contact`, `/work`, `/careers` stub pages created (Session VI)
- [x] About: 10 leadership bios, founding story, 52-client marquee, FAQ, AEO schemas (Session VII)
- [x] Contact: Full page with "CONTINUE?" hero, dual-path (form + Cal.com), lead API, FAQ capsules (Session XLII)
- [ ] Work: Case study showcase
- [ ] Careers: Job listings, culture

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
