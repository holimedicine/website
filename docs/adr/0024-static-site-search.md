# 0024. Static site search over recipes and the knowledge base

- Status: Accepted
- Date: 2026-11-23
- Amended: 2026-11-27 — the `edukacja` result type is now `artykul` and links to
  published article pages under `/baza-wiedzy/`; draft articles are excluded. See
  ADR 0027.

## Context

Readers need to find recipes and knowledge-base content (education articles and
product recommendations) by keyword, including words that only appear in an
article body. The site is a fully static Astro build on GitHub Pages (ADR 0006),
so there is no server runtime and no search backend. Content lives in MDX
collections edited through Keystatic, and details are shown in native modals
with hash deep links (ADR 0015, 0016, 0017).

A third-party hosted search service would add an external dependency and
credentials to a site that is otherwise static, while full-text engines such as
Pagefind would need extra build tooling and would still require mapping results
back to the existing modal deep links.

## Decision

- Build a JSON search index at build time from the `edukacja`, `przepisy`, and
  `produkty` collections. The index is served as the static endpoint
  `/szukaj/index.json` and fetched only on the `/szukaj/` page.
- Index plain-text bodies (markdown/MDX stripped) plus title, teaser/summary,
  tag, product examples, details, and author. Only products rendered as cards
  are indexed, because those are the ones with a modal to link to.
- Search entirely in the browser: normalize Polish diacritics, require every
  query token to match, allow prefix/inflected-form matching through a small
  suffix stemmer, and rank title matches above summary and body matches.
- Show results on the dedicated `/szukaj/` page in a grouped panel below the
  search field, with highlighted snippets. The query is mirrored to `?q=` so
  results can be linked and shared.
- Result links reuse the existing modal deep links
  (`#edukacja-<slug>`, `#przepis-<slug>`, `#produkt-<slug>`), so a result opens
  the full content in place on its page.
- Add a "Szukaj" link with a magnifier icon to the desktop nav and the mobile
  menu. No new dependencies and no changes to the Keystatic schema.

## Consequences

- Search works on GitHub Pages with no server, credentials, or runtime cost.
- New or edited CMS content appears in search after the next build/deploy,
  exactly like the rest of the static site.
- The index grows with content (~200 KB of source text today) but is loaded only
  on `/szukaj/`, so other pages are unaffected.
- Matching is intentionally lightweight: it handles Polish inflection and
  missing diacritics, but not typos or synonyms. If that becomes necessary,
  replace the matcher without changing the page or index format.
- Search behavior is covered by content-driven E2E tests
  (`tests/e2e/szukaj.spec.ts`), which derive their queries from `src/content/**`
  instead of hardcoding CMS copy (ADR 0013).
