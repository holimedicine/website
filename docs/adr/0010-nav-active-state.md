# 0010. Nav active state and homepage scroll-spy

- Status: Accepted
- Date: 2026-10-27

## Context

The nav mixes two kinds of destinations:

- **O nas**, **Podejście**, and **Zakres opieki** are sections on the homepage
  (`/#o-nas`, `/#podejscie`, `/#zakres`).
- **Przepisy**, **Edukacja**, and **Polecane produkty** are separate pages.

All six looked identical. On a module page there was no indication of where you
were, and on the homepage there was no feedback while scrolling through the
sections. The distinction between an in-page jump and a page navigation was also
invisible, which made the nav feel inconsistent.

## Decision

Keep the three homepage anchors in the nav (they carry the homepage narrative and
the "Zakres opieki" content), but add a persistent active indicator:

- **Server-rendered page state:** `Nav.astro` compares the current path with each
  module page and sets `aria-current="page"` on the match. The path is normalised
  by stripping `import.meta.env.BASE_URL` and trailing slashes, so it works in dev
  (`/przepisy`) and production (`/website/przepisy/`).
- **Homepage scroll-spy:** `SiteLayout.astro` watches `#o-nas`, `#podejscie`,
  `#zakres`, and `#kontakt`. The last section whose top has passed below the
  sticky nav gets `aria-current="location"` on both the desktop and mobile copies
  of the link. The marker clears above `#o-nas` and on `#kontakt` (there is no
  contact nav item; the "Umów wizytę" CTA covers it). Updates are rAF-throttled
  and driven by `scroll`/`resize`, so no extra observer is needed.
- **Visuals:** active desktop links get a 2px gold underline; active mobile rows
  get a 2px gold left bar (with a transparent placeholder border to avoid layout
  shift). Gold is used instead of the accent red so the red "Umów wizytę" CTA
  remains the strongest element in the nav.
- **Anchor offset:** `html { scroll-padding-top: 5rem; }` keeps jumped-to
  sections below the sticky header.

The scroll-spy is skipped automatically on pages without those section IDs. No
URL/hash or history changes are made.

## Consequences

- Users can see whether they are on a module page or in a homepage section, and
  the nav now explains the anchor/page mix rather than hiding it.
- `aria-current` exposes the same state to assistive technology with the correct
  semantics (`page` vs `location`).
- The nav has two copies of every link (desktop and mobile), so any future
  active-state logic must update both. The `data-nav-section` / `data-nav-page`
  attributes are the shared hooks.
- Scroll-spy depends on the section IDs; renaming an ID in `index.astro` requires
  updating `sectionIds` in `SiteLayout.astro` (otherwise that section silently
  stops highlighting).
- Adding a new module page to the nav also requires adding it to `links` in
  `Nav.astro` so the path comparison can mark it.
