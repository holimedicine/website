import { expect, test } from '@playwright/test';
import { slugify } from '../../src/utils/slug';
import {
  listEntries,
  listKnowledgeSections,
  listPublishedArticles,
  readKnowledgePage,
} from './support/content';

const sections = listKnowledgeSections();
const published = listPublishedArticles();
const drafts = listEntries('edukacja').filter((entry) => entry.status === 'draft');
const knowledgePage = readKnowledgePage();

const articleHref = (article: (typeof published)[number]) =>
  article.topic
    ? `/baza-wiedzy/${article.section}/${article.topic}/${article.slug}/`
    : `/baza-wiedzy/${article.section}/${article.slug}/`;

const groups = sections
  .map((section) => ({
    section,
    articles: published
      .filter((article) => article.section === section.slug)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'pl')),
  }))
  .filter((group) => group.articles.length > 0);

test('lists every published article grouped by section', async ({ page }) => {
  await page.goto('edukacja/');

  const renderedGroups = page.locator('.kb-article-group');
  await expect(renderedGroups).toHaveCount(groups.length);

  for (const [index, group] of groups.entries()) {
    const renderedGroup = renderedGroups.nth(index);
    await expect(renderedGroup.locator('.sub-title')).toHaveText(group.section.title);

    const cards = renderedGroup.locator('.kb-card');
    await expect(cards).toHaveCount(group.articles.length);
    await expect(cards.locator('h3')).toHaveText(
      group.articles.map((article) => article.title)
    );

    for (const [cardIndex, article] of group.articles.entries()) {
      await expect(cards.nth(cardIndex)).toHaveAttribute(
        'href',
        articleHref(article)
      );
    }
  }
});

test('does not list draft articles', async ({ page }) => {
  await page.goto('edukacja/');
  for (const draft of drafts) {
    await expect(page.locator('.kb-card', { hasText: draft.title })).toHaveCount(0);
  }
});

test('old #edukacja-* deep links redirect to the article page', async ({ page }) => {
  const article = published[0];
  expect(article).toBeTruthy();
  if (!article) return;

  await page.goto(`edukacja/#edukacja-${slugify(article.slug)}`);

  await expect(page).toHaveURL(new RegExp(`${articleHref(article)}$`));
  await expect(page.locator('.page-header h1')).toHaveText(article.title);
});

test('shows the educational disclaimer', async ({ page }) => {
  await page.goto('edukacja/');
  await expect(page.locator('.kb-disclaimer')).toHaveText(knowledgePage.disclaimer);
});
