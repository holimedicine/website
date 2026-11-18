# 0018. Light sage/steel theme and responsive hero banner

- Status: Accepted
- Date: 2026-11-15
- Amended: 2026-11-17 — the homepage hero became full-bleed and full-height,
  starts underneath a fixed nav, and sits closer to the first section.
- Amended: 2026-11-18 — the hero height became content-driven again (no
  `100svh` floor), with tighter vertical padding and a 40px accent bar.

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
- **Full-bleed, full-height hero:** the homepage hero is edge-to-edge and fills at
  least the viewport height (`min-height: 100svh` with a `100vh` fallback). The
  hero content stays centred in a 1200px container that matches `.nav-inner`, with
  top padding that clears the nav. Short viewports (`max-height: 640px`, e.g.
  landscape phones) drop the full-height constraint and keep the hero's natural
  height instead of squeezing the copy. The gap to the first section is tightened
  with `.hero + .section`.
- **Nav overlay:** the homepage passes `navOverlay` to `SiteLayout`, which gives
  `Nav` the `.nav-overlay` class (`position: fixed; inset-inline: 0`). The hero
  therefore starts at the top edge and shows through the translucent, blurred nav;
  subpages keep the sticky nav in the document flow.
- **Compact hero (amended 2026-11-18):** the full-height constraint was removed in
  favour of a content-driven height. The hero grid keeps only the padding needed
  to clear the fixed nav (`clamp(5rem, 7vw, 6.5rem)` on top) and a tight bottom
  padding, so the copy and the logo mark sit higher and no empty band is left
  under the CTAs. The decorative bar under the `h1` is 40px wide.

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
- The hero is no longer a rounded card, so `hero-backdrop.svg` must remain safe to
  crop at any viewport width (it uses `object-fit: cover`).
- The full-height hero uses `svh` rather than `dvh` so it does not resize while
  mobile browser chrome hides or shows. On very short viewports it intentionally
  exceeds the viewport instead of clipping the copy.
- The hero no longer fills the viewport, so `tests/e2e/home.spec.ts` asserts a
  full-bleed top-aligned banner shorter than the viewport with both CTAs visible
  above the fold. Any change to the hero typography or padding must keep that
  promise.
- Only pages that opt into `navOverlay` get the fixed nav; the scroll-spy and
  `scroll-padding-top` from ADR 0010 rely on `nav.clientHeight` and keep working.
