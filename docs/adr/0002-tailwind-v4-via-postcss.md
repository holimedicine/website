# 0002. Styling with Tailwind CSS v4 via PostCSS

- Status: Accepted
- Date: 2026-10-01

## Context

The legacy theme lived in a single 500+ line `style.css`. We wanted utility
classes plus a small set of reusable component classes, without rewriting every
value by hand.

Tailwind CSS v4 was chosen. The Vite plugin (`@tailwindcss/vite`) was tried first
but did not work reliably in this setup, so it was uninstalled.

## Decision

Use Tailwind v4 through **PostCSS**:

- Dependency: `@tailwindcss/postcss` (plus `tailwindcss`).
- `postcss.config.mjs` registers the plugin.
- `src/styles/global.css` is imported once by `src/layouts/Layout.astro` and
  contains the whole design system:
  - `@theme` tokens (`--color-bg`, `--color-accent-red`, `--color-accent-gold`,
    `--font-serif`, …),
  - `@layer base` for element defaults,
  - `@layer components` with the ported legacy classes (`.nav`, `.hero`, cards,
    grids, accordion, tables, `.reveal`, …) built with `@apply`.

### Known gotcha

`@import "tailwindcss";` fails under this PostCSS setup with:

```
[postcss] ENOENT: no such file or directory, open '.../tailwindcss'
```

The import must point at the explicit file:

```css
@import "tailwindcss/index.css";
```

## Consequences

- All styling flows through `global.css`; new component styles go in
  `@layer components` to stay consistent with the ported theme.
- Do **not** re-add `@tailwindcss/vite` without re-testing the build.
- Keep the `tailwindcss/index.css` import path; it is intentional, not a typo.
