# TSC Brand Kit - AI Application Instructions

**For Claude and other AI assistants:** Follow these steps to apply The Starr Conspiracy brand to this project.

---

## Quick Command

User can say: *"Apply the TSC brand from tsc-brand-kit to this project"*

---

## Step 1: Detect Project Type

Check for these files to determine the project type:

| File | Project Type |
|------|--------------|
| `next.config.js` or `next.config.mjs` or `next.config.ts` | Next.js |
| `vite.config.js` or `vite.config.ts` | Vite |
| `tailwind.config.js` or `tailwind.config.cjs` or `tailwind.config.ts` | Tailwind (any) |
| `package.json` with no framework | Plain Node/React |
| Only `index.html` | Plain HTML |

---

## Step 2: Install Inter Font

**Inter** is the only font used across all TSC projects.

### Font Weights Required

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text |
| 500 | Medium | Navigation, buttons, form labels |
| 600 | Semibold | H2-H6 headings |
| 700 | Bold | H1 headings |

### Next.js (App Router)
In the main layout file (`app/layout.tsx` or `app/layout.js`), add:

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

// In the html tag:
<html lang="en" className={inter.variable}>
```

### Next.js (Pages Router)
In `pages/_app.tsx` or `pages/_document.tsx`, add the Google Fonts link.

### Vite / Plain React / HTML
Add to `index.html` inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Step 3: Copy Brand Files

Copy these files from the brand kit to the project:

| Source | Destination |
|--------|-------------|
| `tsc-brand-kit/brand.css` | Project's styles folder (e.g., `app/brand.css`, `src/styles/brand.css`, or `styles/brand.css`) |
| `tsc-brand-kit/logos/*` | `public/images/` or `public/logos/` |

**Do NOT copy** `tailwind.brand.cjs` as a file - merge its contents instead (Step 5).

---

## Step 4: Set Up Favicons

Generate favicon assets from the octopus logo for browser tabs and mobile bookmarks.

### Generate Assets (macOS)

```bash
cd public
sips -z 32 32 images/ocho-color.png -s format ico --out favicon.ico
sips -z 180 180 images/ocho-color.png --out apple-touch-icon.png
```

Or use [favicon.io](https://favicon.io/favicon-converter/) to upload `ocho-color.png` and download the generated files.

### Add Metadata

#### Next.js (App Router)

In `app/layout.tsx`, add to the metadata export:

```tsx
export const metadata: Metadata = {
  // ...existing title, description
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

---

## Step 5: Install Icon Library

Use **Lucide React** for all UI icons. Never use emoji icons in production UI.

```bash
npm install lucide-react
```

### Icon Style

```tsx
import { Crosshair, Search, Quote } from "lucide-react";

// Standard icon usage
<Crosshair
  className="w-6 h-6 text-greige group-hover:text-atomic-tangerine transition-colors"
  strokeWidth={1.5}
/>
```

### Key Specs
- **Size:** 24px (`w-6 h-6`)
- **Stroke:** 1.5
- **Default color:** `text-greige`
- **Hover color:** `text-atomic-tangerine`

See BRAND.md "Iconography" section for the full standard icon set and usage guidelines.

---

## Step 6: Merge Tailwind Colors

Find the project's Tailwind config file and merge the brand colors into `theme.extend.colors`.

### Find the config:
- `tailwind.config.js`
- `tailwind.config.cjs`
- `tailwind.config.ts`
- `tailwind.config.mjs`

### Add these colors to `theme.extend.colors`:

```js
colors: {
  // Primary
  'atomic-tangerine': '#FF5910',
  'heart-of-darkness': '#141213',

  // Secondary
  'neon-cactus': '#E1FF00',
  'tidal-wave': '#73F5FF',
  'fing-peachy': '#FFBDAE',
  'sprinkles': '#ED0AD2',
  'moody-sprinkles': '#b2079e',

  // Tertiary
  'hot-sauce': '#BD3A00',
  'jurassic-fern': '#6B920D',
  'hurricane-sky': '#088BA0',
  'hurricane-dark': '#066271',

  // Neutrals
  'shroomy': '#d1d1c6',
  'shroomy-light': '#F1F1EE',
  'greige': '#6D6D69',

  // Semantic aliases
  brand: {
    primary: '#FF5910',
    dark: '#141213',
    accent: '#FF5910',
    highlight: '#E1FF00',
  },
}
```

**Important:** Preserve any existing colors in the config. Only add/merge, don't replace the entire colors object.

---

## Step 7: Import Brand CSS

Import `brand.css` AFTER Tailwind directives in the global stylesheet.

### Next.js (App Router)
In `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add this import at the end */
@import './brand.css';
```

Or import in `app/layout.tsx`:

```tsx
import './globals.css'
import './brand.css'  // Add this line
```

### Vite / Create React App
In `src/index.css` or `src/App.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './styles/brand.css';
```

### Plain HTML
```html
<link rel="stylesheet" href="brand.css">
```

---

## Step 8: Apply Base Classes

Update the root body element to use brand styles.

### Next.js (App Router)
In `app/layout.tsx`, update the body tag:

```tsx
<body className="bg-shroomy-light text-heart-of-darkness antialiased">
```

### Next.js (Pages Router)
In `pages/_app.tsx` or a global component, apply:

```tsx
<div className="bg-shroomy-light text-heart-of-darkness antialiased min-h-screen">
```

### Vite / React
In `App.tsx` or `main.tsx`:

```tsx
<div className="bg-shroomy-light text-heart-of-darkness antialiased min-h-screen">
```

### Plain HTML
```html
<body class="bg-shroomy-light text-heart-of-darkness antialiased">
```

---

## Step 9: Verify Installation

Run these checks:

1. **Build check:** Run `npm run build` or `yarn build` - should complete without errors
2. **Dev server:** Run `npm run dev` - site should load
3. **Visual check:** Page background should be off-white (#F1F1EE)
4. **Color check:** Add a test element with `className="bg-atomic-tangerine text-white p-4"` - should show orange
5. **Font check:** Text should render in Inter font

---

## Available Utility Classes

After installation, these classes are available:

| Class | Purpose |
|-------|---------|
| `.btn-primary` | Orange primary button |
| `.btn-secondary` | White outlined button |
| `.card` | Bordered card with shadow |
| `.input-field` | Styled form input |
| `.label-text` | Form label styling |
| `.container-narrow` | Max 768px centered container |
| `.container-wide` | Max 1280px centered container |
| `.section-padding` | Standard section spacing |
| `.prose-custom` | Styled content/article area |

---

## Color Reference

| Name | Hex | Tailwind Class |
|------|-----|----------------|
| Atomic Tangerine | `#FF5910` | `bg-atomic-tangerine`, `text-atomic-tangerine` |
| Heart of Darkness | `#141213` | `bg-heart-of-darkness`, `text-heart-of-darkness` |
| Neon Cactus | `#E1FF00` | `bg-neon-cactus`, `text-neon-cactus` |
| Tidal Wave | `#73F5FF` | `bg-tidal-wave`, `text-tidal-wave` |
| Fing Peachy | `#FFBDAE` | `bg-fing-peachy`, `text-fing-peachy` |
| Sprinkles | `#ED0AD2` | `bg-sprinkles`, `text-sprinkles` |
| Hot Sauce | `#BD3A00` | `bg-hot-sauce`, `text-hot-sauce` |
| Shroomy | `#d1d1c6` | `bg-shroomy`, `border-shroomy` |
| Shroomy Light | `#F1F1EE` | `bg-shroomy-light` |
| Greige | `#6D6D69` | `text-greige` |

---

## Troubleshooting

### Colors not working
- Ensure Tailwind config was saved
- Restart the dev server after config changes
- Check that colors are inside `theme.extend.colors`, not replacing it

### Styles not applying
- Verify `brand.css` is imported after Tailwind directives
- Check file path is correct
- Clear browser cache

### Font not loading
- Verify Inter font link/import is in place
- Check network tab for font loading errors

---

## Files in This Kit

- `CLAUDE.md` - This file (AI instructions)
- `BRAND.md` - Human-readable brand documentation (includes Favicon Setup guide)
- `tailwind.brand.cjs` - Color definitions for reference
- `brand.css` - CSS variables and utility classes
- `logos/` - Logo assets (7 files, including `ocho-color.png` for favicon generation)

---

## Advanced Patterns (Dashboard/Data Apps)

For data-heavy applications with drill-down UX, follow these additional patterns documented in BRAND.md:

### Multi-Level Drill-Down

| Level | Component | Pattern |
|-------|-----------|---------|
| 1 | List cards | White card, shroomy border, shadow-sm, hover:shadow-md |
| 2 | Modal overlay | Dark header (heart-of-darkness), white body, rounded-2xl |
| 3 | Nested panels | White card inside modal, same border styling |

### Modal Headers (Dark)

```tsx
<div className="bg-heart-of-darkness px-5 py-4 border-b border-shroomy">
  <div className="text-xs font-semibold tracking-[0.2em] text-atomic-tangerine">BRAND NAME</div>
  <div className="text-lg font-semibold text-white">{title}</div>
</div>
```

### Score Badges

| Score | Color | Classes |
|-------|-------|---------|
| 80+ | Green | `bg-green-100 text-green-700` |
| 60-79 | Blue | `bg-blue-100 text-blue-700` |
| 40-59 | Amber | `bg-amber-100 text-amber-700` |
| <40 | Red | `bg-red-100 text-red-700` |

### Contextual Explanation Boxes

```tsx
<div className="mb-4 p-3 bg-shroomy-light border border-shroomy rounded-lg">
  <p className="text-sm text-heart-of-darkness">{dynamicExplanation}</p>
</div>
```

### Tab Navigation

- Active: `bg-shroomy-light text-heart-of-darkness border border-shroomy rounded-lg`
- Inactive: `text-greige`
- Score badge: Right-aligned, persists across all tabs

### Rich Tooltips (Dark)

For explaining complex data:

```tsx
<div className="absolute bottom-full mb-2 w-64 p-2 bg-heart-of-darkness text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
  {description}
</div>
```

### Radar Charts (Light Background)

- Grid: `rgba(0,0,0,0.1)`
- Border: `#ff7f50` (coral/atomic-tangerine)
- Fill: `rgba(255, 127, 80, 0.15)`
- Show scale labels: `ticks.display: true`

See BRAND.md for full documentation on these patterns.

---

*TSC Brand Kit - The Starr Conspiracy*
