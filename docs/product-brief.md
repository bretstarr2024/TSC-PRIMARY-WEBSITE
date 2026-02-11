# Product Brief: The Starr Conspiracy Smart Website

**Version:** 1.0 | **Date:** February 10, 2026 | **Author:** Bret Starr + Claude

---

## Vision

Replace the current static thestarrconspiracy.com with a living, AI-native website that generates its own content corpus from the full GTM Kernel. While the AEO site (answerengineoptimzation.com) covers Answer Engine Optimization through a single JTBD cluster, this site covers **everything TSC does** — all 6 service categories, all 3 JTBD clusters, all 10 demand states — making it the definitive digital presence for The Starr Conspiracy.

The site is not a brochure. It's a self-generating content engine grounded in the 20-component GTM Kernel, producing expert-quality content across 9 content types, distributed through video and email, and optimized for both traditional search and AI answer engines.

---

## Target Audience

From the GTM Kernel (Component 6: Ideal Customer Profile):

**Primary Persona:** AI Pragmatist (CMO/VP Marketing)
- Titles: CMO, VP of Marketing, Head of Marketing, Marketing Director
- Companies: B2B tech, 50–2,000 employees, $5M–$500M ARR
- Industries: Cybersecurity, FinTech, HR Tech/HCM, HealthTech, Enterprise SaaS, DevTools, Cloud Infrastructure, AI/ML Platforms
- Psychographic: "Marketing should be a strategic growth engine, not a cost center. AI is an opportunity, not a threat."

**Economic Buyers:** CEO (growth strategy), CFO (ROI), CRO (pipeline)
**Influencers:** Marketing Ops, Demand Gen Leaders
**Anti-ICP:** B2C, very small businesses, non-tech industries

---

## Services Scope

From the GTM Kernel (Component 3: Offerings & Exclusions):

### 1. Strategic & Foundational
- Brand Strategy & Positioning
- Go-to-Market Strategy
- Thought Leadership Strategy

### 2. Demand & Pipeline
- Demand Generation
- Account-Based Marketing (ABM)
- Marketing Automation

### 3. Digital Performance
- Paid Media (Google Ads, LinkedIn Ads, programmatic)
- SEO
- Social Media

### 4. Content & Creative
- Content Marketing
- Creative Services

### 5. Advisory & Transformation
- Fractional CMO
- Marketing Transformation

### 6. AI Services
- AI Marketing Strategy
- AI Content Engines
- Answer Engine Optimization (AEO)

**Explicitly excluded:** Event management, video production facilities, website development/coding, application development, CRM implementation, data engineering, translation/localization, content mills.

---

## Information Architecture

### Navigation
```
Home | Services | Industries | Insights | Work | About | Contact
```

### Pillar Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage — value prop, service overview, CTA |
| `/services` | Service overview hub |
| `/services/brand-strategy` | Strategic & Foundational |
| `/services/demand-generation` | Demand & Pipeline |
| `/services/digital-performance` | Digital Performance |
| `/services/content-marketing` | Content & Creative |
| `/services/fractional-cmo` | Advisory & Transformation |
| `/services/ai-marketing` | AI Services (includes AEO) |
| `/industries` | Industry verticals hub |
| `/industries/cybersecurity` | Per-industry pages (8 total) |
| `/insights` | Content hub — all 9 content types |
| `/work` | Case studies and client outcomes |
| `/about` | Team, story, 25+ years |
| `/contact` | Inquiry form, booking link |

### Content Types (9)

| Type | Route | Source | Description |
|------|-------|--------|-------------|
| Blog Post | `/insights/blog/[slug]` | News + JTBD seeds | Long-form articles (800–1500 words) |
| FAQ | `/insights/faq/[slug]` | JTBD seeds | Answer capsule + detailed explanation |
| Glossary | `/insights/glossary/[slug]` | JTBD seeds | Term definitions (short + full) |
| Comparison | `/insights/comparisons/[slug]` | JTBD seeds | Head-to-head with scoring |
| Expert Q&A | `/insights/expert-qa/[slug]` | JTBD seeds | Attributed Q&A (Bret, Racheal, JJ) |
| News | `/insights/news/[slug]` | Source monitoring | Curated commentary on industry news |
| Video | `/insights/videos/[id]` | Blog posts + JTBD | HeyGen avatar videos |
| Case Study | `/insights/case-studies/[slug]` | Manual + kernel | Client success stories |
| Industry Brief | `/insights/industry/[slug]` | JTBD seeds | Per-industry analysis |

---

## Content Strategy

### JTBD Seeding (from Kernel Component 9)

Three JTBD clusters, seeded in weighted round-robin:

1. **Build a Growth Engine** — Marketing as predictable pipeline machine
   - Starting state: "Marketing is a cost center with unpredictable results"
   - Desired state: "Marketing is a predictable pipeline machine with measurable ROI"

2. **Navigate AI Transformation** — AI-augmented marketing function
   - Starting state: "Uncertain how AI applies to our marketing"
   - Desired state: "AI-augmented marketing function with competitive advantage"

3. **Fill Leadership Gap** — Fractional CMO / strategic leadership
   - Starting state: "No senior marketing leadership"
   - Desired state: "Strategic marketing guidance with experienced leadership"

### Demand-State-Aware Content Selection

From kernel's 5 active demand states:

| Demand State | Primary Content Types |
|-------------|----------------------|
| Researching | FAQ, Glossary, Blog |
| Validating | Case Study, Expert Q&A |
| Comparing | Comparison, Blog |
| Buying | Case Study, Industry Brief |
| Defending | Blog, Expert Q&A |

### Kernel-Based Filtering

Content relevance is enforced by the kernel's filtering rules (Component 20):
- **Persona filtering:** 60+ include keywords, 25+ exclude keywords
- **Service filtering:** 80+ include keywords, 20+ exclude patterns
- **Context filtering:** 50+ include triggers, 15+ exclude signals
- **Topic markers:** Content must contain at least one of: marketing, brand, demand, strategy, B2B, agency, CMO, growth, content, positioning

### Brand Voice (from Kernel Components 14–16)

- **Values:** Truth over comfort, Fundamentals + Innovation, Results over activity
- **Archetype:** Sage (primary) + Rebel (secondary) — deep expertise delivered with irreverence
- **Personality:** Direct, Strategic, Irreverent, Thoughtful, Practical
- **Voice rules:** Be direct, use "you" and "we," lead with insight not setup
- **Structural patterns:** "Insight First" (bold claim → evidence → implication → action) and "Problem-Solution" (pain → why → solution → proof)
- **Forbidden terms:** "thought leader" (use expert/authority/practitioner), "synergy" (use integration/alignment)
- **Preferred terms:** "clients" not "customers," "engagement" not "contract," "partner" not "vendor"

### Expert Attribution

Content attributed to TSC leadership on rotation:
- **Bret Starr** — Founder, strategic marketing + AI transformation
- **Racheal Bates** — Operations & client success
- **JJ La Pata** — Digital performance & demand generation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| 3D | Three.js (@react-three/fiber, @react-three/drei) |
| Database | MongoDB Atlas (database: `tsc`) |
| AI | OpenAI GPT-5.2 (content generation, embeddings, RAG) |
| Auth | Clerk (dashboard access) |
| Video | HeyGen (avatar), ElevenLabs (TTS), Cloudinary (storage) |
| Distribution | YouTube (upload), Resend (email digest) |
| Analytics | Vercel Analytics, GA4, Wincher, DataForSEO, SEMrush, SerpAPI, Ahrefs, GSC |
| Observability | Sentry (errors, performance, session replay) |
| Hosting | Vercel (SSR + edge functions + cron jobs) |
| Storage | Vercel Blob (audio files) |

---

## Content Pipeline Architecture

### Cron Jobs (Vercel)

| Cron | Schedule | Purpose |
|------|----------|---------|
| `check-sources` | Every 6h | Monitor RSS/URLs, extract claims |
| `seed-resource-queue` | Daily 7:30am UTC | Seed from 3 JTBD clusters (round-robin) |
| `generate-content` | Daily 8am UTC | Process queue → 9 content types |
| `sync-jtbd-coverage` | Monthly 1st 3am | Sync coverage from seeds_v2 |
| `generate-video` | Daily 6am, 10am | Create HeyGen avatar videos |
| `distribute-videos` | Every 30min | Upload to YouTube/Cloudinary |
| `recover-stuck-videos` | Hourly | Reset orphaned pipeline records |
| `process-webhook-queue` | Every 5min | Handle HeyGen callbacks |
| `send-digest` | Weekly Mon 3pm | Email digest of new content |
| `linkedin-token-reminder` | Daily 2pm | Token expiry check |

### Pipeline Guardrails

- **Duplicate detection:** Jaccard title similarity (0.50) + embedding cosine (0.85)
- **Brand voice scoring:** GPT-5.2 scores 0–100, min 60 to pass
- **Factual grounding:** Flags fabricated stats, quotes, events
- **Off-topic filter:** Kernel-based filtering rules (persona, service, context)
- **Daily caps:** 1 blog post/day, $2/day OpenAI spend
- **Claims dedup:** 30-day window
- **Circuit breaker:** Auto-pauses services after repeated failures
- **Error classification:** 18 categories for queryable failure analysis
- **Stuck detector:** Auto-recovers orphaned pipeline records

### Pipeline Diagnostics

API endpoint at `/api/pipeline/diagnose` with 6 modes:
- `summary` — Pipeline health overview
- `failures` — Recent failure details
- `video` — Video pipeline status
- `error-categories` — Failure breakdown by category
- `script-failures` — Script generation failures
- `run` — Specific pipeline run trace

---

## AEO Effectiveness Features

- **`/llms.txt`** — Dynamic endpoint per llmstxt.org spec (1-hour cache)
- **AI crawler allowlist** — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. in robots.txt
- **Answer capsules** — 20–25 word standalone answers after H1 on pillar pages
- **Structured data:** BreadcrumbList (all detail pages), HowTo (methodology pages), FAQPage (FAQ content), Organization, Person
- **Sitemap** — Covers all dynamic content types
- **Internal linking** — RelatedContent component on all pages, tag-based matching + query coverage boost

---

## MongoDB Collections (database: `tsc`)

| Collection | Purpose |
|-----------|---------|
| `content_queue` | Content generation pipeline queue |
| `blog_posts` | Published blog articles |
| `faq_items` | FAQ entries |
| `glossary_terms` | Term definitions |
| `comparisons` | Head-to-head comparisons |
| `expert_qa` | Expert Q&A items |
| `news_items` | Curated news feed |
| `case_studies` | Client case studies |
| `industry_briefs` | Per-industry analysis |
| `source_monitors` | RSS/URL monitors |
| `videos` | Video pipeline state machine |
| `query_coverage` | JTBD query → content links |
| `gtm_kernel` | Synced kernel filtering rules |
| `subscribers` | Email subscription list |
| `pipeline_logs` | Pipeline execution logs |

**Shared read-only access to:** `ultimate_seed_generator.seeds_v2` (all 3 JTBD clusters)

---

## Dashboard

Protected by Clerk auth at `/dashboard`:
- Pipeline health and diagnostics
- Content generation metrics
- Analytics integrations (GA4, Wincher, DataForSEO, SEMrush, SerpAPI, Ahrefs, GSC)
- Video pipeline status
- Error categories and failure tracking

---

## Chatbot

- **Name:** chaDbot (inside joke, keep it)
- **Engine:** GPT-5.2 via OpenAI API
- **RAG:** MongoDB Atlas vector search on indexed site content
- **Scope:** Full TSC services, strategy, AI transformation (wider than AEO version)
- **Personality:** Matches brand voice — direct, witty, helpful, irreverent

---

## Relationship to AEO Site

| Aspect | AEO Site | TSC Smart Website |
|--------|----------|-------------------|
| Domain | answerengineoptimzation.com | TBD |
| Database | `aeo` | `tsc` |
| Scope | AEO only (1 JTBD cluster) | All TSC services (3 JTBD clusters) |
| Content types | 7 | 9 |
| Kernel usage | Filtering rules only | Full 20-component integration |
| Status | Live, autonomous | Building |

Both sites coexist. AEO stays narrow and deep on AEO. TSC goes wide across all services. Cross-linking between sites where topics overlap (e.g., AEO content on TSC links to deep-dive on AEO site).

---

## Donor Platform

This site is built on the same platform as the AEO site. The "donor codebase" lives at:
```
/Volumes/Queen Amara/AnswerEngineOptimization.com/
```

The GTM Kernel (content brain) lives at:
```
/Volumes/Queen Amara/GTM Kernel/
```

Key code is copied and adapted — not symlinked. Each site evolves independently. Lessons learned on AEO (pure fetch over SDKs, TypeScript async narrowing, deploy hook discipline) carry forward.

---

## Success Metrics

1. **AI citation rate** — Mentions in ChatGPT, Perplexity, Claude, Google AI Overviews when asked about B2B marketing topics
2. **Organic traffic** — Growth in non-paid search traffic
3. **Lead generation** — Form submissions and booking requests
4. **Content velocity** — Autonomous content published per week
5. **Pipeline influence** — Content's contribution to sales pipeline
6. **Brand authority** — Domain Rating, backlinks, referring domains
