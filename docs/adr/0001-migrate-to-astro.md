# 0001. Migrate the static site to Astro

- Status: Accepted
- Date: 2026-10-01

## Context

The site was a set of hand-written HTML files (`index.html`, `edukacja.html`,
`przepisy.html`, `produkty.html`, `galeria.html`) plus one global `style.css` and
one `script.js`, deployed to GitHub Pages. Every page duplicated the nav, header
and footer, and adding content meant editing large HTML files by hand.

We wanted: shared layout/components, a proper build step, a manageable content
model for the `edukacja` (articles) and `przepisy` (recipes) sections, and a way
for a non-developer to edit that content without touching HTML.

## Decision

Rebuild the site as an **Astro** project using the **static** output mode, with
React and MDX integrations available, and Tailwind for styling (see ADR 0002).

- `src/pages/*.astro` — the five pages.
- `src/layouts/Layout.astro` (HTML shell) and `src/layouts/SiteLayout.astro`
  (nav + slot + footer + client scripts).
- `src/components/Nav.astro`, `Footer.astro`, `PageHeader.astro` — shared UI.
- The old files were kept temporarily under `legacy/` (untracked) as a reference
  during migration; the originals also remain in git history.

## Consequences

- Pages share components; content and markup are separated.
- Requires a Node build step (no longer "edit HTML and push").
- Astro outputs pure static HTML/CSS/JS, which is what GitHub Pages needs.
- `legacy/` is redundant (history + `src/content` preserve the source); it is not
  committed and can be deleted.
