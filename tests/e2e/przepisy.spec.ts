import { expect, test } from '@playwright/test';
import { listCategories, listEntries } from './support/content';

const categories = listCategories();
const entries = listEntries('przepisy');
const entriesByCategory = (slug: string) => entries.filter((entry) => entry.category === slug);

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
      entriesByCategory(category.slug).map((entry) => entry.title)
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

    const withImages = entriesByCategory(category.slug).filter((entry) => entry.coverImage);
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
