import fs from 'node:fs';
import path from 'node:path';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content');

export type ContentEntry = {
  file: string;
  slug: string;
  title: string;
  order: number;
  coverImage?: string;
  hasContent: boolean;
};

export type CategoryEntry = {
  slug: string;
  title: string;
  order: number;
  recipes: string[];
};

type Frontmatter = Record<string, string | number | undefined>;

function hasBody(source: string): boolean {
  const match = source.match(/^---\r?\n[\s\S]*?\r?\n---/);
  return (match ? source.slice(match[0].length) : source).trim().length > 0;
}

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

    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        value = JSON.parse(value) as string;
      } catch {
        value = value.slice(1, -1);
      }
    } else if (value.startsWith("'") && value.endsWith("'")) {
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
        hasContent: hasBody(source),
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

export type ProductEntry = {
  file: string;
  slug: string;
  title: string;
  examples?: string;
  summary?: string;
  hasContent: boolean;
};

export function listProducts(): ProductEntry[] {
  const directory = path.join(CONTENT_ROOT, 'produkty');
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
        examples: data.examples ? String(data.examples) : undefined,
        summary: data.summary ? String(data.summary) : undefined,
        hasContent: hasBody(source),
      };
    });
}

export type ProductSection = {
  slug: string;
  title: string;
  description?: string;
  order: number;
  display: 'cards' | 'table';
  items: string[];
  columns: string[];
  rows: string[][];
};

export function listProductSections(): ProductSection[] {
  const directory = path.join(CONTENT_ROOT, 'sekcje-produktow');
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) as {
        title?: string;
        description?: string;
        order?: number;
        display?: string;
        items?: unknown;
        columns?: unknown;
        rows?: unknown;
      };
      const items = Array.isArray(data.items)
        ? data.items.filter((slug): slug is string => typeof slug === 'string')
        : [];
      const columns = Array.isArray(data.columns)
        ? data.columns.filter((column): column is string => typeof column === 'string')
        : [];
      const rows = Array.isArray(data.rows)
        ? data.rows.map((row) => {
            const cells =
              row && typeof row === 'object' && 'cells' in row
                ? (row as { cells?: unknown }).cells
                : undefined;
            return Array.isArray(cells) ? cells.map((cell) => String(cell)) : [];
          })
        : [];

      return {
        slug: file.slice(0, -'.json'.length),
        title: String(data.title ?? ''),
        description: data.description ? String(data.description) : undefined,
        order: Number(data.order ?? 0),
        display: data.display === 'table' ? ('table' as const) : ('cards' as const),
        items,
        columns,
        rows,
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pl'));
}

export type CollaborationArea = {
  title: string;
  summary: string;
  body: string;
};

export type CollaborationPage = {
  eyebrow: string;
  heading: string;
  lead: string;
  areasHeading: string;
  areas: CollaborationArea[];
  principlesHeading: string;
  principles: { title: string; body: string }[];
  stepsHeading: string;
  steps: { title: string; body: string }[];
  contactHeading: string;
  contactLead: string;
  contactDetails: { label: string; value: string }[];
  contactCtaLabel: string;
  contactCtaHref: string;
  partnersCtaLabel: string;
  partnersEyebrow: string;
  partnersHeading: string;
  partnersLead: string;
};

function readCardList(value: unknown): { title: string; body: string }[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const record = (item ?? {}) as { title?: unknown; body?: unknown };
    return {
      title: String(record.title ?? ''),
      body: String(record.body ?? ''),
    };
  });
}

function readAreaList(value: unknown): CollaborationArea[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const record = (item ?? {}) as { title?: unknown; summary?: unknown; body?: unknown };
    return {
      title: String(record.title ?? ''),
      summary: String(record.summary ?? ''),
      body: String(record.body ?? ''),
    };
  });
}

function readDetailList(value: unknown): { label: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const record = (item ?? {}) as { label?: unknown; value?: unknown };
    return {
      label: String(record.label ?? ''),
      value: String(record.value ?? ''),
    };
  });
}

export function readCollaborationPage(): CollaborationPage {
  const file = path.join(CONTENT_ROOT, 'wspolpraca', 'index.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;

  return {
    eyebrow: String(data.eyebrow ?? ''),
    heading: String(data.heading ?? ''),
    lead: String(data.lead ?? ''),
    areasHeading: String(data.areasHeading ?? ''),
    areas: readAreaList(data.areas),
    principlesHeading: String(data.principlesHeading ?? ''),
    principles: readCardList(data.principles),
    stepsHeading: String(data.stepsHeading ?? ''),
    steps: readCardList(data.steps),
    contactHeading: String(data.contactHeading ?? ''),
    contactLead: String(data.contactLead ?? ''),
    contactDetails: readDetailList(data.contactDetails),
    contactCtaLabel: String(data.contactCtaLabel ?? ''),
    contactCtaHref: String(data.contactCtaHref ?? ''),
    partnersCtaLabel: String(data.partnersCtaLabel ?? ''),
    partnersEyebrow: String(data.partnersEyebrow ?? ''),
    partnersHeading: String(data.partnersHeading ?? ''),
    partnersLead: String(data.partnersLead ?? ''),
  };
}

export type Collaborator = {
  name: string;
  role?: string;
  workplace?: string;
  photo?: string;
  photoAlt?: string;
  bio?: string;
  link?: string;
  linkLabel?: string;
};

export type Profession = {
  slug: string;
  title: string;
  order: number;
  summary?: string;
  members: Collaborator[];
};

export function listProfessions(): Profession[] {
  const directory = path.join(CONTENT_ROOT, 'professions');
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')) as {
        title?: unknown;
        order?: unknown;
        summary?: unknown;
        members?: unknown;
      };

      const members = Array.isArray(data.members)
        ? data.members.map((item) => {
            const record = (item ?? {}) as Record<string, unknown>;
            return {
              name: String(record.name ?? ''),
              role: record.role ? String(record.role) : undefined,
              workplace: record.workplace ? String(record.workplace) : undefined,
              photo: record.photo ? String(record.photo) : undefined,
              photoAlt: record.photoAlt ? String(record.photoAlt) : undefined,
              bio: record.bio ? String(record.bio) : undefined,
              link: record.link ? String(record.link) : undefined,
              linkLabel: record.linkLabel ? String(record.linkLabel) : undefined,
            };
          })
        : [];

      return {
        slug: file.slice(0, -'.json'.length),
        title: String(data.title ?? ''),
        order: Number(data.order ?? 0),
        summary: data.summary ? String(data.summary) : undefined,
        members,
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pl'));
}
