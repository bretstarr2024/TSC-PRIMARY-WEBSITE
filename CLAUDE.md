# Claude Instructions for This Project

## Project Context

This is **The Starr Conspiracy Smart Website** — an AI-native, self-generating content engine for The Starr Conspiracy (TSC), a B2B marketing agency.

- **Stack:** Next.js 14 (App Router, TS, Tailwind), Framer Motion, Three.js, MongoDB, Vercel
- **Content brain:** GTM Kernel (20 components, 5 domains, 3 JTBD clusters)
- **Content pipeline:** 10 cron jobs, 10 content types, autonomous generation

## Domain

**TBD** — Domain will be configured when ready to go live. Use placeholder URLs in the meantime.

## Database

**Database: `tsc` in MongoDB Atlas.** Never `aeo` (that's the AEO site).

## DEPLOYMENT - READ THIS FIRST

**Git push alone does NOT deploy. Auto-deploy is disabled.**

After pushing to GitHub, ALWAYS trigger the Vercel deploy hook:

```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_nC50CRWORPDcPorbaenM52x3kwt0/V5Pb4PA4Rr"
```

Do this EVERY. SINGLE. TIME. after `git push`.

## Documentation

All planning and reference docs are in `/docs`:
- `product-brief.md` — Comprehensive product brief (vision, IA, content strategy, tech stack)
- `roadmap.md` — Phased build roadmap with session-by-session scope
- `HANDOFF.md` — Session handoff (cumulative, newest at top)

## Donor Platform

This site is based on the AEO site platform. The donor codebase is at:
```
/Volumes/Queen Amara/AnswerEngineOptimization.com/
```

When building new features, **check the donor codebase first** for existing implementations to copy and adapt. Key patterns:
- All API clients use **pure fetch** (no SDK dependencies — lesson from googleapis disaster)
- Pipeline infrastructure in `lib/pipeline/` (circuit breaker, error classifier, stuck detector, etc.)
- Content prompts in `lib/pipeline/content-prompts.ts` (brand voice, per-type prompts)
- RelatedContent component for cross-type internal linking

## GTM Kernel

The content brain lives at:
```
/Volumes/Queen Amara/GTM Kernel/
```

Reference kernel YAML: `gtm_kernel/kernels/tsc/kernel.yaml` (1,736 lines, all 20 components)

## Chatbot

- Named **"chaDbot"** (inside joke, keep it)
- Powered by GPT-5.2 via OpenAI API
- RAG-powered from indexed site content
- Requires OPENAI_API_KEY env var in Vercel

## Key Conventions

- **Brand voice:** Direct, strategic, irreverent, practical. Sage + Rebel archetype.
- **Forbidden terms:** "thought leader" (use expert/authority), "synergy" (use integration/alignment)
- **Preferred terms:** "clients" not "customers," "engagement" not "contract," "partner" not "vendor"
- **Expert rotation:** Bret Starr, Racheal Bates, JJ La Pata
- **Content pipeline:** NEVER use "pioneers of AEO" in generated content
- **Content types:** blog, faq, glossary, comparison, expert-qa, news, video, case_study, industry_brief, tool
- **Build command:** `npm run build` = `sync-kernel` + `next build` + `npm run index-content`
- **index-content** will skip gracefully without MONGODB_URI (expected locally)
