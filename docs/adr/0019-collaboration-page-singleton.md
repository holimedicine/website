# 0019. Collaboration page backed by a Keystatic singleton

- Status: Accepted
- Date: 2026-11-16
- Amended: 2026-11-16 — cooperation areas became separate clickable tiles: each
  area gained a short `summary` for the card and a longer `body` shown in a
  native `<dialog>` (`.collab-modal`); the section heading was renamed.
- Amended: 2026-11-18 — the page header gained a CTA to the collaborator
  directory at `/wspolpraca/partnerzy/` (ADR 0020).

## Context

The site needs a "Współpraca" (collaboration) subpage that mirrors the legacy
hand-written `wspolpraca.html`: a page header, six cooperation areas, three
principles, three steps, and a contact box. Editors must be able to rewrite all
of that copy — including the contact details — without a code change, like the
homepage sections (ADR 0008).

The page reuses existing presentation classes (`.services-grid`, `.phil-grid`,
`.contact-box`), so it needs no new styling. It has no internal links, so no
`withBase()` call is required. The subpage "back to homepage" link stays removed
(ADR 0011).

## Decision

- Add a `wspolpraca` singleton (`src/content/wspolpraca/index.json`) with header
  fields, three ordered card arrays, and free-form contact details
  (`{ label, value }`) plus CTA label and href.
- Register it in both `src/content.config.ts` and `keystatic.config.ts`, under a
  dedicated "Współpraca" navigation group.
- Render it at `/wspolpraca/` with `src/pages/wspolpraca.astro`, using
  `SiteLayout`, `PageHeader`, and the existing card/contact classes.
- Add a seventh nav link (`Współpraca`) after "Polecane produkty". The row now
  needs roughly 900px, so the hamburger breakpoint moves to 1000px (amends ADR
  0012).
- Cover the page with smoke, base-path, navigation, and content-driven E2E tests.

## Consequences

- Editors can change every heading, card, contact detail, and CTA at any time;
  the visible e-mail and the mailto CTA are independent fields, so keep them in
  sync when changing the address.
- Contact details are duplicated between this singleton and `contact`; they are
  intentionally decoupled so the collaboration page can show different channels.
- The nav breakpoint is now 1000px and must be re-measured if another link is
  added.
- `/wspolpraca/` is part of the static build and the base-path checks.
