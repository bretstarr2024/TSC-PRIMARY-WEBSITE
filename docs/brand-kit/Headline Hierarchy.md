# TSC GTM Kernel — Headline Hierarchy & Typography Scale

**Last Updated:** February 8, 2026

This document defines the heading hierarchy for all GTM Kernel interfaces: onboarding wizard, kernel detail pages, dashboards, and modals. Consistent heading sizes ensure users can scan pages quickly and understand information structure at a glance.

---

## The Problem

When section headers and field labels are the same size (or worse, section headers are smaller), users lose the visual hierarchy that tells them "this is a group" vs. "this is a question." The result: everything looks flat, nothing stands out, and users miss required fields.

---

## Heading Hierarchy (Most → Least Prominent)

### Level 1: Page / Step Title

The primary heading for the current page or wizard step.

| Property | Value |
|----------|-------|
| **Tailwind** | `text-2xl font-bold text-heart-of-darkness` |
| **Size** | 24px |
| **Weight** | 700 (bold) |
| **Color** | Heart of Darkness (#141213) |
| **Case** | Sentence case |
| **Example** | "Company Profile" |

---

### Level 2: Section Header

Groups of related fields within a step. Always uppercase with tracking.

| Property | Value |
|----------|-------|
| **Tailwind** | `text-sm font-semibold text-heart-of-darkness uppercase tracking-wider` |
| **Size** | 14px |
| **Weight** | 600 (semibold) |
| **Color** | Heart of Darkness (#141213) |
| **Case** | UPPERCASE |
| **Letter Spacing** | Wider (0.05em) |
| **Example** | "NAME & LOCATION", "LEADERSHIP", "SCALE & MATURITY" |

**Why this works:** Same font size as field labels (14px), but the combination of **darker color**, **semibold weight**, **uppercase**, and **letter spacing** creates clear visual dominance over field labels without needing a larger font size.

**Previous (broken):** `text-xs font-semibold text-greige uppercase tracking-wider` — 12px in greige was visually smaller than 14px field labels.

---

### Level 3: Field Label

Individual field labels within a section.

| Property | Value |
|----------|-------|
| **Tailwind** | `text-sm font-medium text-greige` |
| **Size** | 14px |
| **Weight** | 500 (medium) |
| **Color** | Greige (#6D6D69) |
| **Case** | Sentence case |
| **Example** | "Full Legal Name", "Ownership Type", "Employee Count" |

**Key distinction from Level 2:** Same size but lighter weight (500 vs 600), lighter color (greige vs heart-of-darkness), and no uppercase/tracking.

---

### Level 4: Helper / Descriptive Text

Contextual guidance, placeholder text, and secondary descriptions.

| Property | Value |
|----------|-------|
| **Tailwind** | `text-xs text-greige` |
| **Size** | 12px |
| **Weight** | 400 (regular) |
| **Color** | Greige (#6D6D69) |
| **Case** | Sentence case |
| **Example** | "Key voices to track for GTM content (executives, subject matter experts)" |

**Placement rule:** Helper text for text fields goes inside the field as `placeholder`, not below. The `text-xs text-greige` style is only used for non-field descriptions (e.g., section explanations, card sublabels).

---

## Quick Reference

```
Level 1: text-2xl font-bold text-heart-of-darkness          ← Page title
Level 2: text-sm font-semibold text-heart-of-darkness uppercase tracking-wider  ← Section header
Level 3: text-sm font-medium text-greige                    ← Field label
Level 4: text-xs text-greige                                ← Descriptions
```

---

## Application Areas

| Area | Level 1 | Level 2 | Level 3 | Level 4 |
|------|---------|---------|---------|---------|
| **Wizard** | Step title ("Company Profile") | Section group ("NAME & LOCATION") | Input label ("Full Legal Name") | Section description, placeholder text |
| **Detail Page** | Component title ("Ideal Customer") | Field group headers | Field names | Field descriptions |
| **Modal** | Modal title (in dark header) | Tab/section headers | Field labels | Guidance text |
| **Dashboard** | Page title ("Your Kernels") | Card/section headers | Metadata labels | Status text |

---

## CSS Constant (Wizard)

The wizard uses a shared constant for all section headers. This is the single source of truth:

```typescript
const SUBHEAD_CLASS = 'text-sm font-semibold text-heart-of-darkness uppercase tracking-wider';
```

Any changes to section header styling should be made here, not in individual JSX.
