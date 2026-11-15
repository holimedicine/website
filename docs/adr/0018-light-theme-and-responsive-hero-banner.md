# 0018. Light sage/steel theme and responsive hero banner

- Status: Accepted
- Date: 2026-11-15

## Context

The site used a dark theme with red and gold accents, a serif display face, and a
homepage hero that inlined all of its artwork in `src/pages/index.astro`.

The redesign brief supplied a reference banner (`Temat.svg`) with a light
sage/steel palette, a wordmark inside the artwork, and waves plus a geometric grid
in the background. The hero copy also had to stay readable and reflow on small
screens, which is not possible when the text is baked into a single SVG.

## Decision

- **Palette:** light theme tokens in `src/styles/global.css` under `@theme`:
  `#3a7d71` (sage primary), `#2b5876` (steel secondary), `#68b0ab` (soft accent),
  `#f4f8f7` background, `#e8f0ee` elevated surface, `#ffffff` cards, `#1b3a4b`
  text, `#4a606a` muted text. Cards, modals, tables, contact box, and footer were
  restyled for the light surface.
- **Typography:** Montserrat for headings and Public Sans for body copy, loaded
  from Google Fonts at the top of `global.css`; `--font-display` and `--font-sans`
  map them to Tailwind utilities.
- **Hero assets:** split the reference artwork into two files in `public/images/`:
  `hero-backdrop.svg` (gradient, waves, grid only) and `logo-mark.svg` (heart,
  spine, ECG line). Both are referenced through `withBase()`.
- **Hero markup:** `src/components/HeroBanner.astro` renders the backdrop as a
  decorative `<img>`, the copy as real HTML (`h1` with `Holi`/`medicine` spans,
  accent bar, taglines), the logo mark as a separate element, and the CTA pair.
  The text column takes 50–55% on desktop; below 720px the grid reflows to
  `copy copy` / `mark actions`, so the logo sits in a row with the CTAs and both
  scale with `clamp()`.
- **Navigation:** the brand name is replaced by an Instagram icon linking to the
  practice profile; the section label becomes **Medycyna holistyczna** and the
  education page label becomes **Baza wiedzy** (routes unchanged); the CTA gains a
  plus icon. The `/edukacja/` page header eyebrow and `<title>` also use **Baza
  wiedzy**.

## Consequences

- Hero copy is editable in code, not Keystatic. That is intentional: the banner is
  a fixed brand statement, and keeping the text in HTML makes it selectable,
  translatable, and responsive.
- The reference SVG must stay split. Re-merging text into the artwork would break
  the mobile reflow and the accessibility tree.
- Fonts come from Google Fonts at runtime; losing network access falls back to
  the system stack. Self-hosting them would avoid that, and is a future option.
- The palette lives only in `@theme` tokens plus a few literal hex values in
  gradients and hover states. Keep new styles token-based so a future theme change
  stays in one place.
- Both hero images are decorative (`alt=""`, `aria-hidden="true"`); the accessible
  name of the page is the `<h1>` text.
- Nav label changes affect the active-state hooks in ADR 0010 only through copy;
  `data-nav-section` / `data-nav-page` values are unchanged.
