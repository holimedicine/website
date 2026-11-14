# 0015. Recipe details modal with hash deep links

- Status: Accepted
- Date: 2026-11-14

## Context

Recipe cards on `/przepisy/` rendered only the cover image, tag, title, and
summary. The optional MDX body (`przepisy.content`, labelled "Pełny przepis")
was compiled by Astro but never rendered, so the full recipe was invisible.
The site is a static build with no per-recipe route, and a recipe can appear in
several categories.

## Decision

- Render each recipe that appears in at least one category once as a native
  `<dialog>` outside the category panels. A `Map` keyed by recipe ID prevents
  duplicate dialogs when a recipe belongs to several categories.
- Turn each card into a click target with an invisible overlay button
  (`aria-haspopup="dialog"`, `aria-controls`). The card image, tag, heading, and
  summary stay in place for layout and crawlers.
- Open dialogs with `showModal()`; close on the close button, backdrop click,
  Escape, and browser Back.
- Use the hash `#przepis-<slug>` for deep links. Opening a recipe updates the
  hash with `pushState`; closing clears it with `replaceState`. `hashchange`
  opens or closes the matching dialog and activates its category tab.
- Recipes without a full description still open a dialog with the card
  metadata and a "Pełny przepis pojawi się wkrótce." note.

## Consequences

- The full MDX body is present in the static HTML inside closed dialogs, so
  links and assets in recipes are validated by `check-dist`.
- No hydration or framework component is needed; the interaction is a small
  vanilla script.
- Dialogs must stay outside `.subcat-panel`, because `display: none` on a hidden
  panel prevents `showModal()` from rendering the dialog.
- The hash is part of the public URL; keep the `przepis-` prefix to avoid
  collisions with category IDs.
