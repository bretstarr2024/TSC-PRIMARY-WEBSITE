---
name: audit
description: Run all 8 code review commands in parallel, then present a consolidated findings report
user-invocable: true
---

# /audit

Run a comprehensive code review of the entire TSC Smart Website codebase by executing all 8 review commands and consolidating the results.

**This skill is read-only.** Do not fix anything. Report findings only.

---

## Step 1: Run all 8 reviews in parallel

Launch **8 Task agents in parallel** (subagent_type: "general-purpose"), one for each review command. Each agent should:
1. Read the corresponding review command file from `.claude/commands/`
2. Execute the review exactly as specified in that file
3. Return findings in the specified format (CRITICAL / WARNING / INFO)

The 8 review commands and their files:

| # | Review | Command File |
|---|--------|-------------|
| 1 | Security | `.claude/commands/review-security.md` |
| 2 | Architecture | `.claude/commands/review-architecture.md` |
| 3 | API Contracts | `.claude/commands/review-api-contracts.md` |
| 4 | Frontend | `.claude/commands/review-frontend.md` |
| 5 | Performance | `.claude/commands/review-performance.md` |
| 6 | Pipeline | `.claude/commands/review-pipeline.md` |
| 7 | MongoDB Queries | `.claude/commands/review-queries.md` |
| 8 | Data Integrity | `.claude/commands/review-data-integrity.md` |

**IMPORTANT:** Launch all 8 agents in a single message so they run concurrently. Each agent prompt should include:
- The full contents of the review command file (read it first, then pass it to the agent)
- Instruction to perform a thorough review following the command's checklist
- Instruction to return findings as CRITICAL / WARNING / INFO with file:line references

---

## Step 2: Consolidate results

After all 8 agents complete, consolidate their findings into a single report with this format:

```
# Audit Report — [DATE]

## Summary
- **Total findings:** [count]
- **Critical:** [count]
- **Warning:** [count]
- **Info:** [count]

## Critical Findings
[All CRITICAL findings from all 8 reviews, grouped by review domain]

## Warnings
[All WARNING findings from all 8 reviews, grouped by review domain]

## Informational
[All INFO findings from all 8 reviews, grouped by review domain]

## Top 5 Recommended Actions
[Prioritized list combining the top recommendations from all reviews]

## Per-Domain Summaries
### Security
[1-2 sentence summary + finding count]

### Architecture
[1-2 sentence summary + finding count]

### API Contracts
[1-2 sentence summary + finding count]

### Frontend
[1-2 sentence summary + finding count]

### Performance
[1-2 sentence summary + finding count]

### Pipeline
[1-2 sentence summary + finding count]

### MongoDB Queries
[1-2 sentence summary + finding count]

### Data Integrity
[1-2 sentence summary + finding count]
```

---

## Rules

- **Read-only.** Never modify files, make commits, or fix issues.
- Deduplicate findings that appear in multiple reviews (e.g., a security issue and an API contract issue about the same endpoint).
- When deduplicating, keep the most detailed version and note which reviews flagged it.
- If an agent fails or times out, note it in the report and continue with the others.
- Findings already resolved in previous sessions should NOT be re-reported. Cross-reference against `docs/HANDOFF.md` to filter out known-resolved items.
