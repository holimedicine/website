import { expect, test, type Page } from '@playwright/test';
import { listCategories } from './support/content';

const menuItem = (page: Page, label: string) =>
  page.locator('.nav-item-has-menu').filter({ hasText: label });

const recipeCategories = listCategories();

const modulePages = [
  { path: 'baza-wiedzy/', nav: 'baza-wiedzy' },
  { path: 'przepisy/', nav: 'przepisy' },
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

const knowledgeSubpages = [
  { path: 'edukacja/', child: 'edukacja' },
  { path: 'produkty/', child: 'produkty' },
];

for (const { path, child } of knowledgeSubpages) {
  test(`keeps Baza wiedzy current on ${path}`, async ({ page }) => {
    await page.goto(path);

    const currentLinks = page.locator('[data-nav-page="baza-wiedzy"]');
    await expect(currentLinks).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      await expect(currentLinks.nth(index)).toHaveAttribute('aria-current', 'page');
    }

    const childLinks = page.locator(`[data-nav-child-page="${child}"]`);
    await expect(childLinks).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      await expect(childLinks.nth(index)).toHaveAttribute('aria-current', 'page');
    }

    for (const other of knowledgeSubpages.filter((candidate) => candidate.child !== child)) {
      const otherLinks = page.locator(`[data-nav-child-page="${other.child}"]`);
      for (let index = 0; index < (await otherLinks.count()); index += 1) {
        await expect(otherLinks.nth(index)).not.toHaveAttribute('aria-current', 'page');
      }
    }
  });
}

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

  await expect(page.locator('.nav-cta')).toHaveAttribute('href', '/#kontakt');
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

  const item = menuItem(page, 'Współpraca');
  const trigger = item.locator('.nav-trigger');
  const menu = item.locator('.nav-menu');
  const directoryLink = menu.locator('.nav-menu-link');

  await expect(menu).toBeHidden();
  await expect(directoryLink).toHaveAttribute('href', '/wspolpraca/partnerzy/');

  await trigger.hover();
  await expect(menu).toBeVisible();
  await expect(directoryLink).toBeVisible();

  await page.locator('.nav-cta').hover();
  await expect(menu).toBeHidden();
});

test('opens the collaboration menu when the trigger is focused', async ({ page }) => {
  await page.goto('./');

  const item = menuItem(page, 'Współpraca');
  await item.locator('.nav-trigger').focus();
  await expect(item.locator('.nav-menu')).toBeVisible();
});

test('reveals both knowledge areas from the Baza wiedzy menu', async ({ page }) => {
  await page.goto('./');

  const item = menuItem(page, 'Baza wiedzy');
  const menu = item.locator('.nav-menu');
  const links = menu.locator('.nav-menu-link');

  await expect(menu).toBeHidden();
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveAttribute('href', '/edukacja/');
  await expect(links.nth(1)).toHaveAttribute('href', '/produkty/');

  await item.locator('.nav-trigger').hover();
  await expect(menu).toBeVisible();
  await expect(links.nth(0)).toBeVisible();
  await expect(links.nth(1)).toBeVisible();
});

test('reveals recipe categories from the Przepisy menu', async ({ page }) => {
  test.skip(recipeCategories.length === 0, 'No recipe categories in content');

  await page.goto('./');

  const item = menuItem(page, 'Przepisy');
  const menu = item.locator('.nav-menu');
  const links = menu.locator('.nav-menu-link');

  await expect(menu).toBeHidden();
  await expect(links).toHaveCount(recipeCategories.length);

  for (const [index, category] of recipeCategories.entries()) {
    await expect(links.nth(index)).toContainText(category.title);
    await expect(links.nth(index)).toHaveAttribute('href', `/przepisy/#${category.slug}`);
  }

  await item.locator('.nav-trigger').hover();
  await expect(menu).toBeVisible();
  for (const category of recipeCategories) {
    await expect(menu.getByRole('link', { name: category.title })).toBeVisible();
  }
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
      '/wspolpraca/partnerzy/'
    );

    await menu.locator('[data-nav-page="przepisy"]').click();
    await expect(page).toHaveURL(/\/przepisy\/?$/);
    await expect(page.locator('#navMobile')).not.toHaveClass(/open/);
  });
});
