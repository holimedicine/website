// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';

// Keystatic's admin + API routes are server-rendered. GitHub Pages is static,
// so the CMS is only mounted while running `npm run dev`. Content is compiled
// to static HTML at build time (`npm run build` sets KEYSTATIC_DISABLED=1).
const isBuild = process.env.KEYSTATIC_DISABLED === '1';
const keystaticEnabled = !isBuild;

// Project page is served from https://holimedicine.github.io/website/.
// Base is only applied for production builds so the local dev server (and the
// Keystatic admin at /keystatic) keep working from the root.
const base = isBuild ? '/website/' : '/';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://holimedicine.github.io',
  base,
  integrations: [
    react(),
    mdx(),
    ...(keystaticEnabled ? [keystatic()] : []),
  ],
});
