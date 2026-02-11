# TSC GTM Kernel — UX Principles

**Last Updated:** February 8, 2026

This document codifies the UX patterns and anti-patterns that govern all user-facing interfaces in the GTM Kernel. These principles apply to the onboarding wizard, kernel detail pages, dashboards, and any future UI surfaces.

---

## 1. Input Patterns

### Text Fields

- **No helper text below text fields.** All contextual guidance belongs inside the field as `placeholder` text. Helper text rendered below the input creates visual noise, competes with the field label, and is easily missed on mobile.
- **Voice + text as first-class input.** All free-form text fields use `VoiceTextArea` with the Whisper-powered mic icon. Users can type or dictate — both are equal-status input methods.
- **Comma-separated for multi-value entry.** When a field accepts multiple values (e.g., founders, investors, aliases), use a single text input with comma separation. Do NOT use tag/chip bubbles, pill inputs with X buttons, or enter-to-add patterns.

### Selection Fields

- **Card-based selection over dropdowns.** All multi-option questions use `CardSelection` (rectangular cards with icon + label). Never use `<select>` dropdowns for categorical choices. The only exception is compact utility selectors like currency pickers where cards would be spatially wasteful.
- **"Other" option pattern.** Every card selection that could reasonably need a custom entry must include an "Other" card option (`{ value: 'other', label: 'Other', isOther: true }` in form-constants). When selected, a `VoiceTextArea` appears below the card grid for the custom entry. The custom text is stored in a separate `*_other` field.
- **Ranked selection for priority ordering.** When the order of selections matters (e.g., demand channels, closing motions), use `mode="ranked"` on `CardSelection`. This shows numbered badges and allows drag reordering.

### Numeric Fields

- **Exact numbers over ranges.** When precision matters for downstream calculations (e.g., employee count, revenue), use numeric text inputs with comma formatting — not range pickers or dropdowns. Use `inputMode="numeric"` and strip non-digit characters on input.

---

## 2. Required Field Indicators

- **Red Lucide Asterisk icon.** Required fields are marked with a `<RequiredIndicator />` component rendering the Lucide `Asterisk` icon in `text-red-500` at `w-3.5 h-3.5` with `strokeWidth={2.5}`.
- **Never use text asterisks.** Do not append ` *` to label strings. Always use the icon component for visual consistency and prominence.
- **Section headers include indicators.** If an entire section is required (e.g., "Name & Location"), the section header also gets the `<RequiredIndicator />`.

---

## 3. Progressive Disclosure

- **Show essential fields first.** The most critical fields for a section appear immediately. Secondary fields live behind "More Details" expandable sections.
- **Conditional reveal based on selections.** Fields that only apply to certain choices (e.g., "Investors" only shows when ownership type is "Venture-Backed" or "PE-Owned") appear conditionally.

---

## 4. Contextual Guidance

- **"Why this matters" callout at the top of each section.** Every wizard step opens with a dismissible callout box explaining why this information matters for the GTM Kernel's research agents. Uses `bg-hurricane-sky/10` styling with an X button to dismiss.
- **Placeholders over hints.** Field-level guidance lives in the `placeholder` prop, not in hint text below the field.

---

## 5. Banned Patterns

| Pattern | Why It's Banned |
|---------|----------------|
| Tag/chip bubbles with X buttons | Dated UX, poor mobile experience, hard to click small X targets |
| Pill-shaped inputs with remove buttons | Same problems as chips, plus inconsistent sizing |
| Enter-to-add multi-value input | Non-standard expectation, no visual affordance, confusing for non-technical users |
| Helper text below text fields | Competes with label, easily missed, creates visual noise |
| `<select>` dropdowns for categorical choices | Low information density, hides options, poor for discovery |
| Text asterisks for required fields | Too subtle, easily missed — users report not seeing them |
| Hover-only edit icons | Undiscoverable on mobile, violates touch-first principle |

---

## 6. Dynamic Row Patterns

For structured multi-entry fields (executives, thought leaders, social links):
- Each entry is a row with labeled input fields side-by-side
- Rows can be added via `+ Add [Type]` button (styled with `text-hurricane-sky border-hurricane-sky`)
- Rows can be removed via `Trash2` icon button (except fixed/required rows)
- Pre-populated rows with default titles (e.g., "Founder", "CEO") do not have delete buttons

---

## 7. Motion & Animation

- **Framer Motion** for all UI transitions and data visualization animations
- **Show, don't tell** — use animation to communicate data relationships (e.g., benchmark comparison bars)
- **Performance first** — animations should enhance, never block interaction
- See `docs/tsc-brand-kit/motion-graphics-docs/` for detailed specs
