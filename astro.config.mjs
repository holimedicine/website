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

// The site is served from the custom domain at the root (ADR 0021), so no
// project-page subpath is needed anymore. Dev and production both use `/`.
const base = '/';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://holimedicine.eu',
  base,
  integrations: [
    react(),
    mdx(),
    ...(keystaticEnabled ? [keystatic()] : []),
  ],
});
