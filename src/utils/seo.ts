/** Production origin configured as `site` in `astro.config.mjs`. */
export const SITE_URL = import.meta.env.SITE ?? 'https://holimedicine.eu';

/** Brand name used in titles, Open Graph tags and JSON-LD. */
export const SITE_NAME = 'Holimedicine';

const hasFileExtension = (pathname: string) => /\.[a-z0-9]+$/i.test(pathname);

/**
 * Normalizes a pathname to the trailing-slash form the static build serves.
 * File paths (`/sitemap-index.xml`, `/favicon.svg`) are returned untouched.
 */
export function normalizePath(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (path === '/') return '/';
  if (path.endsWith('/') || hasFileExtension(path)) return path;
  return `${path}/`;
}

/**
 * Absolute production URL for a path. Canonicals and Open Graph URLs always
 * point at `site`, even when the page is rendered by the dev server.
 */
export function absoluteUrl(pathname: string): string {
  return new URL(normalizePath(pathname), SITE_URL).href;
}
