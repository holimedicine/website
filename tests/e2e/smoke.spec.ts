import { expect, test } from '@playwright/test';
import { readCollaborationPage } from './support/content';

const collaboration = readCollaborationPage();

const pages = [
  {
    path: './',
    title: 'Holimedicine — medycyna holistyczna i terapia manualna',
    canonical: 'https://holimedicine.eu/',
    heading: 'Holimedicine',
  },
  {
    path: 'baza-wiedzy/',
    title: 'Baza wiedzy o zdrowiu — artykuły i przepisy | Holimedicine',
    canonical: 'https://holimedicine.eu/baza-wiedzy/',
    heading: 'Baza wiedzy',
  },
  {
    path: 'edukacja/',
    title: 'Edukacja zdrowotna — jelita, sen, hormony | Holimedicine',
    canonical: 'https://holimedicine.eu/edukacja/',
    heading: 'Materiały, które poszerzają świadomość',
  },
  {
    path: 'przepisy/',
    title: 'Zdrowe przepisy niskowęglowodanowe | Holimedicine',
    canonical: 'https://holimedicine.eu/przepisy/',
    heading: 'Jemy tak, jak zalecamy',
  },
  {
    path: 'produkty/',
    title: 'Suplementy i probiotyki — co mówią badania | Holimedicine',
    canonical: 'https://holimedicine.eu/produkty/',
    heading: 'Suplementy i probiotyki – co mówią badania',
  },
  {
    path: 'wspolpraca/',
    title: 'Współpraca — warsztaty i projekty o zdrowiu | Holimedicine',
    canonical: 'https://holimedicine.eu/wspolpraca/',
    heading: collaboration.heading,
  },
  {
    path: 'wspolpraca/partnerzy/',
    title: `${collaboration.partnersHeading} | Holimedicine`,
    canonical: 'https://holimedicine.eu/wspolpraca/partnerzy/',
    heading: collaboration.partnersHeading,
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

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      pageInfo.canonical
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      pageInfo.title
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      pageInfo.canonical
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );

    expect(errors).toEqual([]);
  });
}
