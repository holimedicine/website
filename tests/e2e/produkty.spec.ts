import { expect, test, type Page } from '@playwright/test';
import { listProductSections, listProducts } from './support/content';
import { slugify } from '../../src/utils/slug';

const sections = listProductSections();
const products = listProducts();
const productsBySlug = new Map(products.map((product) => [product.slug, product]));

const cardSections = sections.filter((section) => section.display === 'cards');
const tableSection = sections.find((section) => section.display === 'table');

const dialogId = (slug: string) => `produkt-${slugify(slug)}`;

const productFor = (slug: string) => {
  const product = productsBySlug.get(slug);
  expect(product, `Missing product content for "${slug}"`).toBeTruthy();
  return product!;
};

const cardsIn = (page: Page, sectionSlug: string) =>
  page.locator(`.prod-section[data-section="${sectionSlug}"] .prod-card`);

test('renders product sections in the configured order', async ({ page }) => {
  await page.goto('produkty/');

  await expect(page.locator('.prod-section > .sub-title')).toHaveText(
    sections.map((section) => section.title)
  );

  for (const section of sections.filter((item) => item.description)) {
    await expect(
      page.locator(`.prod-section[data-section="${section.slug}"] .prod-lead`)
    ).toHaveText(section.description!);
  }
});

test('renders card sections as clickable tiles in the configured order', async ({ page }) => {
  await page.goto('produkty/');

  for (const section of cardSections) {
    const titles = section.items.map((slug) => productFor(slug).title);
    await expect(cardsIn(page, section.slug).locator('h3')).toHaveText(titles);

    for (const card of await cardsIn(page, section.slug).all()) {
      await expect(card.locator('.prod-card-open')).toHaveCount(1);
    }
  }
});

test('renders the table section with editable columns and rows', async ({ page }) => {
  expect(tableSection, 'Expected one table section').toBeTruthy();
  if (!tableSection) return;

  await page.goto('produkty/');

  const table = page.locator(
    `.prod-section[data-section="${tableSection.slug}"] table.prod-table`
  );
  await expect(table.locator('thead th')).toHaveText(tableSection.columns);
  await expect(table.locator('tbody tr')).toHaveCount(tableSection.rows.length);
  await expect(table.locator('tbody tr').first().locator('td')).toHaveText(
    tableSection.rows[0]
  );
});

test('renders one dialog per unique product', async ({ page }) => {
  await page.goto('produkty/');

  const uniqueSlugs = Array.from(
    new Set(cardSections.flatMap((section) => section.items))
  );

  const dialogs = page.locator('dialog.prod-modal');
  await expect(dialogs).toHaveCount(uniqueSlugs.length);

  const ids = await dialogs.evaluateAll((elements) => elements.map((element) => element.id));
  expect(ids).toEqual(uniqueSlugs.map(dialogId));
});

test('card opens the full product details and the close button closes them', async ({ page }) => {
  const section = cardSections[0];
  expect(section).toBeTruthy();
  if (!section) return;

  const product = productFor(section.items[0]);
  const dialog = page.locator(`#${dialogId(product.slug)}`);

  await page.goto('produkty/');
  await expect(dialog).not.toBeVisible();

  await cardsIn(page, section.slug)
    .filter({ hasText: product.title })
    .locator('.prod-card-open')
    .click();

  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.prod-modal-body h2')).toHaveText(product.title);
  if (product.summary) {
    await expect(dialog.locator('.prod-modal-summary')).toHaveText(product.summary);
  }
  await expect(page).toHaveURL(new RegExp(`#${dialogId(product.slug)}$`));

  await dialog.locator('.prod-modal-close').click();

  await expect(dialog).not.toBeVisible();
  await expect(page).not.toHaveURL(/#produkt-/);
});

test('Escape closes the product modal', async ({ page }) => {
  await page.goto('produkty/');

  const dialog = page.locator('dialog.prod-modal').first();
  await page.locator('.prod-card-open').first().click();
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('deep link opens the matching product', async ({ page }) => {
  const section = cardSections[0];
  expect(section).toBeTruthy();
  if (!section) return;

  const product = productFor(section.items[0]);
  await page.goto(`produkty/#${dialogId(product.slug)}`);

  const dialog = page.locator(`#${dialogId(product.slug)}`);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.prod-modal-body h2')).toHaveText(product.title);
});

test('shows the product disclaimer', async ({ page }) => {
  await page.goto('produkty/');
  await expect(page.locator('.prod-note')).toContainText('nie zastępuje konsultacji lekarskiej');
});
