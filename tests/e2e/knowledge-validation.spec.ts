import { expect, test } from '@playwright/test';
import {
  validateKnowledgeTaxonomy,
  type KnowledgeArticle,
  type KnowledgeSection,
  type KnowledgeTopic,
} from '../../src/utils/knowledge-validation';

const sections: KnowledgeSection[] = [
  {
    id: 'styl-zycia',
    title: 'Styl życia',
    order: 1,
    kind: 'articles',
  },
  {
    id: 'suplementy',
    title: 'Suplementy',
    order: 2,
    kind: 'supplements',
    href: '/produkty/',
  },
  {
    id: 'uklady',
    title: 'Zdrowie według układów',
    order: 3,
    kind: 'articles',
  },
];

const topics: KnowledgeTopic[] = [
  { id: 'nerwowy', title: 'Nerwowy', order: 1, section: 'uklady' },
];

const articles: KnowledgeArticle[] = [
  {
    id: 'sen',
    title: 'Sen',
    section: 'styl-zycia',
    order: 1,
    status: 'published',
  },
  {
    id: 'bole-glowy',
    title: 'Bóle głowy',
    section: 'uklady',
    topic: 'nerwowy',
    order: 1,
    status: 'published',
  },
];

test('accepts a valid knowledge taxonomy', () => {
  expect(
    validateKnowledgeTaxonomy({ sections, topics, articles })
  ).toEqual([]);
});

test('reports a missing section', () => {
  const problems = validateKnowledgeTaxonomy({
    sections,
    topics,
    articles: [
      ...articles,
      {
        id: 'brak-sekcji',
        title: 'Brak sekcji',
        section: 'nieistniejaca',
        order: 1,
        status: 'draft',
      },
    ],
  });

  expect(problems.join('\n')).toContain('nieistniejącą sekcję "nieistniejaca"');
});

test('reports a missing topic', () => {
  const problems = validateKnowledgeTaxonomy({
    sections,
    topics,
    articles: [
      ...articles,
      {
        id: 'brak-tematu',
        title: 'Brak tematu',
        section: 'uklady',
        topic: 'nieistniejacy',
        order: 2,
        status: 'draft',
      },
    ],
  });

  expect(problems.join('\n')).toContain('nieistniejący temat "nieistniejacy"');
});

test('reports a topic from another section', () => {
  const problems = validateKnowledgeTaxonomy({
    sections,
    topics,
    articles: [
      ...articles,
      {
        id: 'zly-temat',
        title: 'Zły temat',
        section: 'styl-zycia',
        topic: 'nerwowy',
        order: 2,
        status: 'draft',
      },
    ],
  });

  expect(problems.join('\n')).toContain('temat "nerwowy" należy do sekcji "uklady"');
});

test('reports a topic that collides with a flat article slug', () => {
  const problems = validateKnowledgeTaxonomy({
    sections,
    topics: [
      ...topics,
      { id: 'sen', title: 'Sen', order: 2, section: 'styl-zycia' },
    ],
    articles,
  });

  expect(problems.join('\n')).toContain('koliduje ze slugiem artykułu');
});

test('reports a supplements section without a target link', () => {
  const problems = validateKnowledgeTaxonomy({
    sections: [
      ...sections,
      {
        id: 'suplementy-bez-linku',
        title: 'Suplementy bez linku',
        order: 4,
        kind: 'supplements',
      },
    ],
    topics,
    articles,
  });

  expect(problems.join('\n')).toContain('nie ma pola href');
});

test('reports articles in a section that links to an existing page', () => {
  const problems = validateKnowledgeTaxonomy({
    sections,
    topics,
    articles: [
      ...articles,
      {
        id: 'w-suplementach',
        title: 'W suplementach',
        section: 'suplementy',
        order: 1,
        status: 'draft',
      },
    ],
  });

  expect(problems.join('\n')).toContain('nie może zawierać artykułów');
});

test('reports a relative section link without a leading slash', () => {
  const problems = validateKnowledgeTaxonomy({
    sections: [
      ...sections,
      {
        id: 'zly-link',
        title: 'Zły link',
        order: 4,
        kind: 'articles',
        href: 'produkty/',
      },
    ],
    topics,
    articles,
  });

  expect(problems.join('\n')).toContain('nie zaczyna się od "/"');
});
