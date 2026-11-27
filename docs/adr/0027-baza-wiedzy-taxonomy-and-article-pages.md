# 0027. Baza wiedzy taxonomy, section pages and article pages

- Status: Accepted
- Date: 2026-11-27

## Context

"Baza wiedzy" was a hub with two CTA tiles (ADR 0023): a flat list of education
articles rendered in modals (ADR 0016) and the separate supplements page
(ADR 0017). The content plan needs a six-section tree (Zacznij tutaj, Styl
życia, Żywienie, Suplementy, Zdrowie według układów, Co mówi nauka?), with
topics under "Zdrowie według układów" and a place for planned articles.

A flat modal list does not scale to that structure: it hides the hierarchy, makes
section-level navigation impossible, and produces one ever-growing page. The
taxonomy also has to be editable in Keystatic without code changes.

## Decision

- Model the tree as three editable pieces:
  - `sekcje-bazy-wiedzy/*.json` — six top-level sections with `title`, `order`,
    `summary`, `kind` (`articles` or `supplements`) and an optional `href`.
  - `tematy-bazy-wiedzy/*.json` — topics with `title`, `order`, `section` and
    `summary`; used by "Zdrowie według układów".
  - `edukacja/*.mdx` articles carry `section` (required), `topic` (optional),
    `order` and `status` (`published` or `draft`).
- Give published articles dedicated pages instead of modals:
  - `/baza-wiedzy/<sekcja>/<artykul>/` for flat sections,
  - `/baza-wiedzy/<sekcja>/<temat>/<artykul>/` for articles inside a topic,
  - `/baza-wiedzy/<sekcja>/` for sections and
    `/baza-wiedzy/<sekcja>/<temat>/` for topics.
- Keep `/edukacja/` as an "Wszystkie artykuły" index. A small client script maps
  legacy `#edukacja-<slug>` deep links to the new article pages.
- Keep supplements at `/produkty/`: the "Suplementy" section uses
  `kind: supplements` and `href: /produkty/` instead of generating a duplicate
  section page.
- Show drafts as non-clickable "Wkrótce" cards on section/topic pages. Drafts
  have no page and are excluded from search and the sitemap.
- Generate the hub tiles and the "Baza wiedzy" nav dropdown from the section
  collection, so a new section appears everywhere after one CMS edit.
- Validate the taxonomy at build time: missing sections/topics, a topic from a
  different section, a topic/article slug collision in the same section,
  supplements without `href`, and relative `href` values all fail the build with
  one readable list.
- Split the Keystatic config into modules under `src/keystatic/` (`site`,
  `baza-wiedzy`, `przepisy`, `produkty`, `wspolpraca`, `fields`, `navigation`)
  and group the admin sidebar by site area.
- Rename the search entry type from `edukacja` to `artykul` and label its group
  "Baza wiedzy".

## Consequences

- The hierarchy is visible in URLs, navigation, breadcrumbs and the sitemap;
  articles can be shared and indexed individually.
- Renaming an article file changes its URL, as with the old hash deep links.
  Keep slugs stable once published.
- Old `#edukacja-*` links are redirected only through `/edukacja/`; they must
  include that path. Direct links to the new article pages are the canonical
  form.
- The "Suplementy" section has no `/baza-wiedzy/suplementy/` URL by design; it
  links to `/produkty/`. If nested URLs are needed later, add a section page and
  redirect.
- `pokarmowy` starts without published articles because "Zespół nieszczelnego
  jelita" belongs to "Co mówi nauka?" per the content plan. The topic page shows
  an empty state until an article is assigned.
- The Keystatic config and `src/content.config.ts` are separate sources that must
  be kept in sync; the `holimedicine-dev` skill documents the workflow.
- Content-driven E2E tests read sections, topics and articles from
  `src/content/**`; changing CMS copy does not require touching tests
  (ADR 0013).
