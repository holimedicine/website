# 0003. Use Keystatic as the CMS with GitHub storage

- Status: Accepted
- Date: 2026-10-01

## Context

A non-developer needs to edit `edukacja` articles and `przepisy` recipes. The
repo lives on GitHub and deploys statically, so the CMS must be able to read and
write files in the repository.

## Decision

Use **Keystatic** with **GitHub storage**.

- Config: `keystatic.config.ts`, `storage: { kind: 'github', repo: 'holimedicine/website' }`.
- Collections: `edukacja` and `przepisy` (see ADR 0004 for the fields).
- Admin UI served by `@keystatic/astro` at `/keystatic/`.
- Authentication is a GitHub App. Required env vars (see `.env.example`):
  - `KEYSTATIC_GITHUB_CLIENT_ID`
  - `KEYSTATIC_GITHUB_CLIENT_SECRET`
  - `KEYSTATIC_SECRET`
  - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

GitHub App setup: homepage `http://localhost:4321`, callback
`http://localhost:4321/api/keystatic/github/oauth/callback`, and repository
permission **Contents: Read & write**.

## Consequences

- Editing content in the CMS creates a commit on `main`, which triggers the
  deploy workflow (ADR 0006). No manual rebuild needed.
- `.env` must exist locally for login; it is gitignored. Without the GitHub App
  credentials the admin redirects to `/keystatic/setup`.
- Keystatic's admin/API routes are server-rendered, so they cannot be part of the
  static build — see ADR 0005.
