# 0014. Configurable recipe categories

- Status: Accepted
- Date: 2026-11-10
- Amended: 2026-11-14 — recipe ordering moved into ordered recipe lists on
  category entries; recipes no longer store `category` or `order`.

## Context

Recipe categories were hardcoded in several places: the Zod enum in
`src/content.config.ts`, the Keystatic `fields.select` options, the two tab
buttons and panels in `src/pages/przepisy.astro`, and the E2E tests. Adding or
renaming a category required code changes, and the CMS offered no way to manage
the category list.

## Decision

Model recipe categories as a **Keystatic collection** backed by JSON files, and
reference them from recipes with a relationship field.

- `kategoriePrzepisow` — `src/content/kategorie-przepisow/<slug>.json`, fields
  `title` (slug field; also the tab label) and `order` (integer).
- `przepisy.category` — `fields.relationship({ collection: 'kategoriePrzepisow' })`,
  stored as the category slug. The Astro schema uses `z.string()` because a
  content collection schema cannot derive a `z.enum` from another collection.
- `/przepisy/` reads both collections, sorts categories by `order`, and renders
  one tab/panel per category. Categories with no recipes show an empty state.
- The page throws at build time when a recipe references a category slug that
  does not exist, so renaming a category's slug or deleting it fails the build
  with the offending recipe IDs instead of silently disappearing.

Existing slugs `na-wynos` and `dania` are preserved as the initial category
entries, so recipe frontmatter needs no migration. `na-wynos` has `order: 0` and
remains the default tab.

## Consequences

- Editors can add, rename, reorder, and remove categories in the Keystatic admin
  without code changes. New recipes pick a category from a dropdown.
- Keystatic relationships store a static slug: renaming a category's slug breaks
  recipes that reference the old value. The build-time check catches this; the
  editor must reassign the recipes (or keep the old slug).
- Category slugs become DOM ids for the tab panels, so they should stay
  lowercase and hyphenated; Keystatic enforces this with a slug pattern.
- The first category by `order` is the tab shown on page load.
- Category files live under `src/content/`, so content-only commits still run
  `build:site` (which validates categories) but skip E2E, per ADR 0013.
- `keystatic.config.ts` and `src/content.config.ts` must stay in sync.

## Amendment (2026-11-14)

Ordering and membership moved from recipes into the category entries:

- `kategoriePrzepisow.recipes` — an ordered array of recipe slugs, edited as a
  drag-and-drop relationship list. The array order is the display order within
  the tab.
- Recipes no longer store `category` or `order`; the category list is the sole
  source of membership. A recipe may appear in zero, one, or more categories.
- `/przepisy/` resolves each category's slugs and throws at build time when a
  slug does not exist or is duplicated within the same category list. Unassigned
  recipes are allowed and are simply not rendered.
- Renaming a recipe's slug breaks category lists that reference the old value;
  the build-time check catches this. The relationship list displays slugs, while
  the picker displays recipe titles.

This replaces the `przepisy.category` relationship and the recipe `order` field
described above.
