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

| Command             | What it does                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `npm run dev`       | Dev server at `/` (Keystatic admin at `/keystatic/`)                      |
| `npm run build`     | Static production build (`KEYSTATIC_DISABLED=1`) → `dist/`                 |
| `npm run preview`   | Preview the production build at `http://localhost:4322/website/`           |
| `npm run typecheck` | `tsc --noEmit`                                                            |

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
- **Never commit `dist/`** (gitignored). Deployment is handled by GitHub Actions.

## Architecture decisions

Significant decisions are recorded in [`docs/adr/`](./docs/adr/README.md). Read the
relevant ADR before changing an area it covers (styling, CMS, content model,
deploy, base path).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
