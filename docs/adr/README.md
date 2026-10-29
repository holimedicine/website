# Architecture Decision Records (ADRs)

This folder records the significant architectural decisions made while migrating
the site from hand-written static HTML to an Astro + Keystatic project. Read the
relevant ADR **before** changing an area it covers — several decisions look
arbitrary without the surrounding context.

This file is the canonical ADR process; [`AGENTS.md`](../../AGENTS.md) points here
rather than duplicating the rules.

## Index

| #                                               | Title                                                  | Status   | Date                            |
| ----------------------------------------------- | ------------------------------------------------------ | -------- | ------------------------------- |
| [0001](./0001-migrate-to-astro.md)              | Migrate the static site to Astro                       | Accepted | 2026-10-01                      |
| [0002](./0002-tailwind-v4-via-postcss.md)       | Styling with Tailwind CSS v4 via PostCSS               | Accepted | 2026-10-01                      |
| [0003](./0003-keystatic-cms.md)                 | Use Keystatic as the CMS with GitHub storage           | Accepted | 2026-10-01                      |
| [0004](./0004-content-collections-mdx.md)       | Manage edukacja/przepisy as MDX content collections    | Accepted | 2026-10-01                      |
| [0005](./0005-keystatic-dev-only.md)            | Keystatic runs in dev only; production build is static | Accepted | 2026-10-01                      |
| [0006](./0006-github-pages-deploy.md)           | Deploy to GitHub Pages with GitHub Actions             | Accepted | 2026-10-01                      |
| [0007](./0007-base-path-and-withbase.md)        | Project-page base path and the `withBase()` helper     | Accepted | 2026-10-01                      |
| [0008](./0008-homepage-content-in-keystatic.md) | Manage homepage content as Keystatic singletons        | Accepted | 2026-10-27 (amended 2026-10-30) |
| [0009](./0009-remove-galeria-and-opinie.md)     | Remove the Galeria page and Opinie section             | Accepted | 2026-10-27                      |
| [0010](./0010-nav-active-state.md)              | Nav active state and homepage scroll-spy               | Accepted | 2026-10-27                      |
| [0011](./0011-remove-subpage-back-link.md)      | Remove the subpage "back to homepage" link             | Accepted | 2026-10-29                      |
| [0012](./0012-nav-responsive-breakpoint.md)     | Responsive nav breakpoint and mobile CTA               | Accepted | 2026-10-29                      |

## When to add an ADR

Add one when a change is architecturally significant:

- framework, build, or dependency changes;
- CMS or content-model changes (fields, collections, singletons, storage);
- routing, base path, or deployment changes;
- client-side strategy (hydration, scripts, third-party embeds);
- any decision that would look arbitrary without context.

Do not add one for bug fixes, copy edits, styling tweaks, or reversible
refactors. When in doubt, prefer a short ADR over losing the reasoning.

## Maintaining ADRs

- ADRs are historical records: do not rewrite an accepted decision.
- If a decision evolves, add `Amended: YYYY-MM-DD — what changed` to the ADR and
  update its row in the index.
- If a decision is reversed, set `Status: Superseded by NNNN` and write a new ADR.
- Update ADRs in the same change as the code they describe.

## Adding a new ADR

1. Copy the template below into `NNNN-short-title.md` (next number, zero-padded).
2. Add a row to the index table above, including the date.
3. Keep it short: context, decision, consequences. Include gotchas.

```markdown
# NNNN. Title

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD
- Amended: YYYY-MM-DD — what changed (optional)

## Context

What is the problem and the forces at play?

## Decision

What did we decide, and why?

## Consequences

What becomes easier or harder? Any gotchas worth remembering?
```
