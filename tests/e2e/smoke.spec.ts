import { expect, test } from '@playwright/test';

const pages = [
  {
    path: './',
    title: 'Natalia i Donat Cupiał — holimedicine.eu.org',
    heading: 'Leczymy',
  },
  {
    path: 'edukacja/',
    title: 'Edukacja — Natalia i Donat Cupiał',
    heading: 'Materiały, które poszerzają świadomość',
  },
  {
    path: 'przepisy/',
    title: 'Przepisy — Natalia i Donat Cupiał',
    heading: 'Jemy tak, jak zalecamy',
  },
  {
    path: 'produkty/',
    title: 'Polecane produkty — Natalia i Donat Cupiał',
    heading: 'Rzeczy, którym ufamy',
  },
];

for (const pageInfo of pages) {
  test(`renders ${pageInfo.path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    const response = await page.goto(pageInfo.path, { waitUntil: 'load' });

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(pageInfo.title);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('h1').first()).toContainText(pageInfo.heading);
    await expect(page.locator('#year')).toHaveText(String(new Date().getFullYear()));

    expect(errors).toEqual([]);
  });
}
