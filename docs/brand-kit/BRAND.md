# TSC Brand Design System

This brand kit contains the core visual identity for The Starr Conspiracy projects. Drop these files into any Next.js/Tailwind project to achieve a consistent look and feel.

---

## Quick Start

1. **Copy `tailwind.brand.cjs`** colors into your `tailwind.config.js` theme.extend.colors
2. **Import `brand.css`** in your global styles (after Tailwind directives)
3. **Copy `logos/`** folder to your `public/images/` directory
4. **Use Inter font** from Google Fonts

```html
<!-- Add to your HTML head or Next.js layout -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Color Palette

### Primary Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Atomic Tangerine** | `#FF5910` | `--color-atomic-tangerine` | Primary CTAs, links, accents |
| **Heart of Darkness** | `#141213` | `--color-heart-of-darkness` | Primary text, dark backgrounds |

### Secondary Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Neon Cactus** | `#E1FF00` | `--color-neon-cactus` | Highlights, text selection |
| **Tidal Wave** | `#73F5FF` | `--color-tidal-wave` | Cool accent, data visualization |
| **Fing Peachy** | `#FFBDAE` | `--color-fing-peachy` | Soft accent, backgrounds |
| **Sprinkles** | `#ED0AD2` | `--color-sprinkles` | Bright magenta accent |
| **Moody Sprinkles** | `#b2079e` | `--color-moody-sprinkles` | Deep magenta variant |

### Tertiary Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Hot Sauce** | `#BD3A00` | `--color-hot-sauce` | Hover states for Atomic Tangerine |
| **Jurassic Fern** | `#6B920D` | `--color-jurassic-fern` | Success states, nature themes |
| **Hurricane Sky** | `#088BA0` | `--color-hurricane-sky` | Teal accent |
| **Hurricane Dark** | `#066271` | `--color-hurricane-dark` | Dark teal variant |

### Neutrals

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Shroomy** | `#d1d1c6` | `--color-shroomy` | Borders, dividers |
| **Shroomy Light** | `#F1F1EE` | `--color-shroomy-light` | Page backgrounds |
| **Greige** | `#6D6D69` | `--color-greige` | Body text, secondary text |

### Color Usage Guidelines

- **Backgrounds:** Use `shroomy-light` (#F1F1EE) as the default page background
- **Primary Text:** Use `heart-of-darkness` (#141213) for headings and important text
- **Body Text:** Use `greige` (#6D6D69) for paragraphs and secondary content
- **Links & CTAs:** Use `atomic-tangerine` (#FF5910), darken to `hot-sauce` on hover
- **Text Selection:** Use `neon-cactus` at 40% opacity

---

## Typography

### Font Family

**Inter** - A clean, modern sans-serif optimized for screens. This is the only font used across all TSC projects.

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Technical Setup

| Property | Value |
|----------|-------|
| **Loaded via** | `next/font/google` in layout.tsx |
| **CSS Variable** | `--font-inter` |
| **Display strategy** | `swap` (shows fallback immediately, then swaps) |
| **Features enabled** | Kerning + ligatures |
| **Fallback stack** | System fonts (Apple, Windows, etc.) |

### Font Features

Enable these OpenType features for refined typography:

```css
font-feature-settings: "kern" 1, "liga" 1;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Usage by Element

| Element | Font | Weight | Size (Tailwind) |
|---------|------|--------|-----------------|
| **H1** | Inter | Bold (700) | `text-4xl` → `text-7xl` |
| **H2** | Inter | Semibold (600) | `text-3xl` → `text-4xl` |
| **H3** | Inter | Semibold (600) | `text-2xl` → `text-3xl` |
| **H4-H6** | Inter | Semibold (600) | `text-xl` → `text-2xl` |
| **Body text** | Inter | Regular (400) | Base size, `leading-relaxed` |
| **Navigation** | Inter | Medium (500) | `text-sm` |
| **Buttons** | Inter | Medium (500) | — |
| **Form labels** | Inter | Medium (500) | — |

### Type Scale (Detailed)

| Element | Mobile | Desktop | Weight | Tracking |
|---------|--------|---------|--------|----------|
| **H1** | 2.25rem (36px) | 4.5rem (72px) | 700 (bold) | -0.025em (tight) |
| **H2** | 1.875rem (30px) | 2.25rem (36px) | 600 (semibold) | -0.025em (tight) |
| **H3** | 1.5rem (24px) | 1.875rem (30px) | 600 (semibold) | -0.025em (tight) |
| **H4** | 1.25rem (20px) | 1.5rem (24px) | 600 (semibold) | normal |
| **Body** | 1rem (16px) | 1rem (16px) | 400 (normal) | normal |
| **Large Body** | 1.125rem (18px) | 1.125rem (18px) | 400 (normal) | normal |

### Line Height

- **Headings:** 1.1 (tight)
- **Body text:** 1.625 (relaxed / `leading-relaxed`)

---

## Spacing

### Section Padding

```css
/* Standard section vertical padding */
padding-top: 4rem;      /* 64px - mobile */
padding-bottom: 4rem;
padding-top: 6rem;      /* 96px - desktop (md breakpoint) */
padding-bottom: 6rem;
```

### Container Widths

| Class | Max Width | Padding | Use Case |
|-------|-----------|---------|----------|
| `.container-narrow` | 48rem (768px) | 1rem / 1.5rem | Blog posts, focused content |
| `.container-wide` | 80rem (1280px) | 1rem / 1.5rem / 2rem | Full layouts, feature sections |

### Common Spacing Values

- **Gap (cards/grids):** 1.5rem (24px)
- **Gap (buttons):** 1rem (16px)
- **Component padding:** 1.5rem (24px)
- **Input padding:** 0.75rem vertical, 1rem horizontal

---

## Components

### Buttons

**Primary Button**
- Background: `atomic-tangerine` (#FF5910)
- Text: white
- Hover: `hot-sauce` (#BD3A00)
- Border radius: 0.5rem (8px)
- Padding: 0.75rem 1.5rem (12px 24px)
- Font weight: 500 (medium)
- Focus: 2px ring in `atomic-tangerine` with 2px offset

**Secondary Button**
- Background: white
- Text: `heart-of-darkness` (#141213)
- Border: 2px solid `heart-of-darkness`
- Hover background: `shroomy-light` (#F1F1EE)
- Border radius: 0.5rem (8px)
- Padding: 0.75rem 1.5rem (12px 24px)
- Font weight: 500 (medium)

### Cards

- Background: white
- Border: 1px solid `shroomy` (#d1d1c6)
- Border radius: 0.75rem (12px)
- Padding: 1.5rem (24px)
- Shadow: 0 1px 2px rgba(0,0,0,0.05)
- Hover shadow: 0 4px 6px rgba(0,0,0,0.1)

### Input Fields

- Background: white
- Border: 1px solid `shroomy` (#d1d1c6)
- Border radius: 0.5rem (8px)
- Padding: 0.75rem 1rem (12px 16px)
- Focus: 2px ring in `atomic-tangerine`, border transparent
- Placeholder: `greige` at 60% opacity

### Labels

- Font size: 0.875rem (14px)
- Font weight: 500 (medium)
- Color: `greige` (#6D6D69)
- Margin bottom: 0.5rem (8px)

### Form Input Standards

#### BANNED Patterns

The following patterns are explicitly **prohibited** in all TSC projects:

| Pattern | Why It's Banned | Use Instead |
|---------|-----------------|-------------|
| **Tag/Chip Bubbles** | Visually dated (90's pattern), confusing remove behavior | Comma-separated text |
| **Pill-shaped inputs with X buttons** | Requires precise clicking, poor mobile UX | Plain text input |
| **Enter-to-add multi-value** | Non-standard, users expect Enter = submit | Comma-separated text |

#### Multi-Value Input Pattern

For fields that accept multiple values (names, companies, tags), use comma-separated text inputs:

**DO use:**
```tsx
<Input
  label="Founders"
  placeholder="Jane Doe, John Smith, Alex Wong"
  value={values.join(', ')}
  onChange={(e) => {
    const parsed = e.target.value
      .split(',')
      .map(v => v.trim())
      .filter(v => v);
    setValues(parsed);
  }}
  hint="Separate multiple entries with commas"
/>
```

**DO NOT use:**
```tsx
// BANNED - Do not use chip/bubble patterns
<MultiEntryInput
  value={values}
  onChange={setValues}
  placeholder="Press Enter to add"
/>
```

#### Why Comma-Separated Text

1. **Familiar** - Users understand commas as separators (email CC, CSV, etc.)
2. **Editable** - Easy to fix typos without removing/re-adding
3. **Copy-Paste Friendly** - Users can paste comma-separated lists directly
4. **Mobile Friendly** - No tiny X buttons to tap
5. **Accessible** - Standard text input with full keyboard support

#### Parsing Rules

When parsing comma-separated input:
1. Split on commas
2. Trim whitespace from each value
3. Filter out empty strings
4. Preserve order (first item may be "primary")

```typescript
const parseCommaSeparated = (input: string): string[] => {
  return input
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);
};

const formatCommaSeparated = (values: string[]): string => {
  return values.join(', ');
};
```

### Data Cards (List Items)

For displaying lists of data items (queries, JTBD, etc.):

- Background: white
- Border: 1px solid `shroomy` (#d1d1c6)
- Border radius: 0.5rem (8px) for list items, 0.75rem (12px) for larger cards
- Padding: 0.75rem (12px) for compact, 1.25rem (20px) for spacious
- Shadow: `shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
- **Hover state:** `shadow-md` + `border-atomic-tangerine`
- Transition: `transition` (all properties)

```tsx
className="rounded-lg bg-white border border-shroomy p-3 shadow-sm hover:shadow-md hover:border-atomic-tangerine transition"
```

### Segmented Controls (Toggle Buttons)

For filter toggles and view switchers:

- Container: `rounded-lg border border-shroomy bg-white overflow-hidden`
- **Active button:** `bg-atomic-tangerine text-white`
- **Inactive button:** `text-greige hover:text-heart-of-darkness hover:bg-shroomy-light`
- Transition: `transition-colors`

```tsx
<div className="flex rounded-lg border border-shroomy bg-white overflow-hidden">
  <button className={active ? "bg-atomic-tangerine text-white" : "text-greige hover:bg-shroomy-light"}>
    Option A
  </button>
  <button className={!active ? "bg-atomic-tangerine text-white" : "text-greige hover:bg-shroomy-light"}>
    Option B
  </button>
</div>
```

### Status Badges

Semantic color coding for inline status indicators:

| Status | Background | Text | Border |
|--------|------------|------|--------|
| **Success / Has** | `bg-green-50` | `text-green-700` | `border-green-200` |
| **Error / None** | `bg-red-50` | `text-red-600` | `border-red-200` |
| **Client-owned** | `bg-blue-50` | `text-blue-600` | `border-blue-200` |
| **Competitor-owned** | `bg-amber-50` | `text-amber-700` | `border-amber-200` |
| **AI / Special** | `bg-purple-50` | `text-purple-600` | `border-purple-200` |
| **Neutral / Info** | `bg-shroomy-light` | `text-greige` | `border-shroomy` |

```tsx
// Success badge
<span className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
  Citations
</span>

// Error badge
<span className="px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
  No citations
</span>
```

### Kernel Field Status Indicators

On the dark-background kernel UI, field cards use **domain-colored** indicators instead of semantic amber/green badges. The domain color is a hex string provided per-component (e.g., `#088BA0` for Product, `#6B920D` for Radical Buyer). See `domain-colors.ts` for the full mapping.

#### "Needs Input" Pill

When a field has no value, display a domain-colored pill:

- Background: domain color at ~12% opacity (hex suffix `20`)
- Text: full domain color
- Classes: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap`
- Always use `whitespace-nowrap` to prevent wrapping in compact layouts

```tsx
<span
  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
  style={{ backgroundColor: `${domainColor}20`, color: domainColor }}
>
  Needs Input
</span>
```

#### "Has Value" Checkmark

When a field has a value, show a green checkmark icon:

- Icon: `CheckCircle2` from Lucide
- Classes: `w-4 h-4 text-green-400`
- Always visible (no hover behavior)

```tsx
<CheckCircle2 className="w-4 h-4 text-green-400" />
```

#### Edit / Action Icons

Pencil (edit) and RefreshCw (re-extract) icons on field cards:

- **Always visible** — never use `opacity-0 group-hover:opacity-100` on kernel field action icons
- Color: full domain color via inline `style={{ color: domainColor }}`
- Size: `w-3.5 h-3.5`, stroke width 1.5
- Button wrapper: `p-1 rounded hover:bg-white/5 transition-opacity`

```tsx
<Pencil className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: domainColor }} />
```

### Tooltips

Hover tooltips for explaining UI elements:

- Background: white
- Border: 1px solid `shroomy` (#d1d1c6)
- Border radius: 0.5rem (8px)
- Padding: 0.5rem 0.75rem (8px 12px)
- Text: `text-xs text-greige`
- Shadow: `shadow-lg`
- Position: Centered above trigger element
- Z-index: 50
- Includes triangular pointer using CSS borders

```tsx
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white border border-shroomy rounded-lg text-xs text-greige whitespace-nowrap shadow-lg">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-shroomy" />
        </div>
      )}
    </div>
  );
}
```

### Stat Cards

For displaying key metrics with tooltips:

- Background: white
- Border: 1px solid `shroomy`, hover: `border-atomic-tangerine`
- Border radius: 0.75rem (12px)
- Padding: 1rem (16px)
- Shadow: `shadow-sm`, hover: `shadow-md`
- Value text: `text-2xl font-semibold text-atomic-tangerine`
- Label text: `text-sm text-greige`
- Cursor: `cursor-help` (indicates tooltip available)

```tsx
<Tooltip content="Explanation of this metric.">
  <div className="rounded-xl border border-shroomy bg-white p-4 text-center shadow-sm hover:shadow-md hover:border-atomic-tangerine transition cursor-help">
    <div className="text-2xl font-semibold text-atomic-tangerine">42</div>
    <div className="text-sm text-greige mt-1">Metric Name</div>
  </div>
</Tooltip>
```

---

## Modal/Overlay Pattern

For drill-down detail views and modal dialogs:

### Modal Structure

```
┌─────────────────────────────────────────────┐
│ [Dark Header: bg-heart-of-darkness]         │
│  Brand identifier (orange) + Title (white)  │
│  Action buttons (white, right-aligned)      │
├─────────────────────────────────────────────┤
│ [White Body: bg-white]                      │
│  Content area with tabs, cards, etc.        │
└─────────────────────────────────────────────┘
```

### Header Styling

- Background: `bg-heart-of-darkness`
- Brand identifier: `text-atomic-tangerine text-xs font-semibold tracking-[0.2em]`
- Title: `text-white text-lg font-semibold`
- Border: `border-b border-shroomy`

### Action Buttons (in dark header)

All buttons should be uniform size and styling:

```tsx
// Consistent action buttons
<button className="rounded-lg border border-shroomy bg-white w-16 py-2 text-xs text-center text-heart-of-darkness hover:border-atomic-tangerine transition">
  Action
</button>
```

- Fixed width: `w-16` (ensures uniform size)
- Small text: `text-xs`
- Centered: `text-center`
- White background on dark header
- Orange border on hover

### Overlay Backdrop

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
```

---

## Multi-Level Drill-Down Pattern

For progressive disclosure of data (list → detail → sub-detail):

### Level 1: List View (Cards)

Standard card grid showing items with key metrics:

```tsx
<div className="rounded-xl border border-shroomy bg-white p-4 shadow-sm hover:shadow-md hover:border-atomic-tangerine transition cursor-pointer">
  {/* Score badge top-right */}
  {/* Title */}
  {/* Key metrics row */}
  {/* Preview content */}
</div>
```

### Level 2: Modal Overlay

Full detail view with tabbed navigation:

- Dark header with title and actions
- Tab navigation below header
- Score badge visible on all tabs
- Contextual explanation for each tab
- Content area with cards/tables

### Level 3: Nested Panels

Sub-panels within Level 2 (e.g., citations within questions):

```tsx
<div className="rounded-xl border border-shroomy bg-white p-4">
  <div className="flex items-center justify-between mb-3">
    <div>
      <div className="text-xs text-greige uppercase tracking-[0.08em]">Panel Title</div>
      <div className="text-sm text-heart-of-darkness">{subtitle}</div>
    </div>
    <button className="text-xs px-2 py-1 rounded border border-shroomy text-heart-of-darkness hover:border-atomic-tangerine">
      Close
    </button>
  </div>
  {/* Panel content */}
</div>
```

### Visual Hierarchy

| Level | Background | Border Radius | Shadow |
|-------|------------|---------------|--------|
| 1 (List cards) | `bg-white` | `rounded-xl` | `shadow-sm` → `shadow-md` on hover |
| 2 (Modal) | `bg-white` | `rounded-2xl` | `shadow-2xl` |
| 3 (Nested) | `bg-white` | `rounded-xl` | none (inherits from parent) |

---

## Score/Rating Badges

For displaying numerical scores with classification:

### Score Classifications

| Range | Label | Background | Text Color |
|-------|-------|------------|------------|
| 80-100 | Excellent | `bg-green-100` | `text-green-700` |
| 60-79 | Good | `bg-blue-100` | `text-blue-700` |
| 40-59 | Marginal | `bg-amber-100` | `text-amber-700` |
| <40 | Weak | `bg-red-100` | `text-red-700` |

### Badge Implementation

```tsx
function getScoreClass(score: number) {
  if (score >= 80) return { label: "Excellent", color: "text-green-700", bgColor: "bg-green-100" };
  if (score >= 60) return { label: "Good", color: "text-blue-700", bgColor: "bg-blue-100" };
  if (score >= 40) return { label: "Marginal", color: "text-amber-700", bgColor: "bg-amber-100" };
  return { label: "Weak", color: "text-red-700", bgColor: "bg-red-100" };
}

// Usage
<div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${scoreClass.bgColor}`}>
  <span className={`text-lg font-bold ${scoreClass.color}`}>{score.toFixed(1)}</span>
  <span className={`text-sm font-medium ${scoreClass.color}`}>{scoreClass.label}</span>
</div>
```

### Placement

- **List cards:** Top-right corner of card
- **Detail modals:** Right side of tab navigation row
- **Persists across all tabs** to maintain context

---

## Contextual Explanation Boxes

For AI-generated or dynamic explanations that help users understand data:

### Styling

```tsx
<div className="mb-4 p-3 bg-shroomy-light border border-shroomy rounded-lg">
  <p className="text-sm text-heart-of-darkness">{explanation}</p>
</div>
```

### Guidelines

- Place below navigation, above content
- Keep explanations to 1-2 sentences
- Change dynamically based on:
  - Which tab is active
  - The actual data values
  - Score ranges
- Should answer "What does this mean?" and "Why should I care?"

### Example Patterns

| Context | Explanation Focus |
|---------|-------------------|
| **Overview tab** | Overall opportunity assessment, key numbers |
| **Competitors tab** | Whether landscape favors user |
| **Scoring tab** | What drives the score, areas to improve |
| **Questions tab** | How to use the data, what actions to take |

---

## Tab Navigation Pattern

For switching between views within a detail panel:

### Tab Styling

```tsx
<div className="flex items-center justify-between mb-4 flex-wrap gap-3">
  <div className="flex flex-wrap gap-2">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActive(tab)}
        className={`px-3 py-1 rounded-lg text-sm ${
          active === tab
            ? "bg-shroomy-light text-heart-of-darkness border border-shroomy"
            : "text-greige"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
  {/* Score badge goes here, right-aligned */}
</div>
```

### States

| State | Background | Text | Border |
|-------|------------|------|--------|
| Active | `bg-shroomy-light` | `text-heart-of-darkness` | `border border-shroomy` |
| Inactive | transparent | `text-greige` | none |
| Hover (inactive) | — | `text-heart-of-darkness` | — |

---

## Rich Tooltip Pattern

For explaining complex metrics or terminology:

### Dark Tooltip (for score dimensions, complex data)

```tsx
<div
  className="group relative cursor-help"
  title={description}
>
  <span>{label}</span>
  {description && (
    <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-heart-of-darkness text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
      {description}
    </div>
  )}
</div>
```

### When to Use Which Tooltip

| Type | Background | Use Case |
|------|------------|----------|
| **Light** (existing) | `bg-white border-shroomy` | Simple labels, stat cards |
| **Dark** | `bg-heart-of-darkness text-white` | Complex explanations, scoring dimensions |

---

## Data Visualization: Radar/Spider Charts

For multi-dimensional scoring displays:

### Chart.js Configuration (Light Background)

```typescript
const options = {
  responsive: true,
  scales: {
    r: {
      beginAtZero: true,
      suggestedMax: 5,
      ticks: {
        display: true,
        stepSize: 1,
        color: "#6b7280",          // Greige-ish
        backdropColor: "transparent",
        font: { size: 10 }
      },
      grid: { color: "rgba(0,0,0,0.1)" },      // Light grid for white bg
      angleLines: { color: "rgba(0,0,0,0.1)" },
      pointLabels: { color: "#374151", font: { size: 11, weight: 500 } },
    },
  },
  plugins: {
    legend: { display: false },
  },
};
```

### Dataset Styling (Brand Colors)

```typescript
{
  backgroundColor: "rgba(255, 127, 80, 0.15)",  // Atomic tangerine @ 15%
  borderColor: "#ff7f50",                       // Coral (atomic tangerine variant)
  borderWidth: 2,
  pointBackgroundColor: "#ff7f50",
}
```

### Important Notes

- **Dark theme charts** use `rgba(255,255,255,0.08)` for grids
- **Light theme charts** use `rgba(0,0,0,0.1)` for grids
- Always show scale labels for accessibility (`ticks.display: true`)

---

## Border Radius Scale

| Size | Value | Use Case |
|------|-------|----------|
| Small | 0.5rem (8px) | Buttons, inputs, small elements |
| Medium | 0.75rem (12px) | Cards, dropdowns |
| Large | 1rem (16px) | Modal dialogs, large containers |
| XL | 1.25rem (20px) | Hero sections, feature cards |

---

## Shadows

| Name | Value | Use Case |
|------|-------|----------|
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Cards, subtle elevation |
| `shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Hover states, dropdowns |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Modals, popovers |

---

## Product Naming Convention

### Multi-Word Product Names

When displaying product names with multiple words, use **alternating color styling** to create visual interest and brand consistency. The middle word (typically the key differentiator) should be in **Atomic Tangerine** (#FF5910), while surrounding words are in **Heart of Darkness** (#141213).

**Pattern:** `[Black] [Orange] [Black]`

### Examples

| Product | Styling |
|---------|---------|
| **AI GTM Engine** | "AI" (black) + "GTM" (orange) + "Engine" (black) |
| **Answer Engine Optimization** | "Answer" (black) + "Engine" (orange) + "Optimization" (black) |

### Implementation

```tsx
// React/Next.js example
<span className="text-heart-of-darkness">AI</span>
{" "}
<span className="text-atomic-tangerine">GTM</span>
{" "}
<span className="text-heart-of-darkness">Engine</span>
```

```html
<!-- HTML/CSS example -->
<span style="color: #141213">Answer</span>
<span style="color: #FF5910">Engine</span>
<span style="color: #141213">Optimization</span>
```

### Logo + Product Name Pairing

When pairing the logo with a product name:
1. Use the **ocho-color.png** (octopus) logo at 24-32px for headers
2. Place the product name to the right of the logo
3. Apply the alternating color convention to the product name
4. Use `font-semibold` (600 weight) for the product name

```tsx
<div className="flex items-center gap-2">
  <Image src="/images/ocho-color.png" alt="TSC" width={28} height={28} />
  <span className="text-sm font-semibold">
    <span className="text-heart-of-darkness">AI</span>
    {" "}
    <span className="text-atomic-tangerine">GTM</span>
    {" "}
    <span className="text-heart-of-darkness">Engine</span>
  </span>
</div>
```

---

## Iconography

### Icon Library

**Lucide React** — A clean, consistent icon library with elegant line icons.

```bash
npm install lucide-react
```

### Style Specifications

| Property | Value | Notes |
|----------|-------|-------|
| **Stroke width** | `1.5` | Thin strokes for sophistication |
| **Size** | `24px` (`w-6 h-6`) | Standard UI icon size |
| **Default color** | `greige` (#6D6D69) | Subtle, understated |
| **Hover color** | `atomic-tangerine` (#FF5910) | Brand accent on interaction |
| **Transition** | `transition-colors` | Smooth color change |

### Implementation

```tsx
import { Crosshair } from "lucide-react";

// Basic usage
<Crosshair className="w-6 h-6 text-greige" strokeWidth={1.5} />

// With hover effect (using Tailwind group)
<Link className="group ...">
  <Crosshair
    className="w-6 h-6 text-greige group-hover:text-atomic-tangerine transition-colors"
    strokeWidth={1.5}
  />
</Link>
```

### Standard Icon Set

Use these icons for consistent meaning across TSC applications:

| Concept | Icon | Lucide Name | Usage |
|---------|------|-------------|-------|
| **Targeting / Focus** | ⊕ | `Crosshair` | JTBD, demand territories, precision targeting |
| **Search / Discovery** | 🔍 | `Search` | Questions, queries, exploration |
| **Citations / Sources** | ❝ | `Quote` | References, AI sources, citations |
| **Analytics / Market** | 📊 | `BarChart3` | Market data, competitive landscape |
| **Community / People** | 👥 | `Users` | Forums, community signals, audiences |
| **Insights / Ideas** | ✨ | `Sparkles` | Recommendations, AI insights, suggestions |
| **Trends / Activity** | 📈 | `Activity` | Tracking, evolution, time-series data |
| **Settings / System** | ⚙ | `Settings` | Operations, configuration, system health |
| **Navigation / Menu** | ☰ | `Menu` | Mobile nav, hamburger menu |
| **Close / Dismiss** | ✕ | `X` | Close modals, dismiss notifications |
| **Info / Help** | ⓘ | `Info` | Tooltips, help text, information |
| **Success / Check** | ✓ | `Check` | Completed, success states |
| **Warning / Alert** | ⚠ | `AlertTriangle` | Warnings, attention needed |
| **Error** | ⊘ | `XCircle` | Errors, failed states |
| **External Link** | ↗ | `ExternalLink` | Links opening in new tab |
| **Download** | ↓ | `Download` | Export, download actions |
| **Filter** | ≡ | `Filter` | Filtering, sorting options |
| **Calendar / Date** | 📅 | `Calendar` | Date pickers, scheduling |
| **Refresh / Sync** | ↻ | `RefreshCw` | Refresh data, sync status |

### Size Variants

| Context | Size | Tailwind | strokeWidth |
|---------|------|----------|-------------|
| **Inline with text** | 16px | `w-4 h-4` | 1.5 |
| **Standard UI** | 24px | `w-6 h-6` | 1.5 |
| **Feature cards** | 32px | `w-8 h-8` | 1.25 |
| **Hero / Empty states** | 48px | `w-12 h-12` | 1 |

### Color States

| State | Color | Tailwind Class |
|-------|-------|----------------|
| **Default** | Greige (#6D6D69) | `text-greige` |
| **Hover** | Atomic Tangerine (#FF5910) | `text-atomic-tangerine` |
| **Active / Selected** | Atomic Tangerine (#FF5910) | `text-atomic-tangerine` |
| **Disabled** | Shroomy (#d1d1c6) | `text-shroomy` |
| **Success** | Jurassic Fern (#6B920D) | `text-jurassic-fern` |
| **Error** | Hot Sauce (#BD3A00) | `text-hot-sauce` |

### Do's and Don'ts

**Do:**
- Use consistent stroke width (1.5) across all icons
- Apply hover transitions for interactive icons
- Use greige as the default color for understated elegance
- Match icon meaning to the standard set above

**Don't:**
- Mix filled and outlined icon styles
- Use emoji icons (🎯 ❓ 💡) in production UI
- Use different stroke weights in the same view
- Make icons the primary visual focus (they should support, not dominate)

---

## Logo Assets

### Available Logos

| File | Description | Best Use |
|------|-------------|----------|
| `ocho-color.png` | Primary logo in brand orange | Headers, favicons |
| `ocho-black.png` | Black monochrome version | Light backgrounds, print |
| `ocho-full.png` | Full colored logo | Hero sections, about pages |
| `ocho-bish.png` | Alternative variant | Special applications |
| `tsc-wordmark-positive.png` | "The Starr Conspiracy" text | Light backgrounds |
| `tsc-wordmark-reversed.png` | "The Starr Conspiracy" text | Dark backgrounds |
| `tsc-logo-positive.png` | TSC mark only | Compact spaces |

### Logo Sizing

- **Header:** 32x32px (small mark)
- **Footer:** 32x32px mark + wordmark
- **Hero/Feature:** Responsive, max 200px width

---

## Favicon Setup

### Required Favicon Assets

Generate these assets from `ocho-color.png` for all web projects:

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 32x32 | Browser tab icon |
| `apple-touch-icon.png` | 180x180 | iOS home screen bookmark |

### Generation Methods

**Option 1: macOS Command Line (sips)**

```bash
cd public
sips -z 32 32 ../path/to/ocho-color.png -s format ico --out favicon.ico
sips -z 180 180 ../path/to/ocho-color.png --out apple-touch-icon.png
```

**Option 2: Online Generator**

Use [favicon.io](https://favicon.io/favicon-converter/) or [realfavicongenerator.net](https://realfavicongenerator.net/):
1. Upload `logos/ocho-color.png`
2. Download the generated favicon package
3. Extract `favicon.ico` and `apple-touch-icon.png` to your `public/` directory

**Option 3: ImageMagick**

```bash
magick ocho-color.png -resize 32x32 favicon.ico
magick ocho-color.png -resize 180x180 apple-touch-icon.png
```

### Framework Integration

#### Next.js (App Router)

Place favicon files in `/public/` root, then update `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your description",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
```

#### Plain HTML

Add to `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### Dark Mode Note

The `ocho-color.png` (orange octopus) works on both light and dark backgrounds due to its vibrant color. No alternate dark mode favicon is required.

---

## Links

### Default Link Style

- Color: `atomic-tangerine` (#FF5910)
- Hover color: `hot-sauce` (#BD3A00)
- Hover decoration: underline
- Transition: 150ms color ease

### Prose/Content Links

- Color: `atomic-tangerine` (#FF5910)
- No underline by default
- Hover: underline + `hot-sauce` color

---

## Text Selection

```css
::selection {
  background-color: rgba(225, 255, 0, 0.4); /* neon-cactus at 40% */
  color: #141213; /* heart-of-darkness */
}
```

---

## Tailwind Classes Reference

### Utility Classes (from brand.css)

| Class | Description |
|-------|-------------|
| `.container-narrow` | Centered container, max 768px |
| `.container-wide` | Centered container, max 1280px |
| `.btn-primary` | Orange primary button |
| `.btn-secondary` | White outlined button |
| `.card` | Standard card styling |
| `.input-field` | Form input styling |
| `.label-text` | Form label styling |
| `.section-padding` | Standard section vertical padding |
| `.prose-custom` | Styled prose/content area |

---

## Integration Checklist

- [ ] Add Inter font from Google Fonts
- [ ] Merge `tailwind.brand.cjs` colors into your Tailwind config
- [ ] Import `brand.css` after Tailwind directives
- [ ] Copy logos to your public directory
- [ ] **Generate favicon assets from `ocho-color.png`** (see Favicon Setup)
- [ ] **Add favicon metadata to layout/HTML head**
- [ ] Set page background to `shroomy-light`
- [ ] Apply `text-heart-of-darkness` to body
- [ ] Test buttons, cards, and inputs

---

## Framework Notes

### Next.js

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import './brand.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-shroomy-light text-heart-of-darkness">
        {children}
      </body>
    </html>
  )
}
```

### Plain HTML/CSS

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="brand.css">
```

---

*Brand kit created from The Starr Conspiracy's Answer Engine Optimization website.*
