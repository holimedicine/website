# Glossary

Key domain terms and technical concepts for `holimedicine-website`.

## Domain terms

| Term | Definition |
| :--- | :--- |
| **edukacja** | Collection of educational articles (`src/content/edukacja/`), rendered as an accordion on `/edukacja/`. |
| **przepisy** | Collection of recipes (`src/content/przepisy/`), rendered as cards on `/przepisy/`. |
| **na-wynos** | Recipe category shown in the "Na wynos" tab on `/przepisy/`. |
| **dania** | Recipe category shown in the "Dania" tab on `/przepisy/`. |
| **Polecane produkty** | Product and supplement recommendations page (`src/pages/produkty.astro`); content is hardcoded, not CMS-managed. |
| **O nas** | Homepage section (`#o-nas`) backed by the `about` singleton. |
| **Podejście** | Homepage section (`#podejscie`) backed by the `podejscie` singleton. |
| **Zakres opieki** | Homepage section (`#zakres`) backed by the `zakres` singleton. |
| **Kontakt** | Homepage section (`#kontakt`) backed by the `contact` singleton; the nav CTA links here. |

## Technical terms

| Term | Definition |
| :--- | :--- |
| **ADR** | Architecture Decision Record in `docs/adr/`; see `docs/adr/README.md` for the index and rules. |
| **Astro** | Static site generator used for the site; pages live in `src/pages/`. |
| **content collection** | Astro collection defined in `src/content.config.ts` and loaded from `src/content/`. |
| **singleton** | Single fixed content entry for a homepage section; a Keystatic singleton read via `getEntry()` from a one-file Astro collection. |
| **Keystatic** | Git-based CMS used to edit content; the admin runs only in dev at `/keystatic/`. |
| **GitHub storage** | Keystatic storage mode that reads and writes content by committing to `holimedicine/website`. |
| **MDX** | Markdown + JSX format used for article, recipe, and some singleton bodies. |
| **Tailwind CSS v4** | Styling system used via PostCSS; the theme lives in `src/styles/global.css`. |
| **PostCSS** | CSS pipeline that runs the `@tailwindcss/postcss` plugin (`postcss.config.mjs`). |
| **base path** | Production URL prefix `/website/`; dev uses `/`. See ADR 0007. |
| **withBase()** | Utility (`src/utils/url.ts`) that prepends the base path to root-relative URLs. MUST be used for all links/assets. |
| **KEYSTATIC_DISABLED** | Env var set by `npm run build`/`preview` to exclude CMS routes from the static build. |
| **static build** | `npm run build` output in `dist/`, deployed to GitHub Pages; no server runtime. |
