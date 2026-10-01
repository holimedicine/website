# Architecture Decision Records (ADRs)

This folder records the significant architectural decisions made while migrating
the site from hand-written static HTML to an Astro + Keystatic project. Read the
relevant ADR **before** changing an area it covers — several decisions look
arbitrary without the surrounding context.

## Index

| #                                           | Title                                                       | Status   |
| ------------------------------------------- | ----------------------------------------------------------- | -------- |
| [0001](./0001-migrate-to-astro.md)          | Migrate the static site to Astro                           | Accepted |
| [0002](./0002-tailwind-v4-via-postcss.md)   | Styling with Tailwind CSS v4 via PostCSS                    | Accepted |
| [0003](./0003-keystatic-cms.md)             | Use Keystatic as the CMS with GitHub storage                | Accepted |
| [0004](./0004-content-collections-mdx.md)   | Manage edukacja/przepisy as MDX content collections         | Accepted |
| [0005](./0005-keystatic-dev-only.md)        | Keystatic runs in dev only; production build is static      | Accepted |
| [0006](./0006-github-pages-deploy.md)       | Deploy to GitHub Pages with GitHub Actions                  | Accepted |
| [0007](./0007-base-path-and-withbase.md)    | Project-page base path and the `withBase()` helper          | Accepted |

## Adding a new ADR

1. Copy the template below into `NNNN-short-title.md` (next number, zero-padded).
2. Add a row to the index table above.
3. Keep it short: context, decision, consequences.

```markdown
# NNNN. Title

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD

## Context

What is the problem and the forces at play?

## Decision

What did we decide, and why?

## Consequences

What becomes easier or harder? Any gotchas worth remembering?
```
