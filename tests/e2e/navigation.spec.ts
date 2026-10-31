import { expect, test } from '@playwright/test';

const modulePages = [
  { path: 'edukacja/', nav: 'edukacja' },
  { path: 'przepisy/', nav: 'przepisy' },
  { path: 'produkty/', nav: 'produkty' },
];

for (const { path, nav } of modulePages) {
  test(`marks ${nav} as the current page on ${path}`, async ({ page }) => {
    await page.goto(path);

    const currentLinks = page.locator(`[data-nav-page="${nav}"]`);
    await expect(currentLinks).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      await expect(currentLinks.nth(index)).toHaveAttribute('aria-current', 'page');
    }

    for (const other of modulePages.filter((candidate) => candidate.nav !== nav)) {
      const otherLinks = page.locator(`[data-nav-page="${other.nav}"]`);
      for (let index = 0; index < (await otherLinks.count()); index += 1) {
        await expect(otherLinks.nth(index)).not.toHaveAttribute('aria-current', 'page');
      }
    }
  });
}

test('homepage has no page-level current marker', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-nav-page][aria-current="page"]')).toHaveCount(0);
});

test('brand and CTA use the production base path', async ({ page }) => {
  await page.goto('edukacja/');
  await expect(page.locator('.nav-brand')).toHaveAttribute('href', '/website/');
  await expect(page.locator('.nav-cta')).toHaveAttribute('href', '/website/#kontakt');
});

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens the menu, navigates, and closes it', async ({ page }) => {
    await page.goto('edukacja/');

    const toggle = page.locator('#navToggle');
    const menu = page.locator('#navMobile');

    await expect(toggle).toBeVisible();
    await expect(menu).not.toHaveClass(/open/);

    await toggle.click();
    await expect(menu).toHaveClass(/open/);

    await menu.locator('[data-nav-page="przepisy"]').click();
    await expect(page).toHaveURL(/\/website\/przepisy\/?$/);
    await expect(page.locator('#navMobile')).not.toHaveClass(/open/);
  });
});
