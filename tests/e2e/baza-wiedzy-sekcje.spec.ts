import { expect, test } from '@playwright/test';
import {
  listEntries,
  listKnowledgeSections,
  listKnowledgeTopics,
  listPublishedArticles,
  readKnowledgePage,
} from './support/content';

const sections = listKnowledgeSections();
const topics = listKnowledgeTopics();
const articles = listEntries('edukacja');
const published = listPublishedArticles();
const knowledgePage = readKnowledgePage();

const articleHref = (article: (typeof articles)[number]) =>
  article.topic
    ? `/baza-wiedzy/${article.section}/${article.topic}/${article.slug}/`
    : `/baza-wiedzy/${article.section}/${article.slug}/`;

test('a flat section lists its articles in order and marks drafts', async ({ page }) => {
  const section = sections.find((candidate) => candidate.slug === 'styl-zycia');
  expect(section).toBeTruthy();
  if (!section) return;

  const entries = articles
    .filter((article) => article.section === section.slug)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pl'));

  await page.goto(`baza-wiedzy/${section.slug}/`);

  const cards = page.locator('.kb-card');
  await expect(cards).toHaveCount(entries.length);
  await expect(cards.locator('h3')).toHaveText(entries.map((entry) => entry.title));

  for (const [index, entry] of entries.entries()) {
    const card = cards.nth(index);
    if (entry.status === 'draft') {
      await expect(card.locator('.kb-card-soon')).toHaveText('Wkrótce');
      await expect(card).not.toHaveAttribute('href', /.+/);
    } else {
      await expect(card).toHaveAttribute('href', articleHref(entry));
    }
  }
});

test('the health-by-systems section lists every topic', async ({ page }) => {
  const section = sections.find((candidate) => candidate.slug === 'uklady');
  expect(section).toBeTruthy();
  if (!section) return;

  const sectionTopics = topics.filter((topic) => topic.section === section.slug);

  await page.goto(`baza-wiedzy/${section.slug}/`);

  const cards = page.locator('.kb-topic-card');
  await expect(cards).toHaveCount(sectionTopics.length);
  await expect(cards.locator('.kb-topic-card-title')).toHaveText(
    sectionTopics.map((topic) => topic.title)
  );

  for (const [index, topic] of sectionTopics.entries()) {
    await expect(cards.nth(index)).toHaveAttribute(
      'href',
      `/baza-wiedzy/${section.slug}/${topic.slug}/`
    );
  }
});

test('a topic page lists its articles', async ({ page }) => {
  const topic = topics.find((candidate) => candidate.slug === 'nerwowy');
  expect(topic).toBeTruthy();
  if (!topic) return;

  const topicArticles = articles
    .filter((article) => article.topic === topic.slug)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pl'));

  await page.goto(`baza-wiedzy/${topic.section}/${topic.slug}/`);

  const cards = page.locator('.kb-card');
  await expect(cards).toHaveCount(topicArticles.length);
  await expect(cards.locator('h3')).toHaveText(
    topicArticles.map((article) => article.title)
  );
});

test('an empty topic shows the preparation message', async ({ page }) => {
  const topic = topics.find((candidate) => candidate.slug === 'dziecko');
  expect(topic).toBeTruthy();
  if (!topic) return;

  await page.goto(`baza-wiedzy/${topic.section}/${topic.slug}/`);

  await expect(page.locator('.kb-empty')).toContainText('w przygotowaniu');
});

test('an article page shows the title, author, content and breadcrumbs', async ({ page }) => {
  const article = published.find((entry) => entry.hasContent && entry.section === 'uklady');
  expect(article).toBeTruthy();
  if (!article) return;

  await page.goto(articleHref(article));

  await expect(page.locator('.page-header h1')).toHaveText(article.title);
  await expect(page.locator('.kb-article-meta')).toContainText(article.author ?? '');
  await expect(page.locator('.kb-article-content')).not.toBeEmpty();
  await expect(page.locator('.kb-disclaimer')).toHaveText(knowledgePage.disclaimer);

  const breadcrumbs = page.locator('.kb-breadcrumbs li');
  await expect(breadcrumbs.first()).toContainText('Baza wiedzy');
  await expect(breadcrumbs.last().locator('[aria-current="page"]')).toHaveText(
    article.title
  );
});

test('a draft article has no public page', async ({ page }) => {
  const draft = articles.find((entry) => entry.status === 'draft');
  expect(draft).toBeTruthy();
  if (!draft) return;

  const response = await page.goto(articleHref(draft));
  expect(response?.status()).toBe(404);
});
