import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../../utils/search-index';

export const prerender = true;

/** Static client-side search index; fetched only on /szukaj/. */
export const GET: APIRoute = async () => {
  const entries = await buildSearchIndex();

  return new Response(JSON.stringify({ entries }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
