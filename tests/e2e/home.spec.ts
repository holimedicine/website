import { expect, test } from '@playwright/test';

test('renders all homepage sections and hero links', async ({ page }) => {
  await page.goto('./');

  for (const id of ['o-nas', 'podejscie', 'zakres', 'kontakt']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await expect(page.locator('.hero a[href="#kontakt"]')).toBeVisible();
  await expect(page.locator('.hero a[href="#o-nas"]')).toBeVisible();
});

test('scroll-spy marks the current section and clears on contact', async ({ page }) => {
  await page.goto('./');

  const locationLinks = page.locator('[data-nav-section][aria-current="location"]');

  await page.evaluate(() => document.getElementById('zakres')?.scrollIntoView());
  await expect(page.locator('[data-nav-section="zakres"][aria-current="location"]')).toHaveCount(2);
  await expect(locationLinks).toHaveCount(2);

  await page.evaluate(() => document.getElementById('kontakt')?.scrollIntoView());
  await expect(locationLinks).toHaveCount(0);
});
