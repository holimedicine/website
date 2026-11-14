---
name: holimedicine-dev
description: Use when working in holimedicine-website on scaffolding new articles or recipes, validating the Keystatic/Astro content schema, creating ADRs, or checking root-relative links.
---

# holimedicine-dev

Project workflows for `holimedicine-website`. Content fields are defined in
`src/content.config.ts` and `keystatic.config.ts`; keep both in sync when the
model changes.

## Scaffold content

"Scaffold new article" / "Scaffold new recipe":

```bash
./scripts/scaffold.sh article "Tytuł artykułu"
./scripts/scaffold.sh recipe "Tytuł przepisu"
```

- Creates `src/content/edukacja/<slug>.mdx` (`title`, `order`) or
  `src/content/przepisy/<slug>.mdx` (`title`).
- The slug comes from the title, without a date prefix; the script refuses to
  overwrite an existing file.
- A recipe appears on `/przepisy/` only when its slug is listed in a category's
  `recipes` array in `src/content/kategorie-przepisow/*.json`. That list also
  defines its position on the page (ADR 0014), so remind the user to add the
  new slug there.

## Validate schema

"Validate Keystatic schema" — check content against the Astro schema:

```bash
npm run typecheck   # astro sync + tsc; fails on invalid frontmatter
```

Any field added to a collection must be added to both config files above.

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
