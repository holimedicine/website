# 0020. Collaborator directory page behind a collaboration CTA

- Status: Accepted
- Date: 2026-11-18
- Amended: 2026-11-19 — the directory is also reachable from a hover/focus
  dropdown under "Współpraca" in the desktop nav and from an indented link in
  the mobile menu.

## Context

The collaboration page should link to a separate directory of the specialists the
practice works with. The directory groups people by profession (dietitians,
physiotherapists, midwives, doctors) and shows each person's photo, workplace, a
short bio, and an optional profile link. The page must not appear in the main
navigation; editors reach it only through the CTA on `/wspolpraca/`.

The directory needs the same collapsible feel as the price list, but with enough
room for cards of people. The copy and the list of collaborators must be editable
in Keystatic like the other content.

## Decision

- Add a `professions` content collection (`src/content/professions/*.json`). Each
  entry has a title, order, summary, and an ordered `members` array with name,
  role, workplace, photo, photo alt, bio, and optional link/label.
- Extend the `wspolpraca` singleton with the directory CTA label and the
  directory page header fields (`partnersEyebrow`, `partnersHeading`,
  `partnersLead`). This keeps all collaboration-related copy in one entry.
- Add an optional `aside` slot to `PageHeader.astro`; pages without the slot keep
  the previous single-column header. `/wspolpraca/` renders the CTA in that slot.
- Render the directory at `/wspolpraca/partnerzy/` with native `<details>`
  accordions in the style of the price list, and collaborator cards inside.
- Do not add the directory to `Nav.astro`. It remains reachable only from the CTA,
  though the static page is still available by direct URL.
- Cover the new page with E2E and base-path tests; keep photo assets under
  `public/images/collaborators/` and pass their paths through `withBase()`.

## Consequences

- Editors add or reorder people in Keystatic under "Współpraca"; missing photos
  fall back to an initials avatar, so a profile can be published before a photo
  is available.
- The directory is a static page like every other route. "Hidden" means no
  navigation link, not access control.
- Published photos and personal data are the practice's responsibility; only
  people who agreed to appear should be listed.
- `PageHeader` now supports a two-column layout on wide screens; its other uses
  are unchanged unless they pass an `aside` slot.
