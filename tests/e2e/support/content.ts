import fs from 'node:fs';
import path from 'node:path';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content');

export type ContentEntry = {
  file: string;
  slug: string;
  title: string;
  order: number;
  coverImage?: string;
};

export type CategoryEntry = {
  slug: string;
  title: string;
  order: number;
  recipes: string[];
};

type Frontmatter = Record<string, string | number | undefined>;

function parseFrontmatter(source: string): Frontmatter {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s/.test(line)) continue;

    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (!key) continue;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = key === 'order' ? Number(value) : value;
  }

  return data;
}

export function listEntries(collection: 'edukacja' | 'przepisy'): ContentEntry[] {
  const directory = path.join(CONTENT_ROOT, collection);
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => {
      const source = fs.readFileSync(path.join(directory, file), 'utf8');
      const data = parseFrontmatter(source);
      return {
        file,
        slug: file.replace(/\.(md|mdx)$/, ''),
        title: String(data.title ?? ''),
        order: Number(data.order ?? 0),
        coverImage: data.coverImage ? String(data.coverImage) : undefined,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function listCategories(): CategoryEntry[] {
  const directory = path.join(CONTENT_ROOT, 'kategorie-przepisow');
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) as {
        title?: string;
        order?: number;
        recipes?: unknown;
      };
      const recipes = Array.isArray(data.recipes)
        ? data.recipes.filter((slug): slug is string => typeof slug === 'string')
        : [];
      return {
        slug: file.slice(0, -'.json'.length),
        title: String(data.title ?? ''),
        order: Number(data.order ?? 0),
        recipes,
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pl'));
}
