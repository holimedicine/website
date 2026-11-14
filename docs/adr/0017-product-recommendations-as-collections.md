# 0017. Product recommendations as content collections

- Status: Accepted
- Date: 2026-11-14

## Context

`/produkty/` rendered its supplement recommendations from hardcoded arrays in
`src/pages/produkty.astro`: 18 substance cards plus two comparison tables.
Editors could not change the content, adding a new recommendation section
required a code change, and cards did not open details.

## Decision

- Store card entries in the `produkty` MDX collection (`src/content/produkty/`).
  Each entry has `title`, `examples`, `summary`, optional `image`/`imageAlt`,
  optional `link`/`linkLabel`, an optional `details` list of label/value pairs,
  and an MDX body for the full description.
- Store page sections in the `sekcjeProduktow` JSON collection
  (`src/content/sekcje-produktow/`). Each section has a heading (`title`),
  optional `description`, `order`, `display` (`cards` or `table`), an ordered
  `items` relationship list for card sections, and `columns`/`rows` for table
  sections.
- Render sections in `order`. Card sections show clickable tiles; table sections
  keep the comparison table.
- Open product details in a native `<dialog>` through the shared modal helper
  (`src/scripts/modals.ts`), using the hash `#produkt-<slug>` for deep links. A
  product is rendered as one dialog even when it appears in several sections.
- Keep the page header, lead, and disclaimer in code; only the sections and
  products are CMS-managed.
- Add both collections under MODUŁY in Keystatic. Adding a future section means
  creating a section entry and either assigning existing products or filling
  table columns and rows; no code change is needed.

## Consequences

- The whole `/produkty/` content is editable from Keystatic and committed
  through GitHub storage like the other collections.
- Keep `keystatic.config.ts` and `src/content.config.ts` in sync when fields
  change.
- Section `items` store product slugs, mirroring recipe categories (ADR 0014).
  Renaming a product file can break a section reference; the build fails with a
  clear error for unknown or duplicate slugs.
- Table rows are generic `cells` arrays, so new table sections can define their
  own columns; editors must keep cell order aligned with the column list.
- Product details live inside closed dialogs in the static HTML, so links and
  assets in their MDX are validated by `check-dist`.
- Modal open/close/hash logic now lives in `src/scripts/modals.ts` and is shared
  by edukacja, przepisy, and produkty.
