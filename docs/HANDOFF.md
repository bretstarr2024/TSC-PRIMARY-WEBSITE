# Session Handoff: The Starr Conspiracy Smart Website

**Last Updated:** February 24, 2026 (Session XXII)

---

## Current Phase: Phase 1 COMPLETE + Industries + Pricing + Answer Capsules

The site is live with **118 static pages** across 10 content types, 9 industry verticals, a full Pricing page, and **71 answer capsules** across 16 pages optimized for AI search citation. Session XXII added AEO-optimized FAQ accordions (with FAQPage JSON-LD schema) to every service sub-page, every industry sub-page, and the pricing page. Services section is now fully complete including answer capsules.

- **Active systems:** Vercel deployment (tsc-primary-website.vercel.app), GitHub (bretstarr2024/TSC-PRIMARY-WEBSITE), MongoDB Atlas (`tsc` database with 10 collections, ~80 documents)
- **Next actions:** Build Contact page with form, pipeline infrastructure from AEO, chatbot (chaDbot)
- **Roadmap:** See `docs/roadmap.md` Session XXII

### Session XXII Summary (February 24, 2026)

**Focus:** Add AI-citation-optimized answer capsules to every major section of the site.

**What was done:**

1. **Generic AnswerCapsulesSection component** (1 new file):
   - `components/AnswerCapsulesSection.tsx` — Reusable accordion component accepting configurable heading (ReactNode), subheading, accent color, and label. Glass cards with Framer Motion expand/collapse, category-colored chevrons, staggered entrance animations. Follows the same pattern as the existing `AboutFaq` component.

2. **Service answer capsules** (2 modified files):
   - `lib/services-data.ts` — Added `AnswerCapsule` interface and `answerCapsules` array to `ServiceCategory`. 24 Q&As across 6 categories (4 each). Content derived from kernel ICP pain points, JTBD clusters, and service offerings.
   - `app/services/[slug]/page.tsx` — Wired in `AnswerCapsulesSection` between service details and RelatedServices. Added FAQPage JSON-LD schema via `getServiceFaqSchema()`.

3. **Industry answer capsules** (2 modified files):
   - `lib/industries-data.ts` — Added `answerCapsules` to `Industry` interface (imports `AnswerCapsule` from services-data). 36 Q&As across 9 verticals (4 each). Content tailored to each industry's specific buyer psychology, compliance constraints, and competitive dynamics.
   - `app/industries/[slug]/page.tsx` — Wired in `AnswerCapsulesSection` with industry-specific heading and buyer-title-personalized subheading. Added FAQPage JSON-LD schema.

4. **Pricing answer capsules** (2 new/modified files):
   - `lib/schema/pricing-faq.ts` — 5 Q&As addressing engagement models, pricing rationale, ROI measurement, and how AI reduces agency costs.
   - `app/pricing/page.tsx` — Wired in `AnswerCapsulesSection` between PricingCards and ServiceCTA. Added FAQPage JSON-LD schema bundled with existing breadcrumb schema.

5. **Schema infrastructure** (1 modified file):
   - `lib/schema/service-faq.ts` — Added `getFaqSchema` alias for non-service pages. Same function, cleaner import semantics.

**Commits this session:**
- `ed4e201` — feat: Add 71 answer capsules across services, industries, and pricing pages
- `0fd6502` — docs: Session XXII roadmap update — answer capsules sitewide

**Results:**
- 71 answer capsules across 16 pages (6 service + 9 industry + 1 pricing)
- FAQPage JSON-LD schema on all 16 pages for search engine and AI visibility
- Every answer's first sentence is a standalone quotable capsule optimized for AI citation
- Build passes: 118 static pages, no new routes

**Key decisions (do not re-debate):**
- Generic AnswerCapsulesSection component instead of per-section copies — same pattern everywhere
- First sentence of every answer is a standalone quotable capsule (20-25 words) — AEO pattern for AI citation
- AnswerCapsule interface defined once in services-data.ts, re-exported from industries-data.ts
- About page retains its own AboutFaq component (different layout, pre-existing)
- Industry subheadings personalized per buyerTitle ("Straight answers for CISO / VP Securitys...")


- **Active systems:** Vercel deployment (tsc-primary-website.vercel.app), GitHub (bretstarr2024/TSC-PRIMARY-WEBSITE), MongoDB Atlas (`tsc` database with 10 collections, ~80 documents)
- **Next actions:** Build Contact page with form, pipeline infrastructure from AEO, answer capsules for service pages
- **Roadmap:** See `docs/roadmap.md` Session XXI

### Session XXI Summary (February 24, 2026)

**Focus:** Replace services hub "Explore" buttons with direct-to-book CTAs passing service context to Cal.com.

**What was done:**

1. **ServiceCategoryStrip CTA overhaul** (1 modified file):
   - `components/services/ServiceCategoryStrip.tsx` — All 6 "Explore {name} →" ghost buttons replaced with "Let's Talk about {name}" tangerine primary CTAs. Links changed from `/services/{slug}` to `/book?service={name}`. Service sub-pages (`/services/[slug]`) still exist for SEO and direct navigation.

2. **Book page service context** (1 modified file):
   - `app/book/page.tsx` — Added `useSearchParams()` to read optional `?service=` query param. When present: displays "You're interested in / {service}" context line above the calendar with animated fade-in, and prefills Cal.com notes field with `Interested in: {service}` so the sales team sees the prospect's interest before the call. Component split into `BookPageContent` + `BookPage` wrapper with `<Suspense>` boundary for Next.js 14 static build compatibility. Page works identically without the param (existing /book links unaffected).

**Commits this session:**
- `0dffec2` — feat: Replace Explore buttons with direct-to-book CTAs passing service context
- `6e654b1` — docs: Session XXI roadmap update — services CTA direct-to-book

**Results:**
- Services hub conversion path shortened: /services → /book (was /services → /services/[slug] → scroll → /book)
- Cal.com now receives service interest context automatically
- Build passes: 118 static pages, no new routes

**Key decisions (do not re-debate):**
- Service hub CTAs bypass sub-pages and go straight to /book — the sub-pages are a middleman for high-intent prospects
- Service name (not slug) passed as query param — human-readable on the book page and in Cal.com notes
- Buttons upgraded from ghost (secondary) to tangerine (primary) — these are now the primary conversion action on the hub

- **Active systems:** Vercel deployment (tsc-primary-website.vercel.app), GitHub (bretstarr2024/TSC-PRIMARY-WEBSITE), MongoDB Atlas (`tsc` database with 10 collections, ~80 documents)
- **Next actions:** Build Contact page with form, pipeline infrastructure from AEO, answer capsules for service pages
- **Roadmap:** See `docs/roadmap.md` Session XX

### Session XX Summary (February 24, 2026)

**Focus:** Build complete Pricing page with 6-section agency model narrative. Fix hero ship animation visibility.

**What was done:**

1. **Hero ship animation fix** (1 modified file):
   - `components/home/HeroSection.tsx` — Rotation increased from ±4°/±3.5° (imperceptible) to ±15°/±12° (clearly visible snap turns). Drift increased from -1/-2px to -3/-5px during burns. Thruster flame enlarged ~4x: outer flame from 7px to 30px tall, inner flame from 5px to 20px. Flames relocated from dead space to ship rear engine notch (y=14). ViewBox expanded from `0 0 36 50` to `-4 -24 44 74`, SVG dimensions from 36x50 to 44x80. Gradient coordinates, transform-origins, and exhaust spark radii/distances all scaled to match.

2. **Pricing page — 5 new components + page** (9 new/modified files):
   - `components/pricing/PricingHero.tsx` — "We don't sell hours. We sell growth." Word-by-word 3D animated headline with gradient text, dual background glows (tangerine + sprinkles), scroll indicator.
   - `components/pricing/ModelOverview.tsx` — "We change the unit economics of your business." Side-by-side contrast panels (conventional agency in greige vs TSC in tangerine). Below: 4 outcome metric cards (Pipeline, CAC, Time-to-Revenue, Efficiency) each in a brand color.
   - `components/pricing/FourPillars.tsx` — 2x2 glass card grid: 01 Senior Talent Only (tangerine), 02 Proprietary AI Infrastructure (neon cactus), 03 AI Solutions Built Into Your World (tidal wave), 04 Continuity Compounds Results (sprinkles). Each with large watermark number, colored left border, hook line + description.
   - `components/pricing/WhyDifferent.tsx` — Visual pyramid: two limitation cards (Senior Talent Alone / AI Alone with ✕ markers, muted) feeding into full-width "Combination" card with tangerine border glow and ✓ marker.
   - `components/pricing/PricingCards.tsx` — Two glass pricing cards: Subscription ($15K/mo, "Most Popular" badge, tangerine CTA) and Project ($30K minimum, "Defined Scope" badge, tidal checkmarks). Both link to /book.
   - `app/pricing/page.tsx` — Page with metadata, keywords, OpenGraph, BreadcrumbList JSON-LD. Reuses ServiceCTA for final CTA.

3. **Navigation updates** (2 modified files):
   - `components/Header.tsx` — Added `{ href: '/pricing', label: 'Pricing' }` to navLinks (after About).
   - `components/Footer.tsx` — Added Pricing to companyLinks (between Insights and Careers).

4. **Schema** (1 modified file):
   - `lib/schema/breadcrumbs.ts` — Added `pricingBreadcrumb()` function.

**Commits this session:**
- `d32b32d` — fix: Increase hero ship rotation to ±15° and thruster flame 4x larger
- `a0213e2` — feat: Add Pricing page with 6-section agency model narrative
- `4459558` — docs: Session XX roadmap update — Pricing page + hero ship fix

**Results:**
- 118 static pages (up from 117 — new `/pricing` route)
- Homepage hero ship now has clearly visible rotation and prominent thruster flame
- Complete Pricing page tells the agency model story as a narrative arc

**Donor files referenced:**
- None — all components built from existing TSC site patterns (AboutHero, ApproachSection, OriginStory patterns)

**What NOT to re-debate:**
- Pricing page is a narrative (6 sections), not just a pricing table — the model needs explaining before showing prices
- Subscription card is visually emphasized (tangerine accent, "Most Popular" badge) — it's the preferred model
- Pricing copy is original (distilled from the agency model brief, not copied verbatim)
- Subscription: from $15K/month. Project: from $30K. These are the numbers from the brief.
- Hero ship rotation at ±15° — user confirmed the previous ±4° was imperceptible

---

### Session XIX Summary (February 24, 2026)

**Focus:** Add game-authentic thruster flame, exhaust sparks, and game-like micro-turn animations to the homepage hero ship SVG.

**What was done:**

1. **Thruster flame** (1 modified file):
   - `components/home/HeroSection.tsx` — Two-layer SVG flame added inside the ship SVG. Outer flame (`polygon points="13,8 18,1 23,8"`) uses `linearGradient` from tangerine → orange → gold. Inner flame (`polygon points="15.5,9 18,4 20.5,9"`) uses white → gold → tangerine for a hotter core. Both flicker via rapid `scaleY` oscillations (0.35s and 0.2s cycles). Flame group opacity animated with `times` keyframes to fire in two intermittent bursts per 8s cycle.

2. **Game-like micro-turns** (same file):
   - Replaced old smooth sinusoidal rocking (±2°, 4s) with coordinated keyframe sequences: ship snaps -4° left, holds, drifts back to center, then snaps +3.5° right, holds, drifts back. Uses 10-keyframe `times` array for precise timing. Thruster bursts synced to fire during each turn.

3. **Exhaust sparks** (same file):
   - 3 tiny `motion.circle` particles (gold #FFD700, orange #FF8C00, tangerine #FF5910) drift upward from the flame area with staggered independent timings. Each fades from ~0.8 opacity to 0 while drifting in cy/cx.

4. **Ship drift** (same file):
   - Subtle -1 to -2px upward nudge during each thruster burn, returning to 0 between burns.

**Commits this session:**
- `79a57fa` — feat: Add thruster flame, exhaust sparks, and game-like micro-turns to hero ship

**Results:**
- 117 static pages (unchanged — animation-only change)
- Homepage hero ship now has active, game-authentic thruster behavior
- Thruster and rotation are coordinated to tell a "ship is maneuvering" story

**Donor files referenced:**
- None — built from scratch using Framer Motion keyframe animation on SVG elements

**What NOT to re-debate:**
- Thruster bursts are synced to rotation (not independent) — looks intentional, not random
- 8s cycle with two burn/turn sequences — long enough to feel organic
- Exhaust spark timings are intentionally imperfect — organic randomness by design
- SVG gradient IDs `flameOuter`/`flameInner` — avoid collisions if adding gradients elsewhere

---

### Session XVIII Summary (February 24, 2026)

**Focus:** Match homepage hero ship SVG to exact Asteroids game shape + subtle animation.

**What was done:**

1. **Ship SVG replaced** (1 modified file):
   - `components/home/HeroSection.tsx` — Old 6-point diamond/arrow path (`M20 40 L8 12 L16 18 L20 4 L24 18 L32 12 Z`) replaced with the exact 4-point Asteroids game ship geometry rotated to point downward (`M18 46 L32 6 L18 14 L4 6 Z`). The SVG path now matches the canvas `drawShip` proportions in `AsteroidsGame.tsx` — nose, two wings, rear notch.

2. **Subtle ambient animation** (same file):
   - Float increased from ±4px to ±6px vertical bob
   - Added ±2° gentle rotation oscillation
   - Slowed cycle from 3s to 4s for a relaxed breathing feel
   - Added always-on soft orange glow (0.3 opacity drop-shadow) that brightens on hover (0.8 opacity)

**Commits this session:**
- `11391ea` — fix: Match homepage hero ship SVG to exact Asteroids game shape
- `49aa64b` — docs: Update roadmap for Session XVIII — homepage ship SVG fix

**Results:**
- 117 static pages (unchanged — cosmetic fix only)
- Homepage hero ship now visually matches the in-game Asteroids ship
- Subtle animation draws attention to the easter egg trigger without being distracting

**Donor files referenced:**
- None — adapted existing code based on `AsteroidsGame.tsx` canvas ship geometry

**What NOT to re-debate:**
- Ship SVG path `M18 46 L32 6 L18 14 L4 6 Z` — exact match to game ship proportions
- Animation is intentionally subtle — ±2° rotation, ±6px float, 4s cycle
- Ambient glow at 0.3 opacity — visible but not distracting

---

### Session XVII Summary (February 24, 2026)

**Focus:** Build complete Industries section with 9 vertical-specific landing pages.

**What was done:**

1. **Industries data layer** (1 new file):
   - `lib/industries-data.ts` — `Industry` interface with name, slug, color, tagline, description, marketContext, painPoints (6 each), howWeHelp (6 each), relevantServiceSlugs, notableClients, buyerTitle, stat. 9 industries: HR Tech, Enterprise SaaS, FinTech, Cybersecurity, HealthTech, MarTech, DevTools, Cloud Infrastructure, AI/ML Platforms. Helper functions `getIndustryBySlug` and `getRelatedIndustries`.

2. **Industries pillar page** (1 modified file):
   - `app/industries/page.tsx` — Replaced "Coming soon" stub with IndustriesHero + 3×3 IndustryCard grid + ServiceCTA. Full metadata with all 9 verticals listed.

3. **Industry sub-pages** (1 new file):
   - `app/industries/[slug]/page.tsx` — SSG with `generateStaticParams` for all 9 slugs. BreadcrumbList JSON-LD schema. IndustryHero + IndustryContent + RelatedIndustries layout.

4. **5 new components** (5 new files):
   - `components/industries/IndustriesHero.tsx` — Animated hero with dual-glow background (Sprinkles + Tidal Wave), gradient text headline, vertical label, stat line.
   - `components/industries/IndustryCard.tsx` — Glass card for grid: color dot, stat callout, tagline, description preview, notable client badges (pill-style), staggered entrance animations.
   - `components/industries/IndustryHero.tsx` — Sub-page hero matching ServiceSubpageHero pattern: color glow, "← All Industries" breadcrumb, stat + buyer title display.
   - `components/industries/IndustryContent.tsx` — Full detail sections: glass market context box, side-by-side pain points (numbered circles) vs. how-we-help (checkmarks), notable clients display, relevant services grid (links to service categories), industry-colored CTA with "Ready to own [Industry]?" headline.
   - `components/industries/RelatedIndustries.tsx` — 3-column cross-linking grid matching RelatedServices pattern.

5. **Breadcrumb schemas** (1 modified file):
   - `lib/schema/breadcrumbs.ts` — Added `industriesBreadcrumb()` and `industryBreadcrumb(name)` functions for AEO structured data.

**Commits this session:**
- `2ab9637` — feat: Build Industries section — 9 vertical landing pages
- `eb36857` — docs: Update roadmap for Session XVII — Industries section

**Results:**
- 117 static pages (up from 108 — 9 new industry sub-pages)
- Industries pillar page replaces "Coming soon" stub with full 3×3 card grid
- Each industry sub-page has: hero, market context, 6 pain points, 6 solutions, notable clients, 4 relevant service links, 3 related industries, CTA
- BreadcrumbList JSON-LD on all industry sub-pages
- All content seeded from About FAQ answer + GTM kernel ICP data

**Donor files referenced:**
- None — all components are new, following established patterns from `components/services/` (ServiceSubpageHero, RelatedServices, ServiceCTA reused)

**Key decisions:**
- 9 industries (not 8) — added MarTech from FAQ answer even though it's not in the kernel's 8 primary verticals, because TSC has deep expertise marketing to marketers
- Industries follow the Services pattern (pillar page → sub-pages) with simplified data model (no nested sub-items like services have)
- Notable clients pulled from the 52-client marquee list where applicable — some verticals (MarTech, DevTools, Cloud Infra) have no named clients yet
- Reused ServiceCTA on pillar page rather than creating a duplicate
- Each industry card shows one stat for immediate credibility signaling

**What NOT to re-debate:**
- 9 verticals are final: HR Tech, Enterprise SaaS, FinTech, Cybersecurity, HealthTech, MarTech, DevTools, Cloud Infrastructure, AI/ML Platforms
- Industries data is static (in-code), not MongoDB — appropriate for curated vertical positioning pages
- Pain points and solutions are specific to each vertical, not generic — they reflect genuine GTM challenges per the kernel ICP data
- Color assignments: some brand colors repeat across 9 industries (6 colors, 9 verticals) — non-adjacent in grid to avoid visual confusion

---

### Session XVI Summary (February 24, 2026)

**Focus:** Replace client marquee pill badges with CSS car shapes as a Frogger game teaser.

**What was done:**

1. **CarBadge component** (1 modified file):
   - `components/about/ClientMarquee.tsx` — New `CarBadge` component replaces the plain `<span>` pill badges. Each client name now sits inside a miniature CSS car that matches the Frogger `drawCar` canvas rendering: boxy body (border-radius 6px, not rounded-full), colored hood/bumper at the front end, tinted windshield behind the hood, yellow headlights (front), red taillights (rear), dark semicircle wheels at bottom edges. Direction-aware — headlights face the direction of travel. Row 1 (left-moving) uses tangerine, row 2 (right-moving) uses tidal, matching the first two Frogger lane colors. Added `LANE_COLORS` config object with border/fill/hood opacity variants per color.

**Commits this session:**
- `61ffb71` — feat: Client marquee car badges — Frogger teaser
- `d83a229` — docs: Update roadmap for Session XVI — marquee car teaser

**Results:**
- 108 static pages (unchanged — no new routes)
- Client marquee now visually teases the Frogger game with car-shaped badges
- Two opposing rows create a "two lanes of traffic" feel
- All changes contained in 1 component file + docs

**Donor files referenced:**
- None — CSS adaptation of the existing canvas `drawCar` function in `FroggerGame.tsx`

**Key decisions:**
- CSS implementation over canvas — the marquee is DOM-based with Framer Motion, so CSS cars are the natural fit (no canvas needed for static display)
- Tangerine/tidal lane colors — matches Frogger lanes 1 and 2, creates visual continuity
- Direction-aware headlights — left-moving row faces left, right-moving faces right

**What NOT to re-debate:**
- Cars over pills in the marquee — user explicitly requested this as a Frogger teaser
- Lane color assignment (tangerine row 1, tidal row 2) — matches Frogger lane order

---

### Session XV Summary (February 24, 2026)

**Focus:** Three Frogger easter egg UX improvements: discoverable trigger, fix overlapping obstacles, turn pills into cars.

**What was done:**

1. **Ocho trigger moved below client list** (1 modified file):
   - `components/about/ClientMarquee.tsx` — Moved the Ocho play trigger from absolute-positioned bottom-right corner (barely visible) to a centered flex column below the marquee rows. Slightly larger (w-12), more visible (opacity-50 base), with "Start" text in small caps beneath the bobbing mascot. Lights up in Sprinkles pink on hover.

2. **Overlap fix** (1 modified file):
   - `components/about/FroggerGame.tsx` — Wrapping logic previously placed pills at random positions off-screen, causing multiple pills wrapping in the same frame to overlap. New logic finds the leftmost (dir=1) or rightmost (dir=-1) pill in the lane and places the wrapping pill behind it with guaranteed `pillH * 3` minimum gap plus random variance. Client names are always readable.

3. **Cars instead of pills** (same file):
   - `components/about/FroggerGame.tsx` — New `drawCar` function renders side-view cars: rounded body with boxy corners (r=6 vs full pill radius), colored hood/bumper section at the front (direction-aware), tinted windshield behind hood, body outline in lane color, semicircle wheels at bottom with darker rubber and lighter rims, yellow headlights (2 dots at front), red taillights (2 dots at rear). Client names displayed in bold centered on the car body. Cars are wider (`pillH * 2` padding) to accommodate hood/windshield sections. `measurePill` uses matching bold font for accurate width calculation. Added `hexToRgba` utility for color alpha blending.

**Commits this session:**
- `478ce1c` — feat: Frogger UX — car obstacles, discoverable trigger, overlap fix
- `fb1a20c` — docs: Update roadmap for Session XV — Frogger UX improvements

**Results:**
- 108 static pages (unchanged — no new routes)
- Frogger obstacles look like actual cars — headlights, taillights, wheels, windshield
- Game trigger is visibly centered below client list with "Start" label
- No more overlapping/blurred client names
- All changes contained in 2 component files + docs

**Donor files referenced:**
- None — all modifications to existing code

**Key decisions:**
- Side-view cars over top-down — more recognizable at small canvas scale (~33px tall)
- Hood/bumper drawn via clip path to body shape — clean edges without complex geometry
- Spacing-aware wrapping — each wrapping car is placed behind the farthest-back car in the lane
- Bold font for car names — matches original Frogger's punchy label feel

**What NOT to re-debate:**
- Cars over pills — user explicitly said pills "kinda suck" because names blur together
- Ocho below marquee — user explicitly said "move the ocho logo to below the client list with the word 'start'"
- drawCar uses ctx.save/clip/restore — standard pattern for masked fills, well-optimized

---

### Session XIV Summary (February 24, 2026)

**Focus:** Fix three critical bugs that made the client Frogger easter egg completely non-functional.

**What was done:**

1. **Player position fix — root cause** (1 modified file):
   - `components/about/FroggerGame.tsx` — `getPlayerY` formula had an extra `- laneH` term: `h - laneH * (playerLane + 1) - laneH + laneH * 0.5`. This placed the player one full lane above their actual position. The collision hitbox (centered on the player's computed Y) never overlapped with the pill hitboxes in the player's current lane, so collisions never fired. The player walked through all traffic unharmed and scoring felt meaningless. Fixed to `h - laneH * (playerLane + 0.5)`.

2. **Keyboard DPR fix** (same file):
   - `handleKeyDown` used raw `canvas.width` (which includes `devicePixelRatio` scaling) for horizontal movement bounds. On Retina (DPR=2), the max X was 2× the logical width — the player could move completely off-screen to the right. Now divides `canvas.width` by DPR.

3. **Touch DPR fix** (same file):
   - Touch handler computed button hit-test positions using DPR-scaled canvas dimensions, but `drawTouchControls` rendered the visual buttons in logical (CSS) coordinates. Touch targets didn't align with their visual positions on Retina. Now uses logical coordinates for both hit-testing and rendering.

**Commits this session:**
- `d40afba` — fix: Frogger game — collision detection, scoring, and input DPR bugs
- `01e5a32` — docs: Update roadmap for Session XIV — Frogger critical bug fixes

**Results:**
- 108 static pages (unchanged — no new routes)
- Frogger game now actually works: collisions fire, lives decrement, game over triggers, scoring rewards reaching the safe zone, input stays within screen bounds
- All changes contained in 1 component file + docs

**Donor files referenced:**
- None — all modifications to existing code

**Key decisions:**
- Simplified `getPlayerY` to `h - laneH * (playerLane + 0.5)` — works for all 7 positions (bottom safe, 5 traffic lanes, top safe) without special cases
- All input handlers use logical (DPR-divided) coordinates — same coordinate space as rendering

**What NOT to re-debate:**
- The `getPlayerY` formula fix — the old formula was mathematically wrong (off by one laneH), not a tuning choice
- DPR handling in input — canvas dimensions include DPR, game logic uses logical pixels, input must use logical pixels
- This was purely a bug fix session — no gameplay tuning, no new features

---

### Session XIII Summary (February 24, 2026)

**Focus:** Fix four critical UX issues with the client Frogger easter egg per user feedback.

**What was done:**

1. **Canvas DPI scaling** (1 modified file):
   - `components/about/FroggerGame.tsx` — Added `devicePixelRatio` scaling. Canvas now renders at native Retina resolution (2x/3x) with CSS sizing set separately. All game logic uses logical (CSS) pixels via `canvas.width / dpr`. Fixes severe blur on high-DPI displays.

2. **Speed reduction** (same file):
   - Base speed: 1.2 → 0.35. Random variance: 0.8 → 0.25. Per-lane increment: 0.15 → 0.08. Level-up multiplier: 0.15 → 0.08. Lane speed bump per crossing: 0.2 → 0.06. ~70% slower at start, gradual progression.

3. **Pill spacing** (same file):
   - Gap between client name pills tripled: `pillH × 1.8 + random × 1.2` → `pillH × 4.5 + random × 3`. Clear navigable lanes between obstacles.

4. **Start screen** (same file):
   - Game opens with "CLIENT FROGGER" title screen: Ocho icon with pink glow, game title in Atomic Tangerine, two lines of instructions ("Navigate Ocho through the client traffic" / "Arrow keys or WASD to move"), pulsing "Press any key or tap to start" CTA in Neon Cactus, "ESC to exit" hint. Pills drift slowly in background at half speed for visual interest. Any key or tap starts gameplay. Player/HUD hidden until started.

**Commits this session:**
- `9ee2cd4` — fix: Frogger game — DPI scaling, speed reduction, pill spacing, start screen

**Results:**
- 108 static pages (unchanged — no new routes)
- Frogger game now crisp on Retina, playable speed, proper spacing, clear onboarding
- All changes contained in 1 component file + docs

**Donor files referenced:**
- None — all modifications to existing code

**Key decisions:**
- devicePixelRatio scaling is the standard canvas fix for Retina blur
- Speed tuned to be relaxed at start, challenging by level 5+
- Start screen follows same pattern as Asteroids (title + instructions before gameplay)

**What NOT to re-debate:**
- Speed values (0.35 base) — tuned per user feedback that original was "way too fast"
- Pill gap tripling — original had "not enough room between client names"
- Start screen is mandatory — game was "not clear how to start"
- DPI scaling is non-negotiable — canvas was "blurry as fuck"

---

### Session XII Summary (February 24, 2026)

**Focus:** About page UX — leadership bio modal, client Frogger easter egg, tequila stat update.

**What was done:**

1. **Leadership bio modal** (1 modified file):
   - `components/about/LeadershipSection.tsx` — Replaced in-card bio expansion (which stretched grid cells and was unreadable) with a cinematic centered modal overlay. Features: `bg-black/70 backdrop-blur-md` backdrop, spring-animated entrance (`scale: 0.9→1`), 80px scaled-up generative avatar, gradient accent bar using leader's brand color pair, name/title/LinkedIn with color-matched accent, gradient divider, bio text at readable `text-base leading-relaxed`, prev/next navigation buttons to browse between leaders, keyboard support (ESC close, left/right arrow navigate), body scroll lock when open. Grid cards stay pristine — no layout disruption. `GenerativeAvatar` component updated with optional `size` prop (default 56px, modal uses 80px).

2. **Client Frogger easter egg** (1 new file, 1 modified file):
   - `components/about/FroggerGame.tsx` — NEW: Canvas-based Frogger game. 5 horizontal lanes of scrolling client name pills as traffic obstacles. Ocho mascot as the player character (loaded from `/images/ocho-color.png` with pink glow). Navigate from bottom START zone through traffic to top SAFE ZONE. Each successful crossing scores `10 × level` and increases lane speeds. 3 lives — collision triggers screen shake, respawn with 60-frame invulnerability blink. Lane colors use brand palette (Tangerine, Tidal, Sprinkles, Cactus). HUD shows score, level, lives. Game over screen with score summary. Controls: arrow keys/WASD + mobile touch D-pad (auto-appears on first touch). ESC exits, Enter restarts.
   - `components/about/ClientMarquee.tsx` — Added Ocho mascot as play trigger at bottom-right of section (subtle bob animation, `drop-shadow(0 0 8px #ED0AD2)`, 40%→100% opacity on hover). Click launches FroggerGame via `next/dynamic` lazy loading. Game replaces marquee rows in a rounded container. Normal marquee restored on close.

3. **Tequila stat update** (1 modified file):
   - `components/about/OriginStory.tsx` — Changed "1,000+ Shots of tequila" to "100,000 Shots of tequila".

**Commits this session:**
- `c54e6bf` — feat: Leadership bio modal, client Frogger easter egg, tequila stat update

**Results:**
- 108 static pages (unchanged — no new routes)
- Leadership section now has a proper modal UX instead of broken card expansion
- Client section has a hidden Frogger game (2nd easter egg after Asteroids)
- All changes contained in 4 component files + docs

**Donor files referenced:**
- None — all new code (canvas game, modal overlay)

**Key decisions:**
- Modal overlay over in-card expansion — the card expansion was "shit" (user's words), modal provides readable bios without wrecking grid
- Frogger triggered by Ocho mascot — subtle discovery mechanic matching the Asteroids ship trigger pattern
- Canvas-based game (not DOM) — consistent with Asteroids implementation, performant for animated game loop
- Lazy-loaded via next/dynamic — zero bundle cost until played
- Touch D-pad auto-appears on first touch — no unnecessary UI on desktop

**What NOT to re-debate:**
- Modal over in-card expansion — user explicitly said card expansion "looks like shit"
- Frogger concept — user saw the Frogger parallel in the scrolling pills and requested it
- 100,000 shots of tequila — user's exact number
- Ocho as Frogger player — consistent with Ocho as UFO in Asteroids

---

### Session XI Summary (February 24, 2026)

**Focus:** About page content polish and generative animated leadership avatars.

**What was done:**

1. **Generative orbital avatars** (1 modified file):
   - `components/about/LeadershipSection.tsx` — Replaced gradient-circle initials with `GenerativeAvatar` component. Each leader gets a unique animated SVG: two counter-rotating elliptical orbits with orbital dots, a pulsing center core with white highlight, an ambient spark with fade cycle, and a radial glow — all in brand color pairs. Parameters (ring sizes, speeds, starting angles, dot positions) are seeded deterministically from a name hash via a simple PRNG, so the same person always gets the same avatar. Pure SVG animation (`animateTransform` + `animate` elements) — no JS animation loop, GPU-friendly. Removed `initials` field from Leader interface and all 10 leader data objects. Removed `gradients` array.

2. **Origin story stat update** (1 modified file):
   - `components/about/OriginStory.tsx` — Changed "100+ Brands repositioned" to "1,000+ Shots of tequila" (irreverent brand personality). Changed "45 ratings on Amazon" to "451 ratings on Amazon".

3. **CredibilitySection stat update** (1 modified file, pre-existing uncommitted change):
   - `components/home/CredibilitySection.tsx` — Changed "$150M+ In client revenue generated" to "$500M+ Defining moments" and "1,000+" to "3,000+ B2B tech companies served".

**Commits this session:**
- `dc3028c` — feat: About page polish — generative avatars, stats updates
- `fec99e9` — docs: Update roadmap for Session XI — about page polish, generative avatars

**Results:**
- 108 static pages (unchanged — no new routes)
- Leadership section now has animated generative avatars instead of static initials
- About page stats updated per user direction
- All changes contained in 3 component files + docs

**Donor files referenced:**
- None — all new code (SVG animation, PRNG seeding)

**Key decisions:**
- Generative SVG avatars via name-seeded PRNG — deterministic, unique per person, zero external dependencies
- Pure SVG animation (animateTransform/animate) over Framer Motion or canvas — lightest weight for 10 simultaneous avatars
- Brand color pairs palette (10 pairs) — each leader gets a distinct combination
- "Shots of tequila" stat — user explicitly requested this irreverent replacement
- Removed initials field entirely — dead code after avatar replacement

**What NOT to re-debate:**
- Generative avatars over gradient initials — user explicitly requested "ai-native and cool" animated replacement
- "1,000+ Shots of tequila" — user's exact wording
- "451 ratings" — user specified the number
- Initials field removed — no longer rendered, dead code cleaned up

---

### Session X Summary (February 24, 2026)

**Focus:** Three enhancements to the hidden Asteroids easter egg: sound effects, mobile touch controls, and bullet physics fix.

**What was done:**

1. **Web Audio API sound engine** (new class in existing file):
   - `components/home/AsteroidsGame.tsx` — `SFX` class generates all sounds programmatically via oscillators and noise buffers. No external audio files. Discrete sounds: shoot (square wave 880→220Hz), rock explosion (filtered white noise, size-dependent duration/volume), ship explosion (deep LP filtered noise, 0.6s), UFO shoot (sawtooth 600→200Hz), UFO explosion (mid-frequency noise burst), level up (ascending 4-note arpeggio A4→A5), game over (descending 4-note A4→A3). Continuous sounds: thrust (looping LP white noise, starts/stops with key/button), UFO hum (dual detuned square oscillators 120/126Hz, creates warble effect). Mute toggle via M key on keyboard or ♪ touch button.

2. **Mobile touch controls** (new touch handling in existing file):
   - `components/home/AsteroidsGame.tsx` — Virtual buttons rendered on canvas with semi-transparent glass styling. Gameplay: 4 buttons (◀ rotate left, ▶ rotate right, ▲ thrust, ● fire) at bottom of screen. Game over initials entry: 5 buttons (◀ ▶ ▲ ▼ ✓) for cursor movement, letter cycling, and confirm. Game over restart: single ▶ button. Always visible on touch: ✕ close (top-left), ♪ mute (top-right). Multi-touch supported (thrust + fire + rotate simultaneously). Auto-appear on first touch event (hidden on desktop). `touch-action: none` on container and canvas prevents browser scroll/zoom.

3. **Bullets stop at screen edge** (behavior change in existing file):
   - `components/home/AsteroidsGame.tsx` — Player bullets and UFO bullets no longer call `wrap()`. Instead, they travel in a straight line and are removed when they exit the screen bounds (with 4px grace margin so they visually leave before removal). Ship and asteroids still wrap as before. The `bulletLife` field is retained as a safety cap but bullets die from bounds checking first.

**Commits this session:**
- `4e37e3b` — feat: Asteroids — sound effects, mobile touch controls, bullets stop at screen edge
- `a518464` — docs: Update roadmap for Session X — sound, touch controls, bullet fix

**Results:**
- 108 static pages (unchanged — no new routes)
- All changes contained in a single file (`AsteroidsGame.tsx`, +453/-27 lines)
- No MongoDB, API, or build pipeline changes
- Asteroids game now has: sound, touch controls, non-wrapping bullets, UFO enemy, high scores

**Donor files referenced:**
- None — all new code (Web Audio API, canvas touch rendering)

**Key decisions:**
- Web Audio API synth sounds, no audio files — retro aesthetic, zero asset management
- Continuous audio nodes for thrust and UFO hum — discrete bursts sounded stuttery
- Touch controls auto-appear on first touch event — no unnecessary UI on desktop
- Mute via M key and touch button — sound can be disruptive
- During initials entry, M key types the letter M (not mute) — context-aware

**What NOT to re-debate:**
- Web Audio API over audio files — programmatic generation is cleaner and more retro
- Bullets do NOT wrap — user explicitly requested this behavior change
- Touch controls hidden on desktop — they auto-appear on first touch, no feature detection needed
- Mute default is unmuted — sound effects are a feature, user can mute if desired
- Ship and asteroids still wrap — only bullets were changed per user request

---

### Session IX Summary (February 24, 2026)

**Focus:** Five gameplay enhancements to the hidden Asteroids easter egg per user feedback.

**What was done:**

1. **Full-screen bullets** (tuning change in existing file):
   - `components/home/AsteroidsGame.tsx` — Bullet life computed dynamically from screen diagonal (`Math.hypot(w,h) * 0.8 / BULLET_V`). On 1080p: ~220 frames / ~1760px travel. On 4K: ~440 frames / ~3520px. Previously was constant 50 frames / 400px ("a few inches").

2. **Ocho UFO enemy** (new game mechanic):
   - `components/home/AsteroidsGame.tsx` — Ocho pixel-art mascot (`/images/ocho-color.png`) spawns every 10-20 seconds, enters from random edge, floats across with sinusoidal vertical bobbing, fires pink (Sprinkles #ED0AD2) bullets at the player. Accuracy increases with level (±31° at level 1, ±6° by level 10). Worth 300 points. Rendered with pink canvas shadow glow. Fallback ellipse if image hasn't loaded. Player can destroy it with bullets or die by touching it.

3. **High score table with 3-initial entry** (new feature):
   - `components/home/AsteroidsGame.tsx` — Top 10 scores stored in localStorage (`tsc-asteroids-scores`). On game over, qualifying scores trigger the classic arcade initial entry screen: arrow up/down cycles letters, left/right moves cursor, or type letters directly on keyboard. Enter confirms. Player's entry highlighted in Neon Cactus on the leaderboard. Non-qualifying scores see the existing leaderboard + restart prompt.

4. **Game over shake fix** (bug fix):
   - `components/home/AsteroidsGame.tsx` — The shake decay (`g.shake *= 0.9; if (g.shake < 0.5) g.shake = 0`) was inside the `if (!g.over)` block, meaning it NEVER ran after game over. The shake value froze at 15 and the entire game over screen shook violently forever. Fix: moved decay outside the block. Uses faster decay rate (0.8) when game is over, settles in ~0.25 seconds.

5. **Game over input delay** (UX improvement):
   - `components/home/AsteroidsGame.tsx` — 40-frame (~0.67 second) delay before the game over screen accepts any input. Prevents the player from accidentally pressing Enter (which they might be mashing during gameplay) and either submitting "AAA" as their initials or skipping the high score screen entirely.

**Commits this session:**
- `ba9c9da` — feat: Enhance Asteroids game — full-screen bullets, Ocho UFO, high scores, shake fix

**Results:**
- 108 static pages (unchanged — no new routes)
- Asteroids game now has 5 major improvements
- All changes contained in a single file (`AsteroidsGame.tsx`, +338/-23 lines)
- No MongoDB, API, or build pipeline changes

**Donor files referenced:**
- None — all new game code

**Key decisions:**
- High scores in localStorage (not MongoDB) — appropriate for an easter egg game
- Ocho mascot as UFO — uses existing `/images/ocho-color.png` asset
- UFO accuracy scales with level — adds progressive difficulty
- 40-frame input delay on game over — prevents accidental skip

**What NOT to re-debate:**
- High scores in localStorage — server-side persistence is overkill for an easter egg
- Ocho as UFO enemy — user explicitly requested "the ocho logo" as the UFO
- Bullet life is screen-relative — constant values break on different resolutions
- Game over shake fix — the previous behavior was a clear bug (decay inside wrong block)

---
- **Roadmap:** See `docs/roadmap.md` Session VIII

### Session VIII Summary (February 24, 2026)

**Focus:** Hidden Asteroids easter egg game on homepage hero + origin story book section enhancement.

**What was done:**

1. **Asteroids easter egg** (1 new file, 1 modified file):
   - `components/home/AsteroidsGame.tsx` — Full canvas-based Asteroids clone with brand colors (Tangerine ship/bullets, Tidal Wave asteroids, Neon Cactus score, all-brand particle explosions). Classic mechanics: ship rotation/thrust, bullet physics, asteroid splitting (large→medium→small), screen wrapping, level progression, lives, score HUD, game over/restart. Screen shake on death, thrust flame flicker, invulnerability blink.
   - `components/home/HeroSection.tsx` — Replaced "The Starr Conspiracy" pre-headline text with clickable Asteroids ship SVG. Ship floats with subtle bob animation, glows Atomic Tangerine on hover, shows "click me" tooltip. On click, lazy-loads and launches the full-screen game overlay. ESC exits back to homepage.

2. **Origin story enhancement** (1 modified file, pre-existing changes committed):
   - `components/about/OriginStory.tsx` — Stats grid changed from 2-col to 3-col (removed redundant "25+ years"). Book section enhanced with expanded description, Amazon 4.6-star rating, "Get the Book" Amazon link, and "Subscribe to Newsletter" LinkedIn link.

**Commits this session:**
- `506db8d` — fix: Enhance origin story book section with Amazon link and newsletter CTA
- `88993ab` — feat: Add Asteroids easter egg game to homepage hero

**Results:**
- 108 static pages (unchanged — no new routes)
- Asteroids game lazy-loaded via `next/dynamic` — zero bundle cost until clicked
- Homepage hero ship replaces redundant brand name text
- Origin story book section now has actionable CTAs

**Donor files referenced:**
- None — all new code

**Key decisions:**
- "THE STARR CONSPIRACY" pre-headline removed (redundant — brand name in header)
- Game is desktop keyboard-only (arrow/WASD + space) — no touch controls for easter egg
- Game uses brand color palette for on-brand feel even in the easter egg
- No sound effects (can add later)

**What NOT to re-debate:**
- Pre-headline removal — user explicitly said "don't need to say 'THE STARR CONSPIRACY' again"
- Easter egg is intentionally hidden — no navigation or docs should point to it
- Desktop-only controls — appropriate for a hidden game

---

### Session VII Summary (February 24, 2026)

**Focus:** Build complete About page with leadership, clients, FAQ, AEO schemas. Fix headline animations on stub pages.

**What was done:**

1. **Headline animation fix** (2 modified files):
   - `app/work/page.tsx` — Added `AnimatedSection` + `GradientText` wrappers
   - `app/industries/page.tsx` — Same treatment, consistent with Services/Insights

2. **Complete About page** (7 new files, 2 modified files):
   - `components/about/AboutHero.tsx` — Word-by-word 3D animated headline, AEO answer capsule
   - `components/about/OriginStory.tsx` — 1999 founding story, stats grid (3,000+/25+/100+), book callout
   - `components/about/ApproachSection.tsx` — Three kernel values: truth over comfort, fundamentals + innovation, results over activity
   - `components/about/LeadershipSection.tsx` — 10 leaders with gradient initials, expand-on-click bios, LinkedIn links
   - `components/about/ClientMarquee.tsx` — 52 highlighted clients in dual-row infinite scroll marquee
   - `components/about/AboutFaq.tsx` — 6 FAQ items with animated accordion
   - `lib/schema/about-faq.ts` — FAQ data + FAQPage JSON-LD schema generator
   - `lib/schema/breadcrumbs.ts` — Added `aboutBreadcrumb()`
   - `app/about/page.tsx` — Composed page with Organization + FAQPage + BreadcrumbList JSON-LD schemas

3. **Leadership team (10 people, positioned as "Leadership"):**
   - Bret Starr (Founder), Dan McCarron (COO), Racheal Bates (CXO), JJ La Pata (CSO), Nancy Crabb (VP of Brand Experience), Noah Johnson (Director of Digital Strategy), Joanna Castle (Sr. Client Success & Marketing Manager), Evan Addison Payne (Marketing & Brand Strategist), Melissa Casey (Growth Strategist), Skylin Solaris (AI Workflow Engineer)
   - All with LinkedIn URLs, initials avatars (no photos yet)

4. **52 highlighted clients:** ADP, Oracle, SAP, ServiceNow, Thomson Reuters, Bank of America, Equifax, Korn Ferry, Indeed, ZipRecruiter, Coursera, MasterClass, SeatGeek, Lyft, Zendesk, Gusto, SoFi, Fitbit, Headspace, and 33 more

**Commits this session:**
- `a41bdd4` — fix: Add animated headlines to Work and Industries pages
- `fd17b34` — feat: Build complete About page with leadership, clients, FAQ, AEO schemas
- `bf5a240` — docs: Update roadmap for Session VII — About page complete

**Results:**
- 108 static pages (About page replaced stub — same count)
- About page: 9.29 kB static, 155 kB first load JS
- 3 JSON-LD schemas for AEO (Organization, FAQPage, BreadcrumbList)
- All section headlines now animate consistently across the site

**Donor files referenced:**
- None directly copied this session — all components are new, following existing patterns from `components/services/` and `components/AnimatedSection.tsx`

**Key decisions:**
- "Leadership" label (not "Team") — implies larger organization behind the listed leaders
- 52 clients curated for brand recognition from 500+ CRM list
- Stats: "3,000+ B2B tech companies since 1999 (and counting)"
- Bret's bio excludes WorkEasy Software and book publisher name
- FAQ schema in `lib/schema/about-faq.ts` (server module) — client components can't export functions for SSR

**What NOT to re-debate:**
- Leadership section is "Leadership" not "Team" — user explicitly requested this
- 3,000+ client count — user-provided number
- Bret bio exclusions (WorkEasy, publisher) — user directive

**Deferred:**
- AI partnership credentials section — user needs to clarify formal vs. API tier partnerships
- Team headshot photos — gradient initials used as placeholders
- Industries, Work, Contact, Careers page content

---

### Session VI Summary (February 23, 2026)

**Focus:** Pull Racheal's out-of-band edits, add all missing website section stubs + nav updates

**What was done:**

1. **Pulled out-of-band commit** (`8d8894e` by Racheal, Feb 19):
   - Services restructured: Advisory/fractional CMO removed, GTM Strategy added, AI services updated
   - Homepage rework: "Who We Are" section, renamed archetypes, carousel fix
   - Content: FAQ flip cards, 10 real case studies, GTM Strategy Gap Assessment
   - Book page: 6-person team carousel replacing solo Melissa
   - JTBD cleanup, Videos hidden from nav

2. **5 new stub pages** (5 new files):
   - `app/about/page.tsx` — About stub with metadata
   - `app/contact/page.tsx` — Contact stub with metadata
   - `app/work/page.tsx` — Work stub with metadata
   - `app/industries/page.tsx` — Industries stub with metadata
   - `app/careers/page.tsx` — Careers stub with metadata

3. **Navigation updates** (2 modified files):
   - `components/Header.tsx` — Nav: Services, Work, Industries, Insights, About + Let's Talk! CTA
   - `components/Footer.tsx` — Company column: About, Work, Industries, Insights, Careers, Contact

**Commits this session:**
- `1d0ebbe` — feat: Add stub pages for About, Contact, Work, Industries, Careers + nav updates

**Results:**
- 108 static pages (up from 103 — 5 new routes)
- All website sections have routes and are wired into navigation
- Header has 5 nav items + CTA button
- Footer Company column has 6 links

**Key decisions:**
- Careers and Contact are footer-only (not in header nav) — secondary pages
- Work page content is last priority (user directive)
- All stubs use consistent "Coming soon" placeholder — content added later

**What NOT to re-debate:**
- Header nav order: Services, Work, Industries, Insights, About — established
- Careers/Contact footer-only — don't add to header unless user requests
- Work page last — user explicitly said "we'll do that last"

---

### Session V Summary (February 11, 2026)

**Focus:** /book page with Cal.com embed + motion graphics, internal CTA routing

**What was done:**

1. **`/book` page — version 1** (1 new file):
   - `app/book/page.tsx` — Cal.com calendar embedded via iframe (`?embed=true&theme=dark`)
   - 4 concentric brand-color glow rings (same as 404 page, larger sizes 580-820)
   - 6 ambient sparkle accents around the rings
   - Floating Melissa photo (top-right) with glow ring
   - Glass card container for calendar embed, 600px iframe height
   - "Let's Talk!" heading and subtitle

2. **CTA routing overhaul** (6 modified files):
   - All CTAs rewired from external `cal.com/team/tsc/25-50` to internal `/book`
   - `HeroSection.tsx` — `<a>` to `<Link href="/book">`, added `Link` import
   - `CtaSection.tsx` — `MagneticButton href="/book"` (removed `isExternal`)
   - `ServiceCTA.tsx` — same pattern
   - `Header.tsx` — desktop + mobile `<a>` to `<Link href="/book">`
   - `Footer.tsx` — `<a>` to `<Link href="/book">`
   - `CtaStrip.tsx` — default `buttonHref` changed to `/book`

3. **`/book` page — version 2** (enhanced per user feedback):
   - Added Three.js `HeroParticles` (same cursor-reactive stars as homepage) via dynamic import
   - Increased iframe to 1000px height + Cal.com postMessage resize listener
   - Enhanced Melissa: 10-sparkle constellation (was 0), dual glow rings (inner orange pulsing, outer neon-cactus rotating), 4-color layered box-shadow
   - Removed "Let's Talk!" heading and subtitle (redundant — user is already booking)
   - Widened container to max-w-4xl (was max-w-3xl)
   - Removed overflow-hidden from calendar container

**Commits this session:**
- `8a7c712` — feat: /book page with motion graphics + all CTAs route internally
- `3222aa1` — feat: /book page — star particles, taller calendar, enhanced Melissa sparkles

**Results:**
- 103 static pages (up from 102 — new `/book` route)
- All CTAs route to `/book` (internal, keeps users on-site)
- /book page has full motion graphics: Three.js stars + glow rings + sparkles + Melissa
- Cal.com calendar properly embedded with dark theme
- Build passes cleanly

**Key decisions:**
- All CTAs route to `/book` (internal) instead of external Cal.com URL
- Three.js particles reused from homepage (same HeroParticles component)
- Cal.com iframe at 1000px with resize listener (was overflowing at 600px)
- Melissa sparkle treatment enhanced per user request
- No heading/subtitle on /book page — the calendar speaks for itself

**What NOT to re-debate:**
- CTAs route to `/book` (internal) — do not revert to external Cal.com links
- Three.js stars on /book page — user explicitly requested "same star motion graphics from homepage"
- Melissa sparkle constellation — user said "make Melissa sparkle more"
- 1000px iframe height — smaller heights caused calendar to "crawl off the page"
- No "Let's Talk!" text on /book page — user said it's redundant

---

### Session IV Summary (February 11, 2026)

**Focus:** Content population (56 pieces via OpenAI), colleague copy feedback, Cal.com CTA integration, custom 404 page

**What was done:**

1. **Content generation** (1 modified file, 56 docs written to MongoDB):
   - `scripts/generate-content.ts` — Removed all fractional CMO topics (user directive). Replaced comparison with "Brand Strategy vs. Demand Generation", news with "B2B agency relationships". Filtered "Fractional CMO" from glossary.
   - Ran `npm run generate-content` — 56 pieces generated, 3 skipped (existing), 1 rejected (forbidden term "synergy")
   - Content breakdown: 10 FAQs, 14 glossary, 8 blogs, 3 comparisons, 6 expert Q&A, 3 news, 3 case studies, 3 industry briefs, 3 videos, 3 tools

2. **Homepage copy feedback** (3 modified files):
   - `components/home/HeroSection.tsx` — Tagline: "fundamentals meet the future" + expanded value prop
   - `components/home/ProblemSection.tsx` — Updated summary: "fake AI adaptation or force a choice"
   - `components/home/ApproachSection.tsx` — Subheader: "We offer the best of both worlds"

3. **CTA overhaul** (6 modified files):
   - All CTA buttons changed to "Let's Talk!" linking to `cal.com/team/tsc/25-50` (external, target=_blank)
   - Updated: HeroSection, CtaSection, ServiceCTA, Header (desktop + mobile), Footer, CtaStrip
   - Collapsed dual-button CTAs to single button (both would go to same URL)
   - Removed 404 nav links (Work, About, Contact) from Header and Footer

4. **Custom 404 page** (1 new file, 1 new asset):
   - `app/not-found.tsx` — "Hi, Melissa!" with Charlie's Angels 70s treatment
   - Circular photo with mix-blend-mode screen, 4 concentric brand-color glow rings (rotating, pulsing), sparkle accents, radial background glow, gradient text, Framer Motion entrance animations
   - `public/images/melissa.jpeg` — Photo for 404 page

**Commits this session:**
- `af3584e` — feat: Content generation — remove fractional CMO, populate 56 pieces via OpenAI
- `d896cff` — feat: Homepage copy feedback + all CTAs to Cal.com booking
- `1ef89fa` — feat: Custom 404 page — Hi Melissa with Charlie's Angels 70s treatment
- `be90f2d` — docs: Update roadmap for Session IV

**Results:**
- 102 static pages (up from 46)
- 56 AI-generated content pieces live in MongoDB across all 10 types
- All CTAs route to Cal.com booking (later changed to /book in Session V)
- Custom 404 page with motion graphics

**What NOT to re-debate:**
- No fractional CMO content generated (existing seed data still has some — decision pending on purge)
- Homepage copy changes are approved by colleague
- Dual CTA buttons collapsed to single — don't re-add secondary buttons

---

### Session III Summary (February 11, 2026)

**Focus:** Added Videos + Tools content types, SEO/AEO infrastructure, kernel-driven content generation script

**What was done:**

1. **Video + Tool data layer** (4 modified files):
   - `lib/resources-db.ts` — Added Video interface (videoId, embed, transcript, answerCapsule, speaker) + Tool interface with sub-types (ChecklistItem, AssessmentQuestion, AssessmentResult, CalculatorConfig). Full CRUD + indexes for both.
   - `lib/content-db.ts` — Added `'tool'` to ContentType union
   - `lib/related-content.ts` — Added `'video'` + `'tool'` to RelatedItemType + TYPE_CONFIG
   - `lib/schema/breadcrumbs.ts` — Added `videoBreadcrumb()` + `toolBreadcrumb()`

2. **Video + Tool pages** (6 new files, 3 modified)
3. **SEO/AEO infrastructure** (3 new files): robots.ts, sitemap.ts, llms.txt
4. **Content generation pipeline** (2 new files, 2 modified)

**Key decisions:** 10 content types final, CLI-first generation (not cron), pure fetch to OpenAI

---

### Session II Summary (February 11, 2026)

**Focus:** Multi-tenant kernel sync, MongoDB infrastructure, complete Insights section (8 content types x listing + detail pages)

**Key decisions:** Multi-tenant from day one, build-time kernel sync, shared `tsc` database with clientId isolation

---

### Session I Summary (February 11, 2026)

**Focus:** Homepage and services pages with full creative mandate — "beautiful and weird"

**Key decisions:** Dark-first theme, 6 kernel service categories, react-three v8/v9 for React 18

---

### Phase 0 Summary (February 10, 2026)

**Focus:** Full project scaffolding.

**What was done:** Initialized Next.js 14 project, installed dependencies, wrote product brief + CLAUDE.md, created session skills, initialized git.

**Key decisions:** Database name `tsc`, content hub path `/insights/`, 10 content types, multi-cluster seeding.

**Donor platform:** `/Volumes/Queen Amara/AnswerEngineOptimization.com/`
**GTM Kernel:** `/Volumes/Queen Amara/GTM Kernel/`

---
