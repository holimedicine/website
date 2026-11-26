# 0025. SEO metadata, canonical URLs and crawler basics

- Status: Accepted
- Date: 2026-11-26

## Context

The site had no head metadata beyond `<title>` and a meta description: no
canonical URL, no Open Graph or Twitter tags, no `robots.txt`, and no sitemap.
Search engines had to discover pages on their own, shared links rendered
without a preview, and the same page could be reached under several URLs (for
example `/szukaj/?q=jelita`), which splits signals.

The site is a fully static Astro build served from the apex custom domain
`https://holimedicine.eu/` (ADR 0021). `site` is set in `astro.config.mjs`, so
absolute URLs are available at build time. Titles also ended with
`— Natalia i Donat Cupiał` instead of the brand, so brand queries
("Holimedicine") saw the brand name only on the homepage.

## Decision

- Generate `sitemap-index.xml` with `@astrojs/sitemap` (enabled in build and dev)
  and exclude `/szukaj`, which is a thin, query-driven page.
- Publish `public/robots.txt` that allows everything and points at the sitemap.
  It is a static file, so the absolute URL is written literally instead of using
  `withBase()` (base is `/`, ADR 0021).
- Centralize head metadata in `src/layouts/Layout.astro`, with props forwarded
  from `SiteLayout`:
  - `title`, `description` — page copy;
  - `canonicalPath` — override; defaults to the current page path;
  - `image` — social preview; defaults to `public/images/og-default.jpg`;
  - `type` — `website` or `article`;
  - `noindex` — emits `<meta name="robots" content="noindex, follow">`.
- Build canonical and Open Graph URLs through `src/utils/seo.ts`
  (`absoluteUrl()`, `normalizePath()`), which always resolve against the
  configured `site` origin and add the trailing slash the static build serves.
- Emit Open Graph (`og:*`, `pl_PL`, `summary_large_image`) and Twitter Card tags
  on every page, plus a `<slot name="head" />` for page-level additions such as
  JSON-LD.
- Front-load keywords and the brand in titles: the homepage leads with
  `Holimedicine`, subpages end with `| Holimedicine`.
- Put the keyword phrase and the city in the homepage `<h1>` as a styled second
  line (`medycyna holistyczna i terapia manualna w Zawierciu`); `.hero-kicker`
  stays the short local cue (`Gabinet lekarski`).
- Keep `/szukaj` out of the index; it stays reachable from the nav.
- Cover all of the above with E2E assertions in `tests/e2e/smoke.spec.ts` and
  `tests/e2e/seo.spec.ts`.

## Consequences

- Canonicals always point at production, even under `astro dev`; previews of
  local pages therefore advertise the production URL, which is intended.
- `normalizePath()` keeps file extensions (`/sitemap-index.xml`,
  `/images/og-default.jpg`) untouched and only adds trailing slashes to pages,
  so the canonical matches what GitHub Pages actually serves.
- Copy edits to titles must be mirrored in `tests/e2e/smoke.spec.ts`, which
  asserts the full title strings.
- The social card (`public/images/og-default.jpg`, 1200×630) is derived from
  `public/images/photo.jpg`; regenerating it is a manual `sips` step.
- Structured data (JSON-LD) is not part of this decision yet; it plugs into the
  `head` slot when added.
- Sitemap and robots files are generated into `dist/`; `check-dist.mjs` only
  inspects HTML, so they need their own E2E coverage.
