import { expect, test } from '@playwright/test';

const modulePages = [
  { path: 'edukacja/', nav: 'edukacja' },
  { path: 'przepisy/', nav: 'przepisy' },
  { path: 'produkty/', nav: 'produkty' },
  { path: 'wspolpraca/', nav: 'wspolpraca' },
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

  const instagram = page.locator('.nav-instagram');
  await expect(instagram).toHaveAttribute(
    'href',
    'https://www.instagram.com/holimedicine/?utm_source=ig_web_button_share_sheet'
  );
  await expect(instagram).toHaveAttribute('target', '_blank');
  await expect(instagram).toHaveAttribute('rel', /noopener/);
  await expect(instagram).toHaveAttribute('aria-label', /Instagram/);
  await expect(instagram.locator('.nav-instagram-wordmark')).toHaveText('holimedicine');

  await expect(page.locator('.nav-cta')).toHaveAttribute('href', '/website/#kontakt');
});

test('shows the refreshed nav labels and CTA plus', async ({ page }) => {
  await page.goto('./');

  const desktopNav = page.locator('.nav-links');
  await expect(desktopNav.getByRole('link', { name: 'Medycyna holistyczna' })).toBeVisible();
  await expect(desktopNav.getByRole('link', { name: 'Baza wiedzy' })).toBeVisible();
  await expect(page.locator('.nav-cta .cta-plus')).toHaveCount(1);
});

test('reveals the collaborator directory from the collaboration menu', async ({ page }) => {
  await page.goto('./');

  const item = page.locator('.nav-item-has-menu');
  const trigger = item.locator('.nav-trigger');
  const menu = item.locator('.nav-menu');
  const directoryLink = menu.locator('.nav-menu-link');

  await expect(menu).toBeHidden();
  await expect(directoryLink).toHaveAttribute('href', '/website/wspolpraca/partnerzy/');

  await trigger.hover();
  await expect(menu).toBeVisible();
  await expect(directoryLink).toBeVisible();

  await page.locator('.nav-cta').hover();
  await expect(menu).toBeHidden();
});

test('opens the collaboration menu when the trigger is focused', async ({ page }) => {
  await page.goto('./');

  await page.locator('.nav-trigger').focus();
  await expect(page.locator('.nav-menu')).toBeVisible();
});

test('keeps collaboration current inside the collaborator directory', async ({ page }) => {
  await page.goto('wspolpraca/partnerzy/');

  const currentLinks = page.locator('[data-nav-page="wspolpraca"]');
  await expect(currentLinks).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    await expect(currentLinks.nth(index)).toHaveAttribute('aria-current', 'page');
  }

  const directoryLinks = page.locator('[data-nav-child-page="wspolpraca/partnerzy"]');
  await expect(directoryLinks).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    await expect(directoryLinks.nth(index)).toHaveAttribute('aria-current', 'page');
  }
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

    await expect(menu.getByRole('link', { name: 'Sprawdź z kim współpracujemy' })).toHaveAttribute(
      'href',
      '/website/wspolpraca/partnerzy/'
    );

    await menu.locator('[data-nav-page="przepisy"]').click();
    await expect(page).toHaveURL(/\/website\/przepisy\/?$/);
    await expect(page.locator('#navMobile')).not.toHaveClass(/open/);
  });
});
