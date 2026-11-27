import { expect, test } from '@playwright/test';
import {
  listKnowledgeSections,
  readKnowledgePage,
} from './support/content';

const sections = listKnowledgeSections();
const page = readKnowledgePage();

const hrefFor = (section: (typeof sections)[number]) =>
  section.href ?? `/baza-wiedzy/${section.slug}/`;

test('lists every knowledge section as a large tile in order', async ({ page: browserPage }) => {
  await browserPage.goto('baza-wiedzy/');

  const cards = browserPage.locator('.knowledge-tile');
  await expect(cards).toHaveCount(sections.length);
  await expect(cards.locator('.knowledge-tile-title')).toHaveText(
    sections.map((section) => section.title)
  );

  for (const [index, section] of sections.entries()) {
    const card = cards.nth(index);
    await expect(card).toHaveAttribute('href', hrefFor(section));
    await expect(card).toHaveAttribute('data-section', section.slug);
    await expect(card.locator('.knowledge-tile-number')).toHaveText(
      String(index + 1).padStart(2, '0')
    );
    await expect(card.locator('.knowledge-tile-action')).toContainText(
      section.kind === 'supplements' ? 'Zobacz suplementy' : 'Przejdź do sekcji'
    );
  }
});

test('shows the editable hub header and the all-articles link', async ({ page: browserPage }) => {
  await browserPage.goto('baza-wiedzy/');

  await expect(browserPage.locator('.page-header .eyebrow')).toHaveText(page.eyebrow);
  await expect(browserPage.locator('.page-header h1')).toHaveText(page.title);
  if (page.lead) {
    await expect(browserPage.locator('.page-header .lead')).toHaveText(page.lead);
  }
  await expect(browserPage.locator('.kb-text-link')).toHaveText(
    `${page.allArticlesLabel} →`
  );
  await expect(browserPage.locator('.kb-disclaimer')).toHaveText(page.disclaimer);
});

test('a normal section tile opens the section page', async ({ page: browserPage }) => {
  const section = sections.find((candidate) => candidate.kind !== 'supplements');
  expect(section).toBeTruthy();
  if (!section) return;

  await browserPage.goto('baza-wiedzy/');
  await browserPage.locator(`.knowledge-tile[data-section="${section.slug}"]`).click();

  await expect(browserPage).toHaveURL(
    new RegExp(`/baza-wiedzy/${section.slug}/?$`)
  );
  await expect(browserPage.locator('.page-header h1')).toHaveText(section.title);
});

test('the supplements tile opens the products page', async ({ page: browserPage }) => {
  const section = sections.find((candidate) => candidate.kind === 'supplements');
  expect(section).toBeTruthy();
  if (!section) return;

  await browserPage.goto('baza-wiedzy/');
  await browserPage.locator(`.knowledge-tile[data-section="${section.slug}"]`).click();

  await expect(browserPage).toHaveURL(/\/produkty\/?$/);
  await expect(browserPage.locator('.page-header h1')).not.toBeEmpty();
});

test('stacks the tiles on narrow screens', async ({ page: browserPage }) => {
  await browserPage.setViewportSize({ width: 390, height: 844 });
  await browserPage.goto('baza-wiedzy/');

  const boxes = await browserPage.locator('.knowledge-tile').evaluateAll((elements) =>
    elements.map((element) => {
      const { top, bottom, left } = element.getBoundingClientRect();
      return { top, bottom, left };
    })
  );

  expect(boxes).toHaveLength(sections.length);
  for (let index = 1; index < boxes.length; index += 1) {
    expect(boxes[index].top).toBeGreaterThanOrEqual(boxes[index - 1].bottom - 1);
    expect(Math.abs(boxes[index].left - boxes[index - 1].left)).toBeLessThan(2);
  }
});
