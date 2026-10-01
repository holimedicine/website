# 0006. Deploy to GitHub Pages with GitHub Actions

- Status: Accepted
- Date: 2026-10-01

## Context

GitHub Pages only serves pre-built static files; it never runs a build. Because
content is edited through Keystatic (which commits to the repo), every content
change must be rebuilt automatically. Committing build output by hand is not an
option.

## Decision

Deploy via **GitHub Actions**, building on every push to `main`.

- Workflow: `.github/workflows/deploy.yml`.
  - Triggers: `push` to `main`, plus `workflow_dispatch`.
  - `npm ci` → `npm run build` (static, `KEYSTATIC_DISABLED=1`) → upload `dist/`
    via `actions/upload-pages-artifact` → `actions/deploy-pages`.
  - Node 22 (matches `engines.node >= 22.12.0`).
  - Permissions: `contents: read`, `pages: write`, `id-token: write`.

## Consequences

- You commit **source only**; `dist/` and `.astro/` are gitignored. GitHub
  builds and publishes automatically.
- One-time repo setting: **Settings → Pages → Build and deployment → Source =
  "GitHub Actions"**. Without it the deploy job has no target.
- Deploys are gated on a green build; a broken push will not publish.
- URL/base path implications are covered in ADR 0007.
