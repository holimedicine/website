# 0008. Manage homepage content as Keystatic singletons

- Status: Accepted
- Date: 2026-10-27
- Amended: 2026-10-30 — added the Kontakt section as a fourth singleton.

## Context

The homepage sections **O nas**, **Podejście**, **Zakres opieki**, and
**Kontakt** were hardcoded in `src/pages/index.astro`. They need to be editable
through Keystatic like `edukacja` and `przepisy`, including the couple's photo,
the service list, and the contact details.

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
- `contact` — `src/content/contact/index.json`, fields `heading`, `lead`,
  `phone`, `email`, `address`, and `primaryCtaLabel` / `primaryCtaHref` /
  `secondaryCtaLabel` / `secondaryCtaHref` for the contact buttons. The
  Keystatic key is `contact`; the sidebar label is **Kontakt**.

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

- All four homepage sections are editable from `/keystatic/` without touching
  code.
- Contact details and the contact section copy are editable in one place. The
  “Umów wizytę” CTA label stays hardcoded in the hero and navbar because it is
  navigation/UI microcopy, not page content.
- Service order is the array order; reordering is drag-and-drop in the CMS.
- `keystatic.config.ts` and `src/content.config.ts` must stay in sync.
- Keystatic uses GitHub storage, so new content files must be committed and
  pushed before the admin sees them.
- Keystatic remains dev-only; the production build renders the same content
  statically (ADR 0005).
