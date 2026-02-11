---
name: begin-session
description: Read-only session startup — loads last session's ledger and handoff, checks git and build health, presents a structured briefing
user-invocable: true
---

# /begin-session

You are starting a new coding session on **The Starr Conspiracy Smart Website** project (Next.js 14, Tailwind, Framer Motion, Three.js, MongoDB, Vercel).

**This skill is strictly read-only.** Never modify files, make commits, or take corrective action. Report the state of the world and ask the user what to work on.

---

## Step 1: Locate latest session artifacts

Find the most recent session ledger and handoff:

1. **Ledgers (YAML)** — search all of these, sort to find the latest:
   - `docs/sessions/session-*-ledger.yaml`

2. **Handoff (Markdown)** — always at:
   - `docs/HANDOFF.md`

Read both the latest ledger AND `docs/HANDOFF.md` in full. Extract:
- `session_id` (Roman numeral, e.g., III)
- `date`
- `version`
- `next_actions`
- `explicitly_deferred`
- `known_risks`
- `open_questions`
- `invariants`
- `blocked_on` (if present)

The next session number is the Roman numeral after the latest `session_id`.

---

## Step 2: Git health check

Run these checks and report findings:

- **Current branch** (should be `main`)
- **Working tree status** — clean or dirty? If dirty, list uncommitted changes.
- **HEAD commit** — hash and message. Compare against the last session ledger's final commit hash. If they differ, summarize any commits since the last session that weren't part of it.
- **Remote sync** — is local ahead of or behind `origin/main`?

---

## Step 3: Build verification

Run the project's build check:

```bash
npm run build
```

This runs `next build` (TypeScript compilation + static generation) followed by `npm run index-content` (RAG vector indexing).

Report **pass or fail**. If it fails, report the error output verbatim. **Do NOT attempt to fix failures.**

---

## Step 4: Load MEMORY.md

Read the Claude Code auto-memory file for this project. The path follows the Claude Code convention for the project directory.

Note anything relevant to carry-forward work — patterns, guardrails, warnings, past mistakes.

If the file doesn't exist or is empty, note that.

---

## Step 5: Check roadmap and planning docs

Read `docs/roadmap.md` (focus on the most recent session section and any "Next Steps" or "Current Phase" content — the file is large, so read strategically).

Also read `docs/product-brief.md` if this is an early session (before Phase 2) to ensure alignment with the vision.

Note the top 2-3 in-progress or next-up priorities.

---

## Step 6: Check donor platform for reference

Note: The donor codebase (AEO site) is at `/Volumes/Queen Amara/AnswerEngineOptimization.com/`. If the current roadmap phase involves copying/adapting code from the donor, note which files will be relevant.

The GTM Kernel is at `/Volumes/Queen Amara/GTM Kernel/`. If the current phase involves kernel integration, note relevant kernel components.

---

## Step 7: Present structured briefing

Output a single scannable briefing in this exact format:

```
# Session [NEXT_NUMBER] Briefing

## Last Session ([LAST_ID] — [DATE])
[2-3 sentence summary of what was accomplished]

## Environment State
- **Branch:** [branch]
- **Working tree:** [clean/dirty + details]
- **HEAD:** [hash] [message]
- **External changes since last session:** [none / list]
- **Remote sync:** [up to date / ahead by N / behind by N]

## Build Status
- **next build:** [PASS/FAIL]
- **index-content:** [PASS/SKIP]
[If any failures, show error summary]

## Carry-Forward Items
[Numbered list from last session's next_actions]

## Blocked Items
[From blocked_on field, or "None"]

## Deferred Items
[From explicitly_deferred]

## Known Risks
[From known_risks with severity]

## Open Questions
[From open_questions]

## Guardrails & Invariants
- Database: `tsc` collection in MongoDB Atlas (never `aeo`)
- Deploy hook required after every git push (auto-deploy disabled)
- Donor codebase: /Volumes/Queen Amara/AnswerEngineOptimization.com/
- GTM Kernel: /Volumes/Queen Amara/GTM Kernel/
- [Any from invariants field]
- [Any from MEMORY.md]

## Current Priorities (from roadmap)
[Top 2-3 items]

## Donor Files to Reference
[If applicable — files from AEO or Kernel relevant to current phase]

---

What would you like to work on this session?
```

---

## Rules

- **Read-only.** Never modify files, make commits, or take corrective action.
- If builds fail or the working tree is dirty, **report it** and let the user decide.
- If no session artifacts exist yet (first session), say so and present the product brief summary instead.
- Don't ask exploratory questions beyond the final "What would you like to work on this session?"
- Keep the briefing concise — the handoff doc has the details if the user needs to dig deeper.
