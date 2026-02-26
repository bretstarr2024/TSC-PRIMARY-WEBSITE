Review frontend quality — SSR/CSR boundaries, hydration safety, accessibility, Framer Motion patterns, responsive design.

## Context
Read these files first to understand the project conventions:
- `CLAUDE.md` — creative mandate, color system, font rules, brand voice
- `app/layout.tsx` — root layout, font loading, providers
- `app/globals.css` — Tailwind config, custom utilities, CRT scanlines
- `tailwind.config.ts` — brand colors, custom fonts, extended theme
- `components/TrackingProvider.tsx` — global click tracking

## What to Check

1. **Hydration safety** — Scan for common hydration mismatches:
   - Components that use `window`, `document`, `navigator`, `localStorage`, `sessionStorage` without `'use client'` or `typeof window` guards
   - Date formatting that differs between server and client (locale-dependent)
   - `Math.random()` in render output (different on server vs client)
   - `crypto.randomUUID()` called during render (server/client mismatch)

2. **Server/Client component boundaries** — Check:
   - All page.tsx files under `app/` — which are server components and which are client?
   - Do server component pages properly separate metadata exports from interactive content?
   - Are game trigger components (`*GameTrigger.tsx`) correctly wrapping dynamic imports?
   - Is `TrackingProvider` a client component correctly placed in the server layout?

3. **Accessibility (a11y)** — Check:
   - All interactive elements (`ArcadeButton`, `MagneticButton`, `CoinSlotCTA`) have proper `role`, `aria-label`, keyboard handlers
   - `ArcadeButton` uses `role="button"` on `motion.div` — does it have `tabIndex={0}` and `onKeyDown` for Enter/Space?
   - Form inputs in `ContactForm` and `CareersContact` have associated labels
   - Color contrast: Neon Cactus (#E1FF00) on Heart of Darkness (#141213) — passes WCAG AA?
   - Animated content has `prefers-reduced-motion` support
   - Focus indicators visible on interactive elements
   - Skip navigation link present?
   - Heading hierarchy (h1 → h2 → h3) is sequential on each page

4. **Responsive design** — Check:
   - All pages render correctly at mobile (375px), tablet (768px), desktop (1440px)
   - Game canvases resize properly or have scroll containment
   - The GAME OVER / CONTINUE? hero text doesn't overflow on mobile
   - Navigation (Header) has mobile menu with proper open/close behavior
   - `max-w-[600px]` constraint on hero subheads is maintained (CLAUDE.md invariant)

5. **Framer Motion patterns** — Check across all animated components:
   - `AnimatePresence` wraps conditional renders that need exit animations
   - `whileInView` uses `viewport={{ once: true }}` for one-time reveal animations
   - `layoutId` is used for shared layout animations
   - Spring configs are reasonable (not causing janky 60fps drops)
   - No layout animations on large trees that cause expensive reflows

6. **SEO and structured data** — Check:
   - Every page has `metadata` or `generateMetadata` export
   - JSON-LD schemas are present: Organization, FAQPage, BreadcrumbList where expected
   - `app/sitemap.xml/route.ts` and `app/robots.txt/route.ts` exist and are correct
   - `app/llms.txt/route.ts` exists for AI crawler discovery
   - OG images: are any configured? (currently noted as missing in roadmap)
   - Canonical URLs are set where needed

7. **Component consistency** — Check brand patterns:
   - All hero sections use `GradientText` for the primary word (Services, Verticals, About, Pricing, Careers)
   - CTA buttons consistently use "New Game" text (except pricing cards)
   - `data-track-*` attributes present on all interactive CTAs
   - `?cta=<ctaId>` parameter in all CTA href links

8. **Error states** — Check:
   - Does `app/not-found.tsx` exist with the custom 404?
   - Are there `error.tsx` boundaries on key route segments?
   - Form components (ContactForm, CareersContact) handle loading, success, and error states
   - API fetch failures in client components show user-friendly messages

## Anti-Patterns to Flag
- `window` or `document` access in server components (hydration crash)
- Missing `'use client'` on components that use hooks
- `motion.button` (causes browser default button styling — should be `motion.div` with `role="button"`)
- Game components without `next/dynamic` and `ssr: false`
- Missing keyboard handlers on div-as-button elements
- Form inputs without labels or aria-label
- Hardcoded pixel widths that break responsive layout

## Output Format
Report findings as:
- **CRITICAL**: [issue] — [file:line] — [why it matters]
- **WARNING**: [issue] — [file:line] — [recommendation]
- **INFO**: [observation] — [file:line]

End with: Summary paragraph + Top 3 recommended actions.
