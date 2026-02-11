---
name: stuck
description: Break out of a fix-deploy-still-broken loop by forcing deep investigation before any more changes
user-invocable: true
---

# Stuck Protocol

You're here because the same problem keeps surviving multiple fix attempts. Something is wrong with how you're diagnosing the issue — not just with the code. This protocol forces you to slow down, question your assumptions, and build an evidence chain before touching anything.

**Cardinal rule: NO EDITS until Phase 5. Phases 1–4 are strictly read-only.**

---

## Phase 1: Define the Loop

Before anything else, write a clear summary of the loop you're stuck in. Output this to the user:

```
### Loop Report

**Problem as stated by user**: {exact quote or paraphrase}

**Attempts so far**:
1. {session/version}: {what was tried} → {what happened}
2. {session/version}: {what was tried} → {what happened}
...

**What we expected**: {the outcome we predicted}
**What actually happened**: {the outcome we observed}
**The gap**: {why our mental model was wrong}
```

If the user provided a screenshot, study it carefully. Annotate what you see — don't just glance and assume. Call out specific visual elements by name, color, and position.

**Do not proceed until you've articulated the gap.**

---

## Phase 2: Ground Truth Audit

Stop trusting your memory of the code. Re-read the actual files that render the problematic output.

### For visual bugs:
1. **Identify the exact component** that renders the broken element — the exact JSX line, not "somewhere in the file."
2. **Trace the render chain** from data source to pixel:
   - What data does the component receive? (props, context, constants)
   - What conditional logic determines the visual output?
   - What CSS applies? (Tailwind classes, inline styles, parent styles, globals.css)
   - Are there any overrides? (specificity, !important, later rules, parent opacity, Framer Motion style props)
3. **Read the actual deployed code**, not what you think you changed. Run `git diff HEAD~1` to confirm.
4. **Check for caching**: stale Vercel builds, CDN cache, browser cache, ISR revalidation windows, SSR/hydration mismatch.

### For data bugs:
1. **Query the actual MongoDB database** via MCP — don't assume the data matches the model. All collections live in the `tsc` database (never `aeo`).
2. **Trace the data flow**: MongoDB document → API route / server component → client state → component props → rendered output.
3. **Check all save/load paths**:
   - API routes (`app/api/`) vs server components (direct DB calls)
   - Cron endpoints (`app/api/cron/`) — these run on Vercel's schedule
   - Content pipeline: `check-sources` → `content_queue` → `generate-content` → published collection
   - Video pipeline: `generate-video` → HeyGen webhook → `post-processing` → distribution
   - RAG indexing: `scripts/index-content.ts` runs at build time

### For logic bugs:
1. Add strategic console.logs or read Vercel function logs to confirm which code path is executing.
2. Check for early returns, short-circuit evaluations, or fallback values.

Output a **Ground Truth Report**:
```
### Ground Truth

**Component rendering the broken element**: {file:line}
**Exact JSX**: {the JSX that produces the element}
**Data flowing in**: {what props/state/constants feed it}
**Style applied**: {exact classes or inline styles}
**Confirmed deployed**: {yes/no, how verified}
```

---

## Phase 3: Widen the Aperture

Your previous fixes didn't work because you were looking in the wrong place. Systematically check for things you haven't considered:

### Checklist — run through ALL of these:

- [ ] **Other components rendering the same element**: Is there a duplicate component, a fallback, or a different code path for certain states?
- [ ] **CSS specificity / cascade**: Is a parent component, global style, Tailwind layer, or Framer Motion `style` prop overriding your change?
- [ ] **Conditional rendering**: Does the component render differently based on state, viewport, loading state, or feature flags?
- [ ] **Import confusion**: Are you editing the right file? Is there a similarly-named component or a barrel export pointing elsewhere?
- [ ] **Build / deploy pipeline**: Did the build actually include your changes? Auto-deploy is DISABLED — was the Vercel deploy hook triggered after push?
- [ ] **Client-side hydration**: Is the server-rendered HTML different from the client-rendered output? (Check "use client" directive)
- [ ] **Hardcoded values elsewhere**: Search broadly for the old value — hex codes, class names, magic strings. Your change might be correct but another instance overrides it.
- [ ] **The user's actual complaint**: Re-read their exact words. Are you solving the problem they described, or a different problem you assumed they meant?
- [ ] **Server vs client component boundary**: Is this a server component that should be a client component (or vice versa)? Does it use hooks, event handlers, or browser APIs?
- [ ] **ISR / revalidation**: Is the page using `revalidate` and serving stale cached content? Check `export const revalidate = ...` in the route.
- [ ] **Middleware interference**: Is `middleware.ts` (Clerk auth) intercepting or redirecting the request? Check the route matcher.
- [ ] **MongoDB query correctness**: Is the query matching what you think? Test with MCP `find` tool. Remember: collection is in `tsc` database (never `aeo`).
- [ ] **Environment variables on Vercel**: Does the deployed environment have the correct env var values? Local `.env.local` may differ from Vercel production.

For each item, either confirm it's not the issue (with evidence) or flag it as a potential root cause.

---

## Phase 4: Build the Evidence Chain

Construct an unbroken chain from root cause to visible symptom:

```
### Evidence Chain

1. {Root cause}: {file:line} — {what the code does}
2. {Intermediate step}: {how it flows to the next stage}
3. ...
N. {Visible symptom}: {what the user sees and why}

**Why previous fixes missed this**: {explanation}
```

If you can't build a complete chain, you don't understand the problem yet. Go back to Phase 3.

---

## Phase 5: Propose with Proof

Only now may you propose changes. Each change must include:

```
### Proposed Fix

**File**: {path}
**Line**: {number}
**Current code**: {exact code}
**Proposed code**: {exact code}
**Why this fixes it**: {reference to evidence chain step}
**Why it won't break anything else**: {scope of impact}
```

Present ALL proposed changes to the user before making any edits.

---

## Phase 6: Verify the Actual Output

After implementing:

1. **Build passes** — run `npm run build`. Necessary but NOT sufficient.
2. **Output verification**:
   - For UI bugs: ask the user for a screenshot after deploying
   - For API bugs: curl the endpoint directly
   - For data bugs: query MongoDB via MCP to confirm the stored state
   - For pipeline bugs: trigger the relevant cron and check logs
3. **Regression check** — confirm you didn't break anything adjacent to the fix.
4. **Root cause confirmed** — the evidence chain should predict the fix, and the fix should confirm the evidence chain. If the fix works but you don't understand why, you got lucky and the real bug is still there.

---

## Rules

- **No edits in Phases 1–4.** The whole point is to understand before acting.
- **No "this should fix it."** Only "this WILL fix it because {evidence chain}."
- **No skipping the checklist in Phase 3.** The fix is hiding in the item you'd skip.
- **If the user provides a screenshot, study it pixel by pixel.** Don't glance — annotate.
- **Ask the user questions.** They see the actual output. You're guessing from code.
- **If you can't build a complete evidence chain**, say so honestly. "I can't trace this — here's where it breaks" is better than another guess-and-commit cycle.
- **Database is `tsc`** (never `aeo`).
