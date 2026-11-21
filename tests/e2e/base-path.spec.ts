import { expect, test } from '@playwright/test';

const pages = [
  './',
  'baza-wiedzy/',
  'edukacja/',
  'przepisy/',
  'produkty/',
  'wspolpraca/',
  'wspolpraca/partnerzy/',
];

for (const path of pages) {
  test(`serves pages from the site root: ${path}`, async ({ page, request }) => {
    await page.goto(path);

    const refs = await page.evaluate(() => {
      const values: string[] = [];
      document.querySelectorAll('[href], [src]').forEach((element) => {
        const href = element.getAttribute('href');
        const src = element.getAttribute('src');
        if (href) values.push(href);
        if (src) values.push(src);
      });
      return values;
    });

    const localRefs = refs.filter((ref) => ref.startsWith('/') && !ref.startsWith('//'));
    expect(localRefs.length).toBeGreaterThan(0);
    expect(new URL(page.url()).pathname, `page URL ${page.url()}`).not.toMatch(/^\/website\//);
    for (const ref of localRefs) {
      expect(ref, `${path} → ${ref}`).not.toMatch(/^\/website\//);
    }

    const urls = new Set<string>();
    for (const ref of refs) {
      if (!ref || ref.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue;
      const url = new URL(ref, page.url());
      url.hash = '';
      urls.add(url.href);
    }

    for (const url of urls) {
      const response = await request.get(url);
      expect(response.ok(), url).toBe(true);
    }
  });
}
