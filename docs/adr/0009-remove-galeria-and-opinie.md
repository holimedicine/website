# 0009. Remove the Galeria page and Opinie section

- Status: Accepted
- Date: 2026-10-27

## Context

The site had two low-value features:

- **Galeria** (`src/pages/galeria.astro`) was a placeholder page: one real photo
  (already shown in the homepage "O nas" section) and two empty "Miejsce na
  kolejne zdjęcie" tiles.
- **Opinie** was a homepage section whose "reviews" were stored only in the
  visitor's `localStorage`. They were never shared between visitors, could not be
  moderated, and were not real testimonials. The surrounding JS also added weight
  and maintenance surface to `src/pages/index.astro`.

Neither feature was CMS-managed or linked from anywhere except the nav.

## Decision

Remove both features completely:

- Delete `src/pages/galeria.astro` and its nav link.
- Remove the Opinie homepage section, its inline review script, and its nav link.
- Delete the now-unused gallery/review CSS from `src/styles/global.css`.
- Keep `public/images/natalia-donat.jpg`; the `about` singleton still uses it.

## Consequences

- Nav shrinks from eight to six links; the homepage flows Zakres opieki → Kontakt.
- `/galeria` no longer exists (old bookmarks will 404).
- Any reviews previously saved in visitors' `localStorage` become orphaned; they
  were local-only, so no data is lost from the site.
- No content-collection or Keystatic changes are required.
- If real testimonials are wanted later, they should be CMS-managed and
  server-rendered (consistent with ADRs 0003–0005), not stored client-side.
