---
name: end-session
description: Procedural session closeout — canonicalize state, verify builds, commit, deploy, generate session ledger and handoff
user-invocable: true
---

# /end-session

You are closing out a coding session on **The Starr Conspiracy Smart Website** project (Next.js 14, Tailwind, Framer Motion, Three.js, MongoDB, Vercel).

**This skill is write-heavy and procedural.** Execute every step in order. Do not skip steps. Only ask questions if execution is impossible without clarification.

---

## Step 1: Canonicalize state

Reconcile everything from this session's chat context into durable artifacts:

1. **Update `docs/roadmap.md`** — add a session section with what was done, decisions made, and what's next. Mark completed items. Add new items discovered during the session.

2. **Resolve contradictions** — if any docs, code comments, or configs contradict what was actually built this session, fix them.

3. **Mark deferred items explicitly** — anything discussed but intentionally not done gets recorded with rationale.

4. **Check sync chains** — if any of these were modified this session, verify all related files are consistent:
   - **Blog posts:** `lib/content-db.ts` types ↔ MongoDB `tsc.blog_posts` schema ↔ `app/insights/` rendering ↔ RAG indexing
   - **Videos:** `lib/videos-db.ts` ↔ MongoDB `tsc.videos` ↔ HeyGen webhook handler ↔ Cloudinary post-processing ↔ video components
   - **Content queue:** `lib/content-db.ts` ↔ cron routes (`generate-content`, `check-sources`, `seed-resource-queue`)
   - **GTM kernel:** kernel.yaml ↔ `lib/gtm-kernel-db.ts` ↔ `scripts/sync-gtm-kernel.ts`
   - **People/Schema:** `lib/schema/people.ts` ↔ structured data in components

---

## Step 2: Verify builds

Run the full build:

```bash
npm run build
```

This runs `next build` + `npm run index-content`.

**This is a gate.** If builds fail:
- Attempt to fix the issue.
- If the fix is non-trivial, report the failure and ask the user whether to commit anyway or fix first.

---

## Step 3: Verify data structure consistency

Every schema change must be applied globally — not just to new records. If a session added fields to MongoDB document creation paths, every existing record needs that field backfilled with its default value. This step catches schema drift before it accumulates.

### 3a. Determine if data model changes were made this session

Check whether this session:
- Added new fields to any MongoDB document creation path (`insertOne`/`insertMany`/`updateMany` calls in `lib/content-db.ts`, `lib/videos-db.ts`, `lib/gtm-kernel-db.ts`, etc.)
- Modified TypeScript types that map to MongoDB documents
- Added new fields to API routes that write to MongoDB
- Modified cron jobs or webhook handlers that write to collections

If **none** of the above apply, record `data_structure_consistency: "not modified"` in the ledger and skip to Step 4.

### 3b. Run structural audit

Use the MongoDB MCP `aggregate` tool to compare structural key sets across all records in the affected collection(s) within the `tsc` database:

```javascript
// For each affected collection (blog_posts, videos, etc.):
db.collection.aggregate([
  { $facet: {
    total: [{ $count: "n" }],
    keys: [
      { $project: { keys: { $objectToArray: "$$ROOT" } } },
      { $unwind: "$keys" },
      { $group: { _id: "$keys.k", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]
  }}
])
```

Any field where `count < total` indicates structural divergence — some documents have the field, others don't.

### 3c. If divergence is found

1. **If the session introduced the divergence** (new fields added to creation path but not backfilled):
   - **BLOCKING**: Write a targeted `updateMany` to backfill the missing field(s) with default values before committing.
   - Use the "defaults-first, existing-wins" pattern: `{ $set: { newField: defaultValue } }` with filter `{ newField: { $exists: false } }`.

2. **If the divergence is pre-existing** (from before this session):
   - **NOT BLOCKING**: Record the divergence in the ledger and continue.

### 3d. Record result in ledger

Add to the session ledger YAML:
```yaml
data_structure_consistency:
  status: "pass | divergence-found | backfill-applied | not modified"
  collections_checked: []  # list of collection names checked
  divergent_fields: []  # or list of {collection, field, missing_count}
  notes: ""
```

**Gate:** If the session introduced data model changes AND structural drift is detected in the affected collection(s), the backfill MUST run before committing. Do not commit schema-drifted code.

### Cross-project principle: Global schema consistency

This check enforces a principle shared across all TSC projects (GTM Kernel, USG, Smart Website):

> **Every schema change must be applied globally — not just to new records.** If you add a field to the creation path, every existing record needs that field backfilled with its default value. No per-org customization of schema structure. If a change applies to one org's data, it applies to ALL orgs. Code changes alone are not enough — the database must match.

The USG project runs this check via `scripts/backfill_structural_consistency.py`. The GTM Kernel checks 6 critical nested paths across all kernel documents.

---

## Step 4: Version and commit

### Determine version bump

Look at what changed this session and apply SemVer logic:
- **PATCH** — bug fixes, typo corrections, doc updates only
- **MINOR** — new features, new pages, new API routes, pipeline changes
- **MAJOR** — breaking changes, data model migrations, architectural shifts

The version is tracked in the session ledger (not package.json). Increment from the last session ledger's version field. If this is the first session, start at **0.1.0**.

### Commit

- Use **atomic commits** — one logical change per commit.
- Use **imperative commit messages** following the project's convention:
  - `fix:` for bug fixes
  - `feat:` for new features
  - `docs:` for documentation changes
  - `refactor:` for code restructuring
  - `chore:` for maintenance tasks

- Stage and commit all changes. Include the session closeout docs in a final `docs:` commit.

### Push

```bash
git push origin main
```

---

## Step 5: Deploy

Trigger the Vercel deploy hook (auto-deploy is disabled):

```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_nC50CRWORPDcPorbaenM52x3kwt0/V5Pb4PA4Rr"
```

Report the response. If the deployment was triggered successfully, note the job ID from the response.

---

## Step 6: Generate session ledger (YAML)

Determine the session number: read the latest ledger to get the previous session ID (Roman numeral), then increment by one. If no ledgers exist, this is Session I.

Save to: `docs/sessions/session-{roman-lowercase}-ledger.yaml`

### Required fields:

```yaml
session_id: "[ROMAN_NUMERAL]"
date: "[YYYY-MM-DD]"
branch: main
version: "[X.Y.Z]"  # [PATCH/MINOR/MAJOR]: Brief description

deployment:
  platform: vercel
  url: "[TBD]"
  environment: production
  job_id: "[from deploy hook response or N/A]"
  status: "[triggered/skipped]"

build_verification:
  next_build: "[PASS/FAIL]"
  index_content: "[PASS/SKIP/FAIL]"

data_structure_consistency:
  status: "pass | divergence-found | backfill-applied | not modified"
  collections_checked: []
  divergent_fields: []
  notes: ""

commits:
  - hash: "[short hash]"
    message: "[commit message]"

artifacts_updated:
  - "[file/path]"  # Brief description of change

decisions_made:
  - decision: "[what was decided]"
    rationale: "[why]"
    reversible: "[true/false]"

known_risks:
  - risk: "[description]"
    mitigation: "[what to do about it]"
    severity: "[low/medium/high]"

explicitly_deferred:
  - "[item and reason]"

next_actions:
  - "[ordered, executable step]"

invariants:
  - "Database: tsc collection in MongoDB Atlas (never aeo)"
  - "Deploy hook required after every git push (auto-deploy disabled)"
  - "Donor codebase: /Volumes/Queen Amara/AnswerEngineOptimization.com/"
  - "GTM Kernel: /Volumes/Queen Amara/GTM Kernel/"
  # Add any new invariants from this session
```

Omit sections that don't apply. Don't include empty arrays — just omit the key.

---

## Step 7: Write human-readable handoff

Update `docs/HANDOFF.md`. This file is cumulative — add the new session summary at the top (below the header), pushing previous sessions down.

The handoff must answer in plain language:
- **Where we are** — current phase, what's live, what's in progress
- **What works right now** — systems status, what's running
- **What was just changed and why** — this session's work with rationale
- **What must happen next** — prioritized action items
- **What not to re-debate** — decisions that were made with reasoning

The handoff must be **self-contained**: copy-pasteable into a brand new Claude Code chat with enough context to resume work without prior history.

### Format:

```markdown
# Session Handoff: The Starr Conspiracy Smart Website

**Last Updated:** [Month Day, Year] (Session [ROMAN])

---

## Current Phase: [Phase Name] [STATUS]

[1-2 sentence summary of where the project is]

- **Active systems:** [what's running]
- **Next actions:** [top 1-2 priorities]
- **Roadmap:** See `docs/roadmap.md` Session [ROMAN]

### Session [ROMAN] Summary ([Date])

**Focus:** [One-line session focus]

**What was done:**
[Numbered list of changes with file paths]

**Commits this session:**
- `[hash]` — [message]

**Results:**
[Measurable outcomes]

**Donor files referenced:**
[List of AEO/Kernel files that were copied or adapted]

---

[Previous session summaries below...]
```

---

## Step 8: Continuity guardrails

Add to the ledger's `invariants` field and call out in the handoff:

- **Invariants** that must not be violated in future sessions
- **Decisions** that look reversible now but become expensive later
- **Things to validate early next session**

---

## Step 9: Final integrity check

Verify all of the following before declaring the session complete:

- [ ] All durable knowledge persisted (no decisions exist only in chat)
- [ ] All actions traceable to artifacts or commits
- [ ] Working tree clean (`git status` shows nothing)
- [ ] Pushed to remote (`git push` succeeded)
- [ ] If data model changed: structural consistency check passed (Step 3)
- [ ] Deploy triggered (or noted as TBD)
- [ ] Session ledger written to `docs/sessions/`
- [ ] `docs/HANDOFF.md` updated
- [ ] `docs/roadmap.md` updated

If something is blocked, state **what**, **why**, and **what input is needed** to unblock.

Report the final checklist with pass/fail for each item.

---

## Rules

- Execute steps **in order**. Don't skip steps.
- Don't ask exploratory or preference questions. Only ask if execution is impossible without clarification.
- If a step can't be completed, explicitly state what's blocked and why.
- Always trigger the deploy hook after pushing — auto-deploy is disabled.
- Database is `tsc` (never `aeo`).
- Every schema change must be applied globally. No per-org customization — if it changes for one org, it changes for all.
