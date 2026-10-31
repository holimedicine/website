import { expect, test } from '@playwright/test';

const pages = ['./', 'edukacja/', 'przepisy/', 'produkty/'];

for (const path of pages) {
  test(`uses the production base path on ${path}`, async ({ page, request }) => {
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
    for (const ref of localRefs) {
      expect(ref, `${path} → ${ref}`).toMatch(/^\/website\//);
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
