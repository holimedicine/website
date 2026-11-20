# 0022. Profile cards with popups and per-doctor galleries

- Status: Accepted
- Date: 2026-11-20

## Context

The **O nas** section listed both doctors' full bios inside their cards, so the
cards grew with every added sentence and pushed the rest of the homepage down.
The bios also mention credentials (certificates and course confirmations) that
deserve a visual reference without turning the homepage into a document archive.
Editors need to attach graphics to a specific doctor through Keystatic, without
editing markup or guessing which image belongs to whom.

## Decision

- Keep the single `about` singleton and extend each `profiles` item with a
  `gallery` array: `image`, `alt`, `caption`, and an optional `document`.
  Nesting the gallery inside the profile makes the assignee explicit in the CMS.
- Clamp the card bio to four lines with CSS (`-webkit-line-clamp: 4`) and always
  render a "Czytaj więcej →" label at the bottom of the card. The whole card is
  clickable through an absolutely positioned button, following the
  collaboration-card pattern.
- Render one native `<dialog class="profile-modal">` per profile and reuse
  `initModalGroup()` (`src/scripts/modals.ts`) for open/close, Escape, backdrop
  clicks, scroll locking, and hash deep links. Dialog IDs are derived from the
  person's name, e.g. `#profil-donat-cupial`.
- Show the full bio as paragraphs and, at the bottom of the popup, a horizontally
  scrollable gallery. A gallery item links to its original document (PDF) in a
  new tab when `document` is set; the preview image is a separate field so mobile
  browsers never have to embed a PDF.
- Store uploaded gallery images in `public/images/o-nas/` and documents in
  `public/dokumenty/`; both are Keystatic upload targets.

## Consequences

- New graphics can be added in Keystatic per doctor without touching code.
- A gallery item requires a preview image; the document link is optional.
- Deep-link slugs depend on the person's name, so renaming a doctor changes
  their popup URL.
- E2E coverage lives in `tests/e2e/profiles.spec.ts`; the content reader lives in
  `tests/e2e/support/content.ts`.
