import { expect, test } from '@playwright/test';

test('renders all homepage sections and hero links', async ({ page }) => {
  await page.goto('./');

  for (const id of ['o-nas', 'podejscie', 'zakres', 'kontakt']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await expect(page.locator('.hero-banner')).toBeVisible();
  await expect(page.locator('.hero-banner h1')).toHaveText('Holimedicine');
  await expect(page.locator('.hero-mark img')).toBeVisible();
  await expect(page.locator('.hero a[href="#kontakt"]')).toBeVisible();
  await expect(page.locator('.hero a[href="#o-nas"]')).toBeVisible();
});

test('renders the compact hero full-bleed beneath the fixed nav', async ({ page }) => {
  await page.goto('./');

  const viewport = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }));
  const banner = await page.locator('.hero-banner').boundingBox();
  const nav = await page.locator('.nav').boundingBox();

  expect(banner).not.toBeNull();
  expect(nav).not.toBeNull();

  await expect(page.locator('.nav')).toHaveCSS('position', 'fixed');
  expect(banner!.x).toBeCloseTo(0, 0);
  expect(banner!.width).toBeCloseTo(viewport.width, 0);
  expect(banner!.y).toBeCloseTo(0, 0);
  // The hero is content-driven now, so it should be shorter than the viewport.
  expect(banner!.height).toBeLessThan(viewport.height);
  expect(nav!.y).toBeCloseTo(0, 0);
  expect(banner!.y).toBeLessThan(nav!.height);

  for (const href of ['#kontakt', '#o-nas']) {
    const cta = await page.locator(`.hero a[href="${href}"]`).boundingBox();
    expect(cta).not.toBeNull();
    expect(cta!.y + cta!.height).toBeLessThanOrEqual(viewport.height);
  }
});

test('keeps the first section close to the hero', async ({ page }) => {
  await page.goto('./');

  const paddingTop = await page
    .locator('#o-nas')
    .evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));

  expect(paddingTop).toBeLessThanOrEqual(56);
});

test('expands the visit description in the contact section', async ({ page }) => {
  await page.goto('./');

  const faq = page.locator('#kontakt .visit-faq');
  await expect(faq.locator('summary')).toHaveText('Jak wygląda wizyta?');
  await expect(faq.locator('p')).toBeHidden();

  await faq.locator('summary').click();
  await expect(faq.locator('p')).toBeVisible();
  await expect(faq.locator('p')).toContainText('Standardowa wizyta trwa około 45 minut.');
});

test('expands the price list in the contact section', async ({ page }) => {
  await page.goto('./');

  const pricing = page.locator('#kontakt .pricing');
  await expect(pricing.locator('summary')).toHaveText('Cennik');
  await expect(pricing.locator('li').first()).toBeHidden();

  await pricing.locator('summary').click();
  await expect(pricing.locator('li').first()).toBeVisible();
  await expect(pricing.locator('li').last()).toContainText('220 zł');
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
