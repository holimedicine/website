# 0023. Baza wiedzy hub with two CTA tiles

- Status: Accepted
- Date: 2026-11-21

## Context

"Baza wiedzy" was the user-facing name of `/edukacja/` (ADR 0016), while
`/produkty/` (ADR 0017) was a separate top-level nav entry. The two areas are
siblings in the information architecture but had no shared landing page, so the
nav made them look unrelated and the label "Baza wiedzy" pointed straight at the
article list.

## Decision

- Add a hub page at `/baza-wiedzy/` (`src/pages/baza-wiedzy.astro`) with two
  large CTA tiles: **Materiały, które poszerzają świadomość** → `/edukacja/`
  and **Polecane produkty** → `/produkty/`.
- Keep the content routes unchanged (`/edukacja/`, `/produkty/`), so existing
  links, `#edukacja-*`/`#produkt-*` deep links, and the content collections need
  no migration or redirects.
- Style the tiles by grouping the existing `.partners-cta` rules with the new
  `.knowledge-tile` class (the pattern used for shared modal styles in ADR
  0016): same gradient, border, decorative circle, hover lift, and action pill.
  The grid is two columns and collapses to one at `860px`; sizing uses
  `clamp()` so the tiles stay large on wide screens and readable on narrow ones.
- Restructure the nav: "Baza wiedzy" becomes a dropdown trigger to the hub with
  children "Materiały edukacyjne" (`/edukacja/`) and "Polecane produkty"
  (`/produkty/`); the separate top-level "Polecane produkty" link is removed.
  The parent stays current on the hub and both child pages, which needs the new
  `pages` list on a nav link.
- Change the `/edukacja/` `<title>` to "Materiały, które poszerzają
  świadomość — …" so it no longer duplicates the hub title.

## Consequences

- The nav row gets narrower (two top-level entries become one dropdown), so the
  1000px breakpoint from ADR 0012 should still hold; re-measure if another
  entry is added.
- The hub copy is hardcoded in the page, like the `/edukacja/` and `/produkty/`
  headers; move it into a Keystatic singleton only if editors need to change it.
- A second nav dropdown now exists, so selectors/tests must scope
  `.nav-item-has-menu` by its trigger label.
- Both tiles must use `withBase()` for their `href` values (ADR 0007/0021).
- The hub has no back link to the homepage and its children have none to the
  hub, following ADR 0011.
