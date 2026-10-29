# 0011. Remove the subpage "back to homepage" link

- Status: Accepted
- Date: 2026-10-29

## Context

`PageHeader.astro` rendered a `← Wróć do strony głównej` link on every module
page (Przepisy, Edukacja, Polecane produkty). The sticky nav already exposes the
brand as a link to the homepage and highlights the current page (ADR 0010), so
the back link duplicated existing navigation and added visual noise below the
page lead.

## Decision

Remove the back link from `PageHeader.astro` and delete its now-unused CSS
(`.back-link` / `.back-link:hover`) from `src/styles/global.css`. The component
no longer imports `withBase()`, since it has no root-relative links left.

## Consequences

- Subpage headers end after the optional lead; navigation relies on the nav
  brand and active nav state.
- No routes, content collections, or Keystatic fields change.
- Reintroducing a back link later means adding it back to `PageHeader.astro`
  (and wrapping its `href` with `withBase()` per ADR 0007).
