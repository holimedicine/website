import { expect, test } from '@playwright/test';

test('renders the supplement sections and tables', async ({ page }) => {
  await page.goto('produkty/');

  await expect(
    page.getByRole('heading', { name: 'Substancje i przykładowe preparaty' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Probiotyki: co na jaki problem' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Uszczelnianie jelita: przykładowy schemat' })
  ).toBeVisible();

  const tables = page.locator('table.prod-table');
  await expect(tables).toHaveCount(2);

  await expect(tables.nth(0).locator('thead th')).toHaveText([
    'Problem',
    'Przykładowe preparaty',
    'Uwagi',
  ]);
  await expect(tables.nth(1).locator('thead th')).toHaveText([
    'Preparat',
    'Typowa dawka',
    'Jak brać',
    'Czas',
  ]);

  for (let index = 0; index < 2; index += 1) {
    await expect(tables.nth(index).locator('tbody tr')).not.toHaveCount(0);
  }
});
