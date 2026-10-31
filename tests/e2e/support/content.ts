import fs from 'node:fs';
import path from 'node:path';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content');

export type ContentEntry = {
  file: string;
  title: string;
  order: number;
  category?: string;
  coverImage?: string;
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
        title: String(data.title ?? ''),
        order: Number(data.order ?? 0),
        category: data.category ? String(data.category) : undefined,
        coverImage: data.coverImage ? String(data.coverImage) : undefined,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function listByCategory(category: string): ContentEntry[] {
  return listEntries('przepisy').filter((entry) => entry.category === category);
}
