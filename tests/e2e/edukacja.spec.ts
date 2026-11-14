import { expect, test } from '@playwright/test';
import { listEntries } from './support/content';

const entries = listEntries('edukacja');

test('lists articles in the configured order', async ({ page }) => {
  await page.goto('edukacja/');
  await expect(page.locator('.edu-item-title')).toHaveText(entries.map((entry) => entry.title));
});

test('accordion opens and closes', async ({ page }) => {
  await page.goto('edukacja/');

  const item = page.locator('.edu-item').first();
  const button = item.locator('.edu-item-header');

  await expect(item).not.toHaveClass(/open/);
  await button.click();
  await expect(item).toHaveClass(/open/);
  await expect(item.locator('.rich-text')).not.toBeEmpty();
  await button.click();
  await expect(item).not.toHaveClass(/open/);
});

test('shows the educational disclaimer', async ({ page }) => {
  await page.goto('edukacja/');
  await expect(page.locator('.edu-disclaimer')).toContainText('nie zastępują indywidualnej konsultacji');
});
