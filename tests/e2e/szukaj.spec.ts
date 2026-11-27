import { expect, test } from '@playwright/test';
import {
  listEntries,
  listProducts,
  listPublishedArticles,
} from './support/content';
import { slugify } from '../../src/utils/slug';

const PL_DIACRITICS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

/** Mirrors the browser-side normalization so queries work without diacritics. */
const toAscii = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => PL_DIACRITICS[char] ?? char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const WORDS = /[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{6,}/g;

const titleWords = (title: string): string[] => toAscii(title).match(/[a-z0-9]{4,}/g) ?? [];

/**
 * Picks a long word that only appears in the body, so the test proves that the
 * full text is searchable without hardcoding CMS copy (ADR 0013).
 */
function bodyQuery(entry: { title: string; body?: string }): string {
  const fromTitle = new Set(titleWords(entry.title));
  const candidates = (entry.body?.match(WORDS) ?? [])
    .map(toAscii)
    .filter((word) => !fromTitle.has(word))
    .sort((a, b) => b.length - a.length);

  const candidate = candidates[0];
  expect(candidate, `No body word found for "${entry.title}"`).toBeTruthy();
  return candidate;
}

const articles = listPublishedArticles();
const article = articles.find((entry) => entry.hasContent && (entry.body?.length ?? 0) > 200);
const articleQuery = article ? bodyQuery(article) : '';
const articleHref = (entry: (typeof articles)[number]) =>
  entry.topic
    ? `/baza-wiedzy/${entry.section}/${entry.topic}/${entry.slug}/`
    : `/baza-wiedzy/${entry.section}/${entry.slug}/`;
const articleUrl = article ? articleHref(article) : '';

const polishArticle = articles.find((entry) => /[ąćęłńóśźż]/i.test(entry.title));
const polishQuery = polishArticle ? toAscii(polishArticle.title) : '';
const polishUrl = polishArticle ? articleHref(polishArticle) : '';

const recipes = listEntries('przepisy');
const recipe = recipes.find((entry) => (entry.title.match(WORDS) ?? []).length > 0);
const recipeQuery = recipe
  ? ((recipe.title.match(WORDS) ?? []).sort((a, b) => b.length - a.length)[0] ?? '')
  : '';

const products = listProducts();
const product = products.find((entry) => entry.hasContent && (entry.body?.length ?? 0) > 0);
const productQuery = product ? bodyQuery(product) : '';
const productDialogId = product ? `produkt-${slugify(product.slug)}` : '';

test('nav exposes Szukaj and opens the search page', async ({ page }) => {
  await page.goto('./');

  const link = page.locator('.nav-search');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/szukaj/');

  await link.click();
  await expect(page).toHaveURL(/\/szukaj\/$/);
  await expect(page.locator('#search-input')).toBeVisible();
});

test('mobile menu contains the search link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');

  await page.locator('#navToggle').click();

  const link = page.locator('.nav-mobile-search');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/szukaj/');
});

test('finds a knowledge article by a body phrase and opens its page', async ({ page }) => {
  expect(article, 'No knowledge article with a body').toBeTruthy();
  expect(articleQuery).toBeTruthy();

  await page.goto(`szukaj/?q=${encodeURIComponent(articleQuery)}`);

  const link = page.locator(`a[href="${articleUrl}"]`);
  await expect(link).toBeVisible();
  await expect(link).toContainText(article?.title ?? '');

  await link.click();

  await expect(page).toHaveURL(new RegExp(`${articleUrl}$`));
  await expect(page.locator('.page-header h1')).toHaveText(article?.title ?? '');
});

test('finds a recipe by a title word and opens its modal', async ({ page }) => {
  expect(recipe, 'No recipe found').toBeTruthy();
  expect(recipeQuery).toBeTruthy();

  await page.goto(`szukaj/?q=${encodeURIComponent(recipeQuery)}`);

  const link = page.locator(`a[href$="#przepis-${recipe?.slug}"]`);
  await expect(link).toBeVisible();

  await link.click();

  await expect(page.locator(`#przepis-${recipe?.slug}`)).toBeVisible();
});

test('finds a product by a body phrase and opens its modal', async ({ page }) => {
  expect(product, 'No product with a body').toBeTruthy();
  expect(productQuery).toBeTruthy();

  await page.goto(`szukaj/?q=${encodeURIComponent(productQuery)}`);

  const link = page.locator(`a[href$="#${productDialogId}"]`);
  await expect(link).toBeVisible();

  await link.click();

  await expect(page.locator(`#${productDialogId}`)).toBeVisible();
});

test('matches titles without requiring Polish diacritics', async ({ page }) => {
  expect(polishArticle, 'No knowledge title with Polish diacritics').toBeTruthy();
  expect(polishQuery).toBeTruthy();

  await page.goto(`szukaj/?q=${encodeURIComponent(polishQuery)}`);

  await expect(page.locator(`a[href="${polishUrl}"]`)).toBeVisible();
});

test('does not return draft articles', async ({ page }) => {
  const draft = listEntries('edukacja').find((entry) => entry.status === 'draft');
  expect(draft).toBeTruthy();
  if (!draft) return;

  const draftUrl = draft.topic
    ? `/baza-wiedzy/${draft.section}/${draft.topic}/${draft.slug}/`
    : `/baza-wiedzy/${draft.section}/${draft.slug}/`;

  await page.goto(`szukaj/?q=${encodeURIComponent(toAscii(draft.title))}`);

  await expect(page.locator(`a[href="${draftUrl}"]`)).toHaveCount(0);
});

test('updates the URL and shows an empty state for unmatched queries', async ({ page }) => {
  await page.goto('szukaj/');

  const input = page.locator('#search-input');
  const panel = page.locator('.search-panel');

  await expect(panel).toBeHidden();

  await input.fill('qzxqzxqzx');

  await expect(page).toHaveURL(/\?q=qzxqzxqzx$/);
  await expect(page.locator('.search-empty')).toContainText('Nie znaleziono wyników');
  await expect(page.locator('.search-status')).toContainText('Brak wyników');
});
