import { getCollection } from 'astro:content';
import type { SearchEntry } from './search-text';
import { slugify } from './slug';
import { withBase } from './url';

/** Converts an MDX body to searchable plain text. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/^\s*(?:import|export)\s.+$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/^\s*(?:[-+*]|\d+\.)\s+/gm, ' ')
    .replace(/[*_~`>|\\]/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds the search index from the collections that make up "Baza wiedzy" and
 * recipes. Products are limited to the ones rendered as cards, because only
 * those have a modal to deep-link to.
 */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [edukacja, przepisy, produkty, sekcje] = await Promise.all([
    getCollection('edukacja'),
    getCollection('przepisy'),
    getCollection('produkty'),
    getCollection('sekcjeProduktow'),
  ]);

  const cardProductIds = new Set<string>();
  for (const section of sekcje) {
    if (section.data.display !== 'cards') continue;
    for (const id of section.data.items) cardProductIds.add(id);
  }

  const entries: SearchEntry[] = [];

  const articles = [...edukacja].sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'pl')
  );
  for (const entry of articles) {
    entries.push({
      type: 'edukacja',
      title: entry.data.title,
      summary: entry.data.teaser ?? '',
      text: toPlainText(entry.body ?? ''),
      url: withBase(`/edukacja/#edukacja-${slugify(entry.id)}`),
    });
  }

  const recipes = [...przepisy].sort((a, b) => a.data.title.localeCompare(b.data.title, 'pl'));
  for (const entry of recipes) {
    entries.push({
      type: 'przepis',
      title: entry.data.title,
      summary: entry.data.summary ?? entry.data.tag ?? '',
      text: [entry.data.tag, toPlainText(entry.body ?? '')].filter(Boolean).join(' '),
      url: withBase(`/przepisy/#przepis-${entry.id}`),
    });
  }

  const products = [...produkty]
    .filter((entry) => cardProductIds.has(entry.id))
    .sort((a, b) => a.data.title.localeCompare(b.data.title, 'pl'));
  for (const entry of products) {
    const details = entry.data.details
      .map((detail) => `${detail.label} ${detail.value}`)
      .join(' ');

    entries.push({
      type: 'produkt',
      title: entry.data.title,
      summary: entry.data.summary ?? entry.data.examples ?? '',
      text: [entry.data.examples, details, toPlainText(entry.body ?? '')]
        .filter(Boolean)
        .join(' '),
      url: withBase(`/produkty/#produkt-${slugify(entry.id)}`),
    });
  }

  return entries;
}
