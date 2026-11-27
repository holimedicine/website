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
 * those have a modal to deep-link to. Draft knowledge-base articles are
 * excluded: they have no public page.
 */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [edukacja, przepisy, produkty, sekcjeBazyWiedzy, tematyBazyWiedzy, sekcjeProduktow] =
    await Promise.all([
      getCollection('edukacja'),
      getCollection('przepisy'),
      getCollection('produkty'),
      getCollection('sekcjeBazyWiedzy'),
      getCollection('tematyBazyWiedzy'),
      getCollection('sekcjeProduktow'),
    ]);

  const cardProductIds = new Set<string>();
  for (const section of sekcjeProduktow) {
    if (section.data.display !== 'cards') continue;
    for (const id of section.data.items) cardProductIds.add(id);
  }

  const sectionsById = new Map(
    sekcjeBazyWiedzy.map((section) => [section.id, section])
  );
  const topicsById = new Map(
    tematyBazyWiedzy.map((topic) => [topic.id, topic])
  );
  const sectionOrder = new Map(
    [...sekcjeBazyWiedzy]
      .sort((a, b) => a.data.order - b.data.order)
      .map((section, index) => [section.id, index])
  );
  const topicOrder = new Map(
    [...tematyBazyWiedzy]
      .sort((a, b) => a.data.order - b.data.order)
      .map((topic, index) => [topic.id, index])
  );

  const entries: SearchEntry[] = [];

  const articles = edukacja
    .filter((entry) => entry.data.status === 'published')
    .sort((a, b) => {
      const sectionDiff =
        (sectionOrder.get(a.data.section) ?? 0) - (sectionOrder.get(b.data.section) ?? 0);
      if (sectionDiff !== 0) return sectionDiff;

      const topicDiff =
        (topicOrder.get(a.data.topic ?? '') ?? 0) -
        (topicOrder.get(b.data.topic ?? '') ?? 0);
      if (topicDiff !== 0) return topicDiff;

      return a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'pl');
    });

  for (const entry of articles) {
    const section = sectionsById.get(entry.data.section);
    const topic = entry.data.topic ? topicsById.get(entry.data.topic) : undefined;
    const url = entry.data.topic
      ? `/baza-wiedzy/${entry.data.section}/${entry.data.topic}/${entry.id}/`
      : `/baza-wiedzy/${entry.data.section}/${entry.id}/`;

    entries.push({
      type: 'artykul',
      title: entry.data.title,
      summary: entry.data.teaser ?? '',
      text: [
        section?.data.title,
        topic?.data.title,
        toPlainText(entry.body ?? ''),
      ]
        .filter(Boolean)
        .join(' '),
      url: withBase(url),
    });
  }

  const recipes = [...przepisy].sort((a, b) =>
    a.data.title.localeCompare(b.data.title, 'pl')
  );
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
