import { expect, test } from '@playwright/test';

test('serves robots.txt pointing at the sitemap', async ({ request }) => {
  const response = await request.get('robots.txt');

  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Sitemap: https://holimedicine.eu/sitemap-index.xml');
});

test('sitemap lists indexable pages but not the noindex search page', async ({ request }) => {
  const index = await request.get('sitemap-index.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain('sitemap-0.xml');

  const sitemap = await request.get('sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  const urls = await sitemap.text();

  for (const path of ['/', '/baza-wiedzy/', '/edukacja/', '/przepisy/', '/produkty/']) {
    expect(urls, `sitemap is missing ${path}`).toContain(`https://holimedicine.eu${path}<`);
  }

  expect(urls).not.toContain('/szukaj');
});

test('marks the search page noindex and serves the social preview image', async ({ page, request }) => {
  await page.goto('szukaj/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://holimedicine.eu/szukaj/'
  );

  const image = await request.get('images/og-default.jpg');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/jpeg');
});
