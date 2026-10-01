# 0004. Manage edukacja/przepisy as MDX content collections

- Status: Accepted
- Date: 2026-10-01

## Context

The `edukacja` and `przepisy` sections have structured metadata plus rich body
content. We needed a single representation that both Astro (at build time) and
Keystatic (in the admin) understand.

## Decision

Store entries as **MDX files with YAML frontmatter** in **Astro content
collections**, one file per entry.

- `src/content.config.ts` — glob loaders and Zod schemas.
- `src/content/edukacja/*.mdx` and `src/content/przepisy/*.mdx`.
- Keystatic uses `format: { contentField: 'content' }`, so the body maps to a
  `content` MDX field.

### Fields

`edukacja` — `title` (slug), `teaser`, `order` (integer), `content` (MDX body).

`przepisy` — `title` (slug), `category` (select: `na-wynos` | `dania`), `tag`,
`summary`, `coverImage` (image), `alt`, `order`, `content` (MDX body, optional).

### Images

Recipe images live at `public/images/przepisy/<slug>/coverImage.jpg`, matching
Keystatic's `publicPath` convention so uploads round-trip:

```ts
coverImage: fields.image({
  directory: 'public/images/przepisy',
  publicPath: '/images/przepisy/',
}),
```

The stored value is the public path, e.g. `/images/przepisy/<slug>/coverImage.jpg`.

### Migration

The legacy HTML was converted to Markdown once (headings, nested lists,
bold/italic). Pages render via `getCollection()` + `render()` → `<Content />`.
The old inline data file (`src/data/edukacja.ts`) was removed.

## Consequences

- Adding/editing content = adding/editing one MDX file (or using the CMS).
- Frontmatter keys must match both the Zod schema and the Keystatic schema; keep
  `src/content.config.ts` and `keystatic.config.ts` in sync when changing fields.
- Ordering on the site comes from the `order` field, not dates.
