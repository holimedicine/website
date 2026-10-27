# 0008. Manage homepage content as Keystatic singletons

- Status: Accepted
- Date: 2026-10-27

## Context

The homepage sections **O nas**, **Podejście**, and **Zakres opieki** were
hardcoded in `src/pages/index.astro`. They need to be editable through Keystatic
like `edukacja` and `przepisy`, including the couple's photo and the service list.

Each section is a single, fixed block on one page, so modelling them as
collections (one file per entry) would add unnecessary files and sidebar entries.

## Decision

Model each homepage section as a **Keystatic singleton** backed by an Astro
content collection.

- `about` — `src/content/about/index.mdx`, MDX body is `mission`; fields
  `eyebrow`, `heading`, `photo` (image), `photoAlt`, `profiles` (array of
  `name` / `role` / `bio`).
- `podejscie` — `src/content/podejscie/index.mdx`, MDX body is `intro`; fields
  `eyebrow`, `heading`, `pillars` (array of `title` / `body`).
- `zakres` — `src/content/zakres/index.json`, fields `eyebrow`, `heading`, and
  `items` (array of `title` / `body`).

The section heading and the service list live in the **same** `zakres` singleton.
Keeping a separate service collection produced two "Zakres opieki" entries in the
Keystatic sidebar, so the list was folded into the singleton array instead.

Images use Keystatic's `publicPath` convention:

```ts
photo: fields.image({
  directory: 'public/images',
  publicPath: '/images/',
}),
```

`index.astro` reads the singletons with `getEntry()` + `render()` for MDX bodies
and renders arrays directly.

## Consequences

- All three homepage sections are editable from `/keystatic/` without touching
  code.
- Service order is the array order; reordering is drag-and-drop in the CMS.
- `keystatic.config.ts` and `src/content.config.ts` must stay in sync.
- Keystatic uses GitHub storage, so new content files must be committed and
  pushed before the admin sees them.
- Keystatic remains dev-only; the production build renders the same content
  statically (ADR 0005).
