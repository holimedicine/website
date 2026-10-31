# Holimedicine website

Astro (static) + Tailwind CSS v4 + Keystatic CMS, deployed to GitHub Pages at
`https://holimedicine.github.io/website/`.

Content for **edukacja** (articles) and **przepisy** (recipes) is managed as MDX
content collections, editable through the Keystatic admin.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Commands

| Command                           | What it does                                                       |
| --------------------------------- | ------------------------------------------------------------------ |
| `npm run dev`                     | Dev server at `/` (Keystatic admin at `/keystatic/`)               |
| `npm run build`                   | Build, validate links/assets, and run E2E tests                    |
| `npm run build:site`              | Build and validate links/assets only                               |
| `npm run test:e2e`                | Build, validate links/assets, and run E2E tests                    |
| `npm run test:e2e:ui`             | Open the Playwright UI                                             |
| `npm run preview`                 | Preview the production build at `http://localhost:4322/website/`   |
| `npm run typecheck`               | Generate Astro types (`astro sync`) and run `tsc --noEmit`         |
| `npm run verify`                  | Typecheck + build + link/asset validation + E2E                    |
| `npx playwright install chromium` | Install the browser used by E2E tests (once per machine)           |

## Key facts & gotchas

- **Keystatic is dev-only.** The admin/API routes are server-rendered and are
  excluded from the static build via `KEYSTATIC_DISABLED=1` (set in the npm
  scripts). Never deploy them.
- **Tailwind import is special:** use `@import "tailwindcss/index.css";` in
  `src/styles/global.css` — plain `@import "tailwindcss";` breaks PostCSS here.
- **Base path:** production runs under `/website/`, dev at `/`. Every root-relative
  link/asset must be wrapped with `withBase()` from `src/utils/url.ts`.
- **Content fields:** when changing a collection, keep `keystatic.config.ts` and
  `src/content.config.ts` in sync.
- **Builds are test-gated:** `npm run build` runs `scripts/check-dist.mjs` and
  the Playwright E2E suite. Content-only commits (only `src/content/**` or
  `public/images/**`) run `npm run build:site` and skip E2E; see ADR 0013.
- **E2E setup:** run `npx playwright install chromium` once before the first
  build/test. Tests run against the production build at `/website/`.
- **Never commit `dist/`** (gitignored). Deployment is handled by GitHub Actions.

## Architecture decisions

Significant decisions are recorded in [`docs/adr/`](./docs/adr/README.md). Read the
relevant ADR before changing an area it covers (styling, CMS, content model,
deploy, base path).

### Maintaining ADRs

Read the relevant ADR before changing a covered area, and update ADRs in the same
change as the code they describe. Add one for significant decisions (framework,
CMS or content model, routing/deploy, client-side strategy); skip bug fixes, copy,
and style tweaks. The full rules — amendment/supersession, numbering, index, and
template — are in [`docs/adr/README.md`](./docs/adr/README.md).

### Maintaining the glossary

[`GLOSSARY.md`](./GLOSSARY.md) defines domain and project-specific technical
terms. Update it in the same change:

- Add or update an entry when you introduce, rename, or repurpose a term used in
  code, content, or docs (collection, singleton, page section, helper, …).
- Keep definitions short and point to the canonical file or component.
- Skip generic framework vocabulary unless the project gives it a specific
  meaning.

Consult it before naming new files, fields, components, or content sections.

## Skills

Use the `holimedicine-dev` skill for common development tasks.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
