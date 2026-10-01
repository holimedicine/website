const BASE_URL = import.meta.env.BASE_URL;

/**
 * Prefixes a root-relative path with Astro's configured `base`.
 * External URLs, protocol-relative URLs and bare anchors are returned as-is.
 *
 * withBase('/edukacja') -> '/website/edukacja' (prod) | '/edukacja' (dev)
 */
export function withBase(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  if (path === '/') return `${base}/`;
  return base + (path.startsWith('/') ? path : `/${path}`);
}
