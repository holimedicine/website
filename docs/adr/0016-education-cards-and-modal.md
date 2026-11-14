# 0016. Education cards with details modal

- Status: Accepted
- Date: 2026-11-14

## Context

`/edukacja/` rendered articles as a single-column accordion: the page was a long
stack of closed bars, and expanding a few articles made it even longer. Recipe
cards already open a details modal with hash deep links (ADR 0015), and the same
interaction fits educational articles while making the section easier to scan.

## Decision

- Render articles as a responsive three-column card grid (`.edu-grid` /
  `.edu-card`) showing the title, teaser, and a "Czytaj więcej" affordance.
- Turn each card into a click target with an invisible overlay button
  (`aria-haspopup="dialog"`, `aria-controls`). The title and teaser stay in the
  static HTML for layout and crawlers.
- Render one native `<dialog class="edu-modal">` per article outside the grid,
  containing the title, teaser, and full MDX body (or a placeholder when the
  body is empty).
- Open dialogs with `showModal()`; close on the close button, backdrop click,
  Escape, and browser Back. Only one dialog is open at a time.
- Use the hash `#edukacja-<slug>` for deep links. Opening a dialog pushes the
  hash, closing clears it with `replaceState`, and `hashchange` opens or closes
  the matching dialog.
- Derive the slug from the content entry ID by transliterating Polish
  characters and replacing non-alphanumeric runs, because HTML IDs and URLs
  cannot contain spaces. For example `dieta - zalecenia praktyczne.mdx`
  becomes `#edukacja-dieta-zalecenia-praktyczne`.
- Share the modal styles with recipes through grouped CSS selectors while
  keeping the `edu-*` class names in the markup.

## Consequences

- The full MDX body is present in the static HTML inside closed dialogs, so
  links and assets in articles are validated by `check-dist`.
- No hydration or framework component is needed; the interaction is a small
  vanilla script, mirroring the recipe page.
- The grid collapses to one column at `760px`, like the recipe grid.
- Deep links stay stable as long as the source file name is unchanged; renaming
  a content file changes its URL.
- Keep dialogs outside any container that can be hidden, because `display: none`
  prevents `showModal()` from rendering them.
