**Typography Cheat Sheet**  
The Starr Conspiracy  
Bret Starr  
*January 26, 2026*

Quick reference for consistent typography across all TSC properties.

\---

\#\# Font

\*\*Inter\*\* (Google Fonts) — the only font. No exceptions.

\`\`\`html  
\<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700\&display=swap" rel="stylesheet"\>  
\`\`\`

\---

\#\# Headings

| Element | Tailwind Classes | Weight | Use For |  
|---------|------------------|--------|---------|  
| \*\*H1\*\* | \`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight\` | 700 | Page titles, hero headlines |  
| \*\*H2\*\* | \`text-3xl md:text-4xl font-semibold tracking-tight\` | 600 | Section headers |  
| \*\*H3\*\* | \`text-2xl md:text-3xl font-semibold tracking-tight\` | 600 | Subsection headers |  
| \*\*H4\*\* | \`text-xl md:text-2xl font-semibold\` | 600 | Minor headers |

\*\*Line height for all headings:\*\* \`leading-tight\` (1.1)

\---

\#\# Body Text

| Type | Tailwind Classes | Use For |  
|------|------------------|---------|  
| \*\*Standard body\*\* | \`text-base text-greige leading-relaxed\` | Paragraphs, descriptions |  
| \*\*Large body\*\* | \`text-lg text-greige leading-relaxed\` | Intro paragraphs, emphasis |  
| \*\*Small text\*\* | \`text-sm text-greige\` | Captions, helper text |  
| \*\*Extra small\*\* | \`text-xs text-greige\` | Labels, metadata |

\---

\#\# Text Colors

| Color | Tailwind Class | Hex | When to Use |  
|-------|----------------|-----|-------------|  
| \*\*Heart of Darkness\*\* | \`text-heart-of-darkness\` | \#141213 | Headings, primary text, emphasis |  
| \*\*Greige\*\* | \`text-greige\` | \#6D6D69 | Body text, descriptions, secondary content |  
| \*\*Atomic Tangerine\*\* | \`text-atomic-tangerine\` | \#FF5910 | Links, CTAs, accent text |  
| \*\*Hot Sauce\*\* | \`text-hot-sauce\` | \#BD3A00 | Link hover states |  
| \*\*White\*\* | \`text-white\` | \#FFFFFF | Text on dark backgrounds |  
| \*\*Shroomy\*\* | \`text-shroomy\` | \#d1d1c6 | Subtle/muted text |

\---

\#\# UPPERCASE Rules

\*\*USE uppercase for:\*\*  
\- Navigation section labels  
\- "On this page" / TOC headers  
\- Footer column headers  
\- Brand identifiers in modal headers

\*\*Pattern:\*\* \`text-xs font-semibold uppercase tracking-wider\`

\*\*DO NOT use uppercase for:\*\*  
\- Headings (H1-H6)  
\- Body text  
\- Button labels  
\- Links  
\- Everything else

\---

\#\# Links

\`\`\`tsx  
// Standard link  
\<a className="text-atomic-tangerine hover:text-hot-sauce hover:underline transition-colors"\>

// Prose/content link (no underline by default)  
\<a className="text-atomic-tangerine no-underline hover:underline hover:text-hot-sauce transition-colors"\>  
\`\`\`

\---

\#\# Buttons

| Type | Text Classes |  
|------|--------------|  
| \*\*Primary\*\* | \`text-base font-medium text-white\` |  
| \*\*Secondary\*\* | \`text-base font-medium text-heart-of-darkness\` |  
| \*\*Small\*\* | \`text-sm font-medium\` |

\---

\#\# Navigation

| Element | Classes |  
|---------|---------|  
| \*\*Logo text\*\* | \`text-lg font-bold text-heart-of-darkness\` |  
| \*\*Nav links\*\* | \`text-sm font-medium text-greige hover:text-atomic-tangerine\` |  
| \*\*Dropdown title\*\* | \`text-sm font-medium text-heart-of-darkness\` |  
| \*\*Dropdown description\*\* | \`text-xs text-greige\` |  
| \*\*Section labels\*\* | \`text-xs font-semibold text-greige uppercase tracking-wider\` |

\---

\#\# Footer

| Element | Classes |  
|---------|---------|  
| \*\*Brand heading\*\* | \`text-xl font-bold text-white\` |  
| \*\*Column headers\*\* | \`text-sm font-semibold uppercase tracking-wider text-shroomy\` |  
| \*\*Links\*\* | \`text-shroomy hover:text-white\` |  
| \*\*Copyright\*\* | \`text-sm text-shroomy\` |

\---

\#\# Cards & Components

| Element | Classes |  
|---------|---------|  
| \*\*Card title\*\* | \`text-xl font-semibold text-heart-of-darkness\` |  
| \*\*Card description\*\* | \`text-greige\` or \`text-sm text-greige\` |  
| \*\*Stat value\*\* | \`text-2xl font-semibold text-atomic-tangerine\` |  
| \*\*Stat label\*\* | \`text-sm text-greige\` |  
| \*\*Badge/tag text\*\* | \`text-xs font-medium\` |

\---

\#\# Form Elements

| Element | Classes |  
|---------|---------|  
| \*\*Label\*\* | \`text-sm font-medium text-greige\` |  
| \*\*Input text\*\* | \`text-base text-heart-of-darkness\` |  
| \*\*Placeholder\*\* | \`placeholder:text-greige/60\` |  
| \*\*Helper text\*\* | \`text-xs text-greige\` |  
| \*\*Error text\*\* | \`text-xs text-hot-sauce\` |

\---

\#\# Special Effects

\#\#\# Gradient Text (for hero emphasis)  
\`\`\`tsx  
\<span className="bg-gradient-to-r from-atomic-tangerine via-hot-sauce to-sprinkles bg-clip-text text-transparent"\>  
\`\`\`

\#\#\# Product Name Coloring  
Middle word in orange, surrounding words in dark:  
\`\`\`tsx  
\<span className="text-heart-of-darkness"\>Answer\</span\>  
{" "}  
\<span className="text-atomic-tangerine"\>Engine\</span\>  
{" "}  
\<span className="text-heart-of-darkness"\>Optimization\</span\>  
\`\`\`

\---

\#\# Quick Copy-Paste

\`\`\`tsx  
// Page title (H1)  
className="text-4xl md:text-5xl lg:text-6xl font-bold text-heart-of-darkness tracking-tight"

// Section header (H2)  
className="text-3xl md:text-4xl font-semibold text-heart-of-darkness tracking-tight"

// Subsection header (H3)  
className="text-2xl md:text-3xl font-semibold text-heart-of-darkness tracking-tight"

// Body paragraph  
className="text-greige leading-relaxed"

// Large intro text  
className="text-xl text-greige leading-relaxed"

// Section label (uppercase)  
className="text-xs font-semibold text-greige uppercase tracking-wider"

// Standard link  
className="text-atomic-tangerine hover:text-hot-sauce hover:underline transition-colors"  
\`\`\`

\---

\*Reference: \[BRAND.md\](tsc-brand-kit/BRAND.md) for complete brand guidelines\*

