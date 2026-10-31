# 0013. Playwright E2E tests gated by builds and CI

- Status: Accepted
- Date: 2026-10-31

## Context

The site is statically rendered, but several behaviours live in inline scripts:
the nav active state and homepage scroll-spy, the edukacja accordion, and the
przepisy tabs. The production build also runs under `/website/`, where a missing
`withBase()` call produces links that work in dev but 404 on GitHub Pages.

The project had no automated checks for these behaviours. Manual verification is
error-prone, especially for base-path regressions and content ordering.

Keystatic uses GitHub storage, so content edits create commits through the GitHub
API. Local Git hooks never run for those commits.

## Decision

Use Playwright E2E tests against the production build, and make builds and pushes
test-gated:

- `npm run build:site` builds and runs `scripts/check-dist.mjs`, a browser-free
  validator for base-path leaks and missing local links/assets in `dist/`.
- `npm run build` = `build:site` + the full Playwright suite.
- `npm run verify` = typecheck + `build`.
- Husky runs `verify` on pre-commit, unless every staged file is under
  `src/content/**` or `public/images/**`; in that case it runs `build:site`.
- CI runs on every push and pull request. It always runs `build:site`, and runs
  typecheck + Playwright only when the changed paths include anything outside
  `src/content/**` and `public/images/**`.
- The GitHub Pages deploy workflow applies the same path filter, so content-only
  pushes still deploy after `build:site` without waiting for E2E.
- Tests live in `tests/e2e/` and run against `http://127.0.0.1:4323/website/`
  (`npm run preview -- --port 4323`).

## Consequences

- Behavioural regressions and base-path leaks are caught before deploy for code
  changes.
- Content-only commits stay fast: they still get schema, MDX, link, and asset
  validation, but skip the browser suite.
- Keystatic commits bypass the pre-commit hook; the CI path filter is the
  enforcement point for them.
- Content-only changes can still cause rendering regressions that only E2E would
  notice (for example, a content-driven layout issue). Run `npm run verify`
  manually when changing content structure.
- Adding a new content directory or asset location requires updating the path
  filter in `.husky/pre-commit`, `.github/workflows/ci.yml`, and
  `.github/workflows/deploy.yml`.
- `npm run build` is slower and requires Playwright browsers; install Chromium
  once with `npx playwright install chromium`.
