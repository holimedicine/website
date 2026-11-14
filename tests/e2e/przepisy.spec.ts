import { expect, test } from '@playwright/test';
import {
  listCategories,
  listEntries,
  type CategoryEntry,
  type ContentEntry,
} from './support/content';

const categories = listCategories();
const entriesBySlug = new Map(listEntries('przepisy').map((entry) => [entry.slug, entry]));
const titlesFor = (category: CategoryEntry) =>
  category.recipes.map((slug) => entriesBySlug.get(slug)?.title ?? slug);

test('shows the first category tab by default', async ({ page }) => {
  await page.goto('przepisy/');

  const [first, ...rest] = categories;
  await expect(page.locator('.subcat-tab.active')).toHaveText(first.title);
  await expect(page.locator(`#${first.slug}`)).toHaveClass(/active/);
  for (const category of rest) {
    await expect(page.locator(`#${category.slug}`)).not.toHaveClass(/active/);
  }
  for (const category of categories) {
    await expect(page.locator(`#${category.slug} .recipe-card h3`)).toHaveText(
      titlesFor(category)
    );
  }
});

test('switches between category tabs', async ({ page }) => {
  await page.goto('przepisy/');

  for (const category of categories.slice(1)) {
    await page.getByRole('button', { name: category.title }).click();

    await expect(page.locator('.subcat-tab.active')).toHaveText(category.title);
    await expect(page.locator(`#${category.slug}`)).toHaveClass(/active/);
    for (const other of categories) {
      if (other.slug !== category.slug) {
        await expect(page.locator(`#${other.slug}`)).not.toHaveClass(/active/);
      }
    }
  }
});

test('loads cover images from the production base path', async ({ page }) => {
  await page.goto('przepisy/');

  for (const category of categories) {
    await page.getByRole('button', { name: category.title }).click();

    const withImages = category.recipes
      .map((slug) => entriesBySlug.get(slug))
      .filter((entry): entry is ContentEntry => Boolean(entry?.coverImage));
    const images = page.locator(`#${category.slug} img.recipe-img`);
    await expect(images).toHaveCount(withImages.length);

    const sources = await images.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('src'))
    );
    expect(sources).toEqual(withImages.map((entry) => `/website${entry.coverImage}`));

    await page.locator(`#${category.slug}`).scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        images.evaluateAll((elements) =>
          (elements as HTMLImageElement[]).every(
            (element) => element.complete && element.naturalWidth > 0
          )
        )
      )
      .toBe(true);
  }
});

test('renders one dialog per unique recipe', async ({ page }) => {
  await page.goto('przepisy/');

  const uniqueSlugs = [...new Set(categories.flatMap((category) => category.recipes))];
  const dialogs = page.locator('dialog.recipe-modal');

  await expect(dialogs).toHaveCount(uniqueSlugs.length);

  const ids = await dialogs.evaluateAll((elements) => elements.map((element) => element.id));
  expect(ids).toEqual(uniqueSlugs.map((slug) => `przepis-${slug}`));
});

test('opens a recipe modal with the full recipe and closes it', async ({ page }) => {
  const entries = listEntries('przepisy');
  const entry = entries.find((item) => item.hasContent);
  if (!entry) throw new Error('No recipe with a full description found');

  const category = categories.find((item) => item.recipes.includes(entry.slug));
  if (!category) throw new Error(`Recipe ${entry.slug} is not assigned to any category`);

  await page.goto('przepisy/');
  await page.getByRole('button', { name: category.title, exact: true }).click();

  const card = page
    .locator(`#${category.slug} .recipe-card`)
    .filter({ hasText: entry.title.trim() })
    .first();
  await card.locator('.recipe-card-open').click();

  const dialog = page.locator(`#przepis-${entry.slug}`);
  await expect(dialog).toBeVisible();
  await expect(page.locator(`#przepis-${entry.slug}-title`)).toHaveText(entry.title);
  await expect(dialog.locator('.recipe-modal-tag')).toBeVisible();
  await expect(dialog.locator('.recipe-modal-summary')).toBeVisible();
  await expect(dialog.locator('.rich-text')).not.toBeEmpty();
  await expect(page).toHaveURL(new RegExp(`#przepis-${entry.slug}$`));

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page).not.toHaveURL(/#/);

  await card.locator('.recipe-card-open').click();
  await expect(dialog).toBeVisible();
  await dialog.locator('.recipe-modal-close').click();
  await expect(dialog).not.toBeVisible();
});

test('opens a recipe modal from a hash deep link and activates its category', async ({ page }) => {
  const entry = listEntries('przepisy').find((item) => item.hasContent);
  if (!entry) throw new Error('No recipe with a full description found');

  const category = categories.find((item) => item.recipes.includes(entry.slug));
  if (!category) throw new Error(`Recipe ${entry.slug} is not assigned to any category`);

  await page.goto(`przepisy/#przepis-${entry.slug}`);

  await expect(page.locator(`#przepis-${entry.slug}`)).toBeVisible();
  await expect(page.locator('.subcat-tab.active')).toHaveText(category.title);
  await expect(page.locator(`#${category.slug}`)).toHaveClass(/active/);
});

test('shows a placeholder for recipes without a full description', async ({ page }) => {
  const entry = listEntries('przepisy').find((item) => !item.hasContent);
  if (!entry) throw new Error('No recipe without a full description found');

  await page.goto(`przepisy/#przepis-${entry.slug}`);

  const dialog = page.locator(`#przepis-${entry.slug}`);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.recipe-modal-empty')).toHaveText(
    'Pełny przepis pojawi się wkrótce.'
  );
  await expect(dialog.locator('.rich-text')).toHaveCount(0);
});
