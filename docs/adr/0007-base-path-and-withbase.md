# 0007. Project-page base path and the `withBase()` helper

- Status: Accepted
- Date: 2026-10-01

## Context

The repo is `holimedicine/website`, so the GitHub Pages **project page** is served
from a subpath: `https://holimedicine.github.io/website/`. Astro's `base` option
must reflect that, or links and assets 404.

Two problems surfaced:

1. Astro only prepends `base` to **bundled** assets (CSS/JS it processes). It does
   **not** rewrite hardcoded `href="/…"` links or `src="/images/…"` public paths.
2. Applying `base` in dev moves the dev server (and the Keystatic admin) under
   `/website/`, which complicates local CMS auth.

## Decision

Apply `base` **only for production builds**, and centralise link building.

`astro.config.mjs`:

```js
const isBuild = process.env.KEYSTATIC_DISABLED === '1';
const base = isBuild ? '/website/' : '/';
```

`src/utils/url.ts`:

```ts
const BASE_URL = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('#') ||
      path.startsWith('mailto:') || path.startsWith('tel:')) return path;
  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  if (path === '/') return `${base}/`;
  return base + (path.startsWith('/') ? path : `/${path}`);
}
```

Every root-relative link/asset goes through it: `Nav.astro`, `PageHeader.astro`,
`Layout.astro` (favicons), `index.astro`, `galeria.astro`, and recipe
`coverImage` in `przepisy.astro`.

## Consequences

- **Dev** runs at `http://localhost:4321/` with Keystatic at `/keystatic/`.
  **Production/preview** runs under `/website/`.
- New components must wrap root-relative `href`/`src` with `withBase()`; forgetting
  this produces links that work in dev but 404 on Pages.
- Preview locally with `npm run preview` (then hit
  `http://localhost:4322/website/`).
- Switching to a custom domain later means: set `base` to `/` (both dev and prod),
  remove the build-only conditional, and add a `public/CNAME` file.
