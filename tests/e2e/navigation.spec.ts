import { expect, test, type Page } from '@playwright/test';
import {
  listCategories,
  listKnowledgeSections,
  listPublishedArticles,
} from './support/content';

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

test('marks Start as the current page on the homepage', async ({ page }) => {
  await page.goto('./');

  const startLinks = page.locator('.nav-home');
  await expect(startLinks).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    await expect(startLinks.nth(index)).toHaveAttribute('aria-current', 'page');
  }
});

test('shows Start as the first nav link with a home icon', async ({ page }) => {
  await page.goto('edukacja/');

  const firstLink = page.locator('.nav-links > a').first();
  await expect(firstLink).toHaveClass(/nav-home/);
  await expect(firstLink).toHaveAttribute('href', '/');
  await expect(firstLink).toContainText('Start');
  await expect(firstLink.locator('.nav-home-icon')).toHaveCount(1);
  await expect(firstLink).not.toHaveAttribute('aria-current', 'page');
});

const knowledgeSections = listKnowledgeSections();
const knowledgeHref = (section: (typeof knowledgeSections)[number]) =>
  section.href ?? `/baza-wiedzy/${section.slug}/`;
const knowledgeSubpages = knowledgeSections.map((section) => ({
  path: knowledgeHref(section).replace(/^\//, ''),
  child:
    section.href?.replace(/^\/|\/$/g, '') ?? `baza-wiedzy/${section.slug}`,
}));

for (const path of ['edukacja/', ...knowledgeSubpages.map((subpage) => subpage.path)]) {
  test(`keeps Baza wiedzy current on ${path}`, async ({ page }) => {
    await page.goto(path);

    const currentLinks = page.locator('[data-nav-page="baza-wiedzy"]');
    await expect(currentLinks).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      await expect(currentLinks.nth(index)).toHaveAttribute('aria-current', 'page');
    }
  });
}

for (const { path, child } of knowledgeSubpages) {
  test(`marks the ${child} child current on ${path}`, async ({ page }) => {
    await page.goto(path);

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

test('keeps the section child current inside a nested article page', async ({ page }) => {
  const article = listPublishedArticles().find((entry) => entry.section === 'styl-zycia');
  expect(article).toBeTruthy();
  if (!article) return;

  const path = article.topic
    ? `baza-wiedzy/${article.section}/${article.topic}/${article.slug}/`
    : `baza-wiedzy/${article.section}/${article.slug}/`;

  await page.goto(path);

  const childLinks = page.locator('[data-nav-child-page="baza-wiedzy/styl-zycia"]');
  await expect(childLinks).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    await expect(childLinks.nth(index)).toHaveAttribute('aria-current', 'page');
  }
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

test('reveals every knowledge section from the Baza wiedzy menu', async ({ page }) => {
  await page.goto('./');

  const item = menuItem(page, 'Baza wiedzy');
  const menu = item.locator('.nav-menu');
  const links = menu.locator('.nav-menu-link');

  await expect(menu).toBeHidden();
  await expect(links).toHaveCount(knowledgeSections.length);

  for (const [index, section] of knowledgeSections.entries()) {
    await expect(links.nth(index)).toContainText(section.title);
    await expect(links.nth(index)).toHaveAttribute('href', knowledgeHref(section));
  }

  await item.locator('.nav-trigger').hover();
  await expect(menu).toBeVisible();
  for (const section of knowledgeSections) {
    await expect(menu.getByRole('link', { name: section.title })).toBeVisible();
  }
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

  test('places the CTA above the search link', async ({ page }) => {
    await page.goto('./');
    await page.locator('#navToggle').click();

    const menu = page.locator('#navMobile');
    const cta = menu.locator('.nav-mobile-cta');
    const search = menu.locator('.nav-mobile-search');

    await expect(cta).toBeVisible();
    await expect(search).toBeVisible();

    const ctaPrecedesSearch = await menu.evaluate((element) => {
      const ctaLink = element.querySelector('.nav-mobile-cta');
      const searchLink = element.querySelector('.nav-mobile-search');
      if (!ctaLink || !searchLink) return false;
      return Boolean(
        ctaLink.compareDocumentPosition(searchLink) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    expect(ctaPrecedesSearch).toBe(true);
    await expect(menu.locator('a.nav-home')).toHaveAttribute('href', '/');
  });

  test('scrolls the open menu instead of the page behind it', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto('edukacja/');
    await page.evaluate(() => window.scrollTo(0, 200));

    const toggle = page.locator('#navToggle');
    const menu = page.locator('#navMobile');

    // Click via the DOM so the assertion checks the menu, not Playwright's
    // scroll-into-view before clicking the sticky toggle.
    await page.evaluate(() => document.getElementById('navToggle')?.click());
    await expect(menu).toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(await page.evaluate(() => window.scrollY)).toBe(200);

    const metrics = await menu.evaluate((element) => ({
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
      overflowY: getComputedStyle(element).overflowY,
    }));

    expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
    expect(metrics.overflowY).toBe('auto');

    await menu.evaluate((element) => element.scrollTo(0, element.scrollHeight));

    expect(await menu.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await expect(menu.locator('[data-nav-child-page="wspolpraca/partnerzy"]')).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBe(200);

    // A wheel over the header must not move the page either.
    await page.mouse.move(200, 20);
    await page.mouse.wheel(0, 600);
    expect(await page.evaluate(() => window.scrollY)).toBe(200);

    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveClass(/open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => window.scrollY)).toBe(200);
  });
});
