import { expect, test } from '@playwright/test';
import {
  listEntries,
  listKnowledgeSections,
  listKnowledgeTopics,
  listPublishedArticles,
} from './support/content';

const articleHref = (article: {
  section: string;
  topic?: string;
  slug: string;
}) =>
  article.topic
    ? `/baza-wiedzy/${article.section}/${article.topic}/${article.slug}/`
    : `/baza-wiedzy/${article.section}/${article.slug}/`;

const knowledgeSections = listKnowledgeSections();
const knowledgeTopics = listKnowledgeTopics();
const publishedArticles = listPublishedArticles();
const draft = listEntries('edukacja').find((entry) => entry.status === 'draft');

test('serves robots.txt pointing at the sitemap', async ({ request }) => {
  const response = await request.get('robots.txt');

  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Sitemap: https://holimedicine.eu/sitemap-index.xml');
});

test('sitemap lists indexable pages but not the noindex search page', async ({ request }) => {
  const index = await request.get('sitemap-index.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain('sitemap-0.xml');

  const sitemap = await request.get('sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  const urls = await sitemap.text();

  const paths = [
    '/',
    '/baza-wiedzy/',
    '/edukacja/',
    '/przepisy/',
    '/produkty/',
    ...knowledgeSections
      .filter((section) => !section.href)
      .map((section) => `/baza-wiedzy/${section.slug}/`),
    ...knowledgeTopics.map(
      (topic) => `/baza-wiedzy/${topic.section}/${topic.slug}/`
    ),
    ...publishedArticles.map(articleHref),
  ];

  for (const path of paths) {
    expect(urls, `sitemap is missing ${path}`).toContain(`https://holimedicine.eu${path}<`);
  }

  expect(urls).not.toContain('/szukaj');

  if (draft) {
    expect(urls).not.toContain(`https://holimedicine.eu${articleHref(draft)}`);
  }
});

test('marks an article page as an article with a canonical URL', async ({ page }) => {
  const article = publishedArticles.find((entry) => entry.hasContent);
  expect(article).toBeTruthy();
  if (!article) return;

  const path = articleHref(article);
  await page.goto(path);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    `https://holimedicine.eu${path}`
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    'content',
    'article'
  );
});

test('marks the search page noindex and serves the social preview image', async ({ page, request }) => {
  await page.goto('szukaj/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://holimedicine.eu/szukaj/'
  );

  const image = await request.get('images/og-default.jpg');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/jpeg');
});
