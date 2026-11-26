# 0026. Recipe author field and author in the recipe modal

- Status: Accepted
- Date: 2026-11-26

## Context

Recipes on `/przepisy/` had no author metadata, unlike **edukacja** and
**produkty**, which show an author under the title in their modals. The recipe
content was written by Natalia Cupiał, but nothing on the page said so, and
editors had no field to change it in Keystatic.

## Decision

- Add an optional `author` string to the `przepisy` schema with the default
  `Natalia Cupiał` (mirroring the default-author pattern of the other
  collections).
- Expose it in Keystatic as a text field with the same default and show it in
  the collection columns.
- Write `author: Natalia Cupiał` explicitly in every existing recipe so the
  value is populated in the CMS instead of relying on the schema default.
- Render `Autor: <author>` under the recipe title in the recipe modal, using the
  same `.recipe-modal-author` style as the education and product modals. Cards
  stay unchanged.

## Consequences

- New recipes get Natalia Cupiał as the default author and editors can override
  it per recipe in Keystatic.
- The schema and Keystatic config must stay in sync, as with every other
  collection field.
- E2E tests read the expected author from the recipe frontmatter rather than
  hardcoding it, so a CMS edit does not break the build.
