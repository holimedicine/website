---
name: holimedicine-dev
description: Use when working in holimedicine-website on scaffolding new articles or recipes, adding knowledge-base sections/topics, validating the Keystatic/Astro content schema, creating ADRs, or checking root-relative links.
---

# holimedicine-dev

Project workflows for `holimedicine-website`. Content fields are defined in
`src/content.config.ts` and the modules under `src/keystatic/`; keep both in sync
when the model changes.

## Scaffold content

"Scaffold new article" / "Scaffold new recipe":

```bash
./scripts/scaffold.sh article "Tytuł artykułu" <sekcja> [temat]
./scripts/scaffold.sh recipe "Tytuł przepisu"
```

- Creates `src/content/edukacja/<slug>.mdx` (`title`, `author`, `section`,
  optional `topic`, `order`, `status: draft`) or
  `src/content/przepisy/<slug>.mdx` (`title`).
- The article's section must exist in `src/content/sekcje-bazy-wiedzy/<sekcja>.json`.
  A topic, when given, must exist in `src/content/tematy-bazy-wiedzy/<temat>.json`
  and belong to that section.
- The slug comes from the title, without a date prefix; the script refuses to
  overwrite an existing file.
- Switch `status: draft` to `status: published` when the article is ready. Drafts
  are listed as "Wkrótce" on section pages but have no public page and are absent
  from search and the sitemap.
- A recipe appears on `/przepisy/` only when its slug is listed in a category's
  `recipes` array in `src/content/kategorie-przepisow/*.json`. That list also
  defines its position on the page (ADR 0014), so remind the user to add the
  new slug there.

## Add a knowledge section or topic

- Add a JSON file to `src/content/sekcje-bazy-wiedzy/` (title, order, summary,
  kind, optional href) to create a new hub tile, nav item and section page.
- Add a JSON file to `src/content/tematy-bazy-wiedzy/` (title, order, section,
  summary) to create a topic page. Topics are used by sections such as
  "Zdrowie według układów".
- Section 4 ("Suplementy") uses `kind: supplements` and `href: /produkty/`, so it
  links to the existing supplements page instead of generating a new section page.

## Validate schema

"Validate Keystatic schema" — check content against the Astro schema:

```bash
npm run typecheck   # astro sync + tsc; fails on invalid frontmatter
npm run build:site  # also validates knowledge-base relationships and links
```

Any field added to a collection must be added to both `src/content.config.ts` and
the matching module under `src/keystatic/`. The build fails with a readable list
when an article points at a missing section/topic or a topic belongs to another
section.

## Create ADR

"Generate new ADR" — follow `docs/adr/README.md`: use the next four-digit
number, copy the template, and update the index. Amend or supersede an existing
ADR according to the rules there. Skip ADRs for bug fixes, copy, and style
tweaks.

## Check root-relative links

"Check root-relative links" — build and validate:

```bash
npm run build:site   # runs scripts/check-dist.mjs against dist/
```

Every root-relative link or asset must go through `withBase()` from
`src/utils/url.ts` (ADR 0007).
