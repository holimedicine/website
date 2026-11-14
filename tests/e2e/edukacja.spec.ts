import { expect, test } from '@playwright/test';
import { listEntries } from './support/content';

const entries = listEntries('edukacja');

const PL_DIACRITICS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => PL_DIACRITICS[char] ?? char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const dialogId = (slug: string) => `edukacja-${slugify(slug)}`;

test('lists articles as cards in the configured order', async ({ page }) => {
  await page.goto('edukacja/');
  await expect(page.locator('.edu-card-title')).toHaveText(entries.map((entry) => entry.title));
});

test('renders one dialog per article', async ({ page }) => {
  await page.goto('edukacja/');

  const dialogs = page.locator('dialog.edu-modal');
  await expect(dialogs).toHaveCount(entries.length);

  const ids = await dialogs.evaluateAll((elements) => elements.map((element) => element.id));
  expect(ids).toEqual(entries.map((entry) => dialogId(entry.slug)));
});

test('card opens the full article and the close button closes it', async ({ page }) => {
  await page.goto('edukacja/');

  const entry = entries.find((item) => item.hasContent);
  expect(entry).toBeTruthy();
  if (!entry) return;

  const dialog = page.locator(`#${dialogId(entry.slug)}`);
  await expect(dialog).not.toBeVisible();

  await page.locator('.edu-card', { hasText: entry.title }).locator('.edu-card-open').click();

  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.edu-modal-body h2')).toHaveText(entry.title);
  await expect(dialog.locator('.rich-text')).not.toBeEmpty();
  await expect(page).toHaveURL(new RegExp(`#${dialogId(entry.slug)}$`));

  await dialog.locator('.edu-modal-close').click();

  await expect(dialog).not.toBeVisible();
  await expect(page).not.toHaveURL(/#edukacja-/);
});

test('Escape closes the article modal', async ({ page }) => {
  await page.goto('edukacja/');

  const dialog = page.locator('dialog.edu-modal').first();
  await page.locator('.edu-card-open').first().click();
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('deep link opens the matching article', async ({ page }) => {
  const entry = entries[0];
  await page.goto(`edukacja/#${dialogId(entry.slug)}`);

  const dialog = page.locator(`#${dialogId(entry.slug)}`);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.edu-modal-body h2')).toHaveText(entry.title);
});

test('shows the educational disclaimer', async ({ page }) => {
  await page.goto('edukacja/');
  await expect(page.locator('.edu-disclaimer')).toContainText('nie zastępują indywidualnej konsultacji');
});
