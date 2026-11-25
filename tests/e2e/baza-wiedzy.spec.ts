import { expect, test } from '@playwright/test';

const tiles = [
  {
    title: 'Materiały, które poszerzają świadomość',
    href: '/edukacja/',
    action: 'Przejdź do materiałów',
  },
  {
    title: 'Suplementy i probiotyki – co mówią badania',
    href: '/produkty/',
    action: 'Zobacz suplementy i probiotyki',
  },
];

test('links to both knowledge areas as large tiles', async ({ page }) => {
  await page.goto('baza-wiedzy/');

  const cards = page.locator('.knowledge-tile');
  await expect(cards).toHaveCount(tiles.length);
  await expect(cards.locator('.knowledge-tile-title')).toHaveText(
    tiles.map((tile) => tile.title)
  );

  for (const [index, tile] of tiles.entries()) {
    const card = cards.nth(index);
    await expect(card).toHaveAttribute('href', tile.href);
    await expect(card.locator('.knowledge-tile-action')).toContainText(tile.action);
  }
});

test('the materials tile opens the article list', async ({ page }) => {
  await page.goto('baza-wiedzy/');

  await page.locator('.knowledge-tile').first().click();

  await expect(page).toHaveURL(/\/edukacja\/?$/);
  await expect(page.locator('h1').first()).toHaveText(
    'Materiały, które poszerzają świadomość'
  );
});

test('the products tile opens the product list', async ({ page }) => {
  await page.goto('baza-wiedzy/');

  await page.locator('.knowledge-tile').nth(1).click();

  await expect(page).toHaveURL(/\/produkty\/?$/);
  await expect(page.locator('h1').first()).toHaveText(
    'Suplementy i probiotyki – co mówią badania'
  );
});

test('stacks the tiles on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('baza-wiedzy/');

  const boxes = await page.locator('.knowledge-tile').evaluateAll((elements) =>
    elements.map((element) => {
      const { top, bottom, left } = element.getBoundingClientRect();
      return { top, bottom, left };
    })
  );

  expect(boxes).toHaveLength(2);
  expect(boxes[1].top).toBeGreaterThanOrEqual(boxes[0].bottom - 1);
  expect(Math.abs(boxes[1].left - boxes[0].left)).toBeLessThan(2);
});
