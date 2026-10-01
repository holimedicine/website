# 0005. Keystatic runs in dev only; production build is static

- Status: Accepted
- Date: 2026-10-01

## Context

Keystatic's admin UI and API routes use `prerender: false` (server-rendered).
GitHub Pages only serves static files, so those routes cannot be included in the
production build.

## Decision

Mount the Keystatic integration **only in dev**, and make the production build a
pure static export.

- `package.json` scripts set an env flag for the static build/preview:
  - `"build": "KEYSTATIC_DISABLED=1 astro build"`
  - `"preview": "KEYSTATIC_DISABLED=1 astro preview"`
- `astro.config.mjs` reads the flag:

```js
const isBuild = process.env.KEYSTATIC_DISABLED === '1';
const keystaticEnabled = !isBuild;
...
...(keystaticEnabled ? [keystatic()] : []),
```

## Consequences

- The CMS is reachable at `/keystatic/` only while running `npm run dev`; it is
  never deployed. Editing still works because the CMS commits to GitHub, and the
  deploy workflow rebuilds the static site (ADR 0006).
- `KEYSTATIC_DISABLED=1` must be present on any command that produces the static
  output (this is why it lives in the npm scripts).

### Gotcha: `defineConfig(({ command }) => …)` is not called

In this Astro version the **function form of `defineConfig` is not invoked**, so
conditional integrations cannot be expressed that way. Use the env-var object
form above instead. (Verified during the migration.)
