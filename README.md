# Holimedicine website

The website for Natalia i Donat Cupiał — family medicine and a holistic approach
to health. Built with **Astro** (static output), **Tailwind CSS v4**, and
**Keystatic** as a Git-based CMS.

Live: https://holimedicine.github.io/website/

## Stack

- **Astro** — pages in `src/pages/*.astro`, shared UI in `src/components` and
  `src/layouts`.
- **Tailwind CSS v4** (via PostCSS) — the whole theme lives in
  `src/styles/global.css` (`@theme` tokens + `@layer components`).
- **Keystatic** — admin UI at `/keystatic/`; content is stored as MDX in the repo.
- **GitHub Actions** — builds and deploys to GitHub Pages on every push to `main`.

## Content

Two collections, one MDX file per entry:

- `src/content/edukacja/*.mdx` — educational articles.
- `src/content/przepisy/*.mdx` — recipes.

Both are editable through the Keystatic admin in dev (requires a GitHub App; see
`.env.example`). Recipe images live at
`public/images/przepisy/<slug>/coverImage.jpg`.

## Commands

| Command             | Action                                                        |
| ------------------- | ------------------------------------------------------------- |
| `npm install`       | Install dependencies                                          |
| `npm run dev`       | Dev server at `localhost:4321` (admin at `/keystatic/`)       |
| `npm run build`     | Static production build to `./dist/`                          |
| `npm run preview`   | Preview the build at `localhost:4322/website/`                |
| `npm run typecheck` | Type-check with `tsc`                                         |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages. Requires **Settings → Pages → Source = "GitHub
Actions"** (one-time). You never commit build output.

## Architecture decisions

See [`docs/adr/`](./docs/adr/README.md) for the reasoning behind the framework,
styling, CMS, content model, deploy and base-path choices.
