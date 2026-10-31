import { expect, test } from '@playwright/test';
import { listByCategory } from './support/content';

const naWynos = listByCategory('na-wynos');
const dania = listByCategory('dania');
const withImages = naWynos.filter((entry) => entry.coverImage);

test('shows the na-wynos tab by default', async ({ page }) => {
  await page.goto('przepisy/');

  await expect(page.locator('.subcat-tab.active')).toHaveText('Na wynos');
  await expect(page.locator('#na-wynos')).toHaveClass(/active/);
  await expect(page.locator('#dania')).not.toHaveClass(/active/);
  await expect(page.locator('#na-wynos .recipe-card h3')).toHaveText(
    naWynos.map((entry) => entry.title)
  );
  await expect(page.locator('#dania .recipe-card h3')).toHaveText(dania.map((entry) => entry.title));
});

test('switches to the dania tab', async ({ page }) => {
  await page.goto('przepisy/');

  await page.getByRole('button', { name: 'Dania' }).click();

  await expect(page.locator('.subcat-tab.active')).toHaveText('Dania');
  await expect(page.locator('#dania')).toHaveClass(/active/);
  await expect(page.locator('#na-wynos')).not.toHaveClass(/active/);
});

test('loads cover images from the production base path', async ({ page }) => {
  await page.goto('przepisy/');

  const images = page.locator('#na-wynos img.recipe-img');
  await expect(images).toHaveCount(withImages.length);

  const sources = await images.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('src'))
  );
  expect(sources).toEqual(withImages.map((entry) => `/website${entry.coverImage}`));

  await page.locator('#na-wynos').scrollIntoViewIfNeeded();
  await expect
    .poll(async () =>
      images.evaluateAll((elements) =>
        (elements as HTMLImageElement[]).every(
          (element) => element.complete && element.naturalWidth > 0
        )
      )
    )
    .toBe(true);
});
