import { expect, test } from '@playwright/test';
import { readAboutPage } from './support/content';

const about = readAboutPage();
const slugifyProfileName = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const dialogId = (name: string) => `profil-${slugifyProfileName(name)}`;

test('renders one profile card per doctor with a four-line bio and "Czytaj więcej"', async ({
  page,
}) => {
  await page.goto('./');

  const cards = page.locator('#o-nas .profile-card');
  await expect(cards).toHaveCount(about.profiles.length);

  for (let index = 0; index < about.profiles.length; index += 1) {
    const profile = about.profiles[index];
    const card = cards.nth(index);

    await expect(card.locator('h3')).toHaveText(profile.name);
    await expect(card.locator('.role')).toHaveText(profile.role);
    await expect(card.locator('.profile-card-bio')).toHaveCSS('-webkit-line-clamp', '4');
    await expect(card.locator('.profile-card-more')).toHaveText('Czytaj więcej →');
    await expect(card.locator('.profile-card-open')).toHaveAttribute(
      'aria-controls',
      dialogId(profile.name)
    );
  }
});

test('opens a profile popup from the card and shows the full bio with its gallery', async ({
  page,
}) => {
  const profile = about.profiles.find((entry) => entry.gallery.length > 0);
  test.skip(!profile, 'No profile has a gallery yet.');

  await page.goto('./');

  const card = page
    .locator('#o-nas .profile-card')
    .filter({ has: page.locator('h3', { hasText: profile!.name }) });
  await card.click();

  const dialog = page.locator(`#${dialogId(profile!.name)}`);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2')).toHaveText(profile!.name);
  await expect(dialog.locator('.profile-modal-role')).toHaveText(profile!.role);
  await expect(dialog.locator('.profile-modal-bio')).toContainText(
    profile!.bio.replace(/\s+/g, ' ').trim().slice(0, 60)
  );

  const items = dialog.locator('.profile-gallery-item');
  await expect(items).toHaveCount(profile!.gallery.length);
  await expect(items.first().locator('img')).toHaveAttribute('src', profile!.gallery[0].image);

  const documentedIndex = profile!.gallery.findIndex((entry) => entry.document);
  if (documentedIndex >= 0) {
    const documentLink = items.nth(documentedIndex).locator('figcaption a');
    await expect(documentLink).toHaveAttribute('href', profile!.gallery[documentedIndex].document!);
    await expect(documentLink).toHaveAttribute('target', '_blank');
    await expect(documentLink).toContainText('Otwórz dokument (PDF)');
  }
  await expect(page).toHaveURL(new RegExp(`#${dialogId(profile!.name)}$`));

  await dialog.locator('.profile-modal-close').click();
  await expect(dialog).not.toBeVisible();
  await expect(page).not.toHaveURL(/#/);
});

test('shows the personal portrait between the name and the bio, separate from the gallery', async ({
  page,
}) => {
  const profile = about.profiles.find((entry) => entry.photo);
  test.skip(!profile, 'No profile has a personal photo yet.');

  await page.goto(`./#${dialogId(profile!.name)}`);

  const dialog = page.locator(`#${dialogId(profile!.name)}`);
  await expect(dialog).toBeVisible();

  const portrait = dialog.locator('.profile-modal-photo img');
  await expect(portrait).toHaveAttribute('src', profile!.photo!);
  await expect(portrait).toHaveAttribute('alt', profile!.photoAlt ?? '');

  const headingBox = await dialog.locator('h2').boundingBox();
  const portraitBox = await portrait.boundingBox();
  const bioBox = await dialog.locator('.profile-modal-bio').boundingBox();
  expect(headingBox).not.toBeNull();
  expect(portraitBox).not.toBeNull();
  expect(bioBox).not.toBeNull();
  expect(portraitBox!.y).toBeGreaterThan(headingBox!.y);
  expect(bioBox!.y).toBeGreaterThan(portraitBox!.y);

  const gallerySources = await dialog
    .locator('.profile-gallery-item img')
    .evaluateAll((images) => images.map((image) => image.getAttribute('src') ?? ''));
  expect(gallerySources).toHaveLength(profile!.gallery.length);
  expect(gallerySources).not.toContain(profile!.photo!);
});

test('closes a profile popup with Escape', async ({ page }) => {
  await page.goto('./');

  await page.locator('#o-nas .profile-card').first().click();

  const dialog = page.locator('dialog.profile-modal').first();
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('opens a profile popup from a hash deep link', async ({ page }) => {
  const profile = about.profiles[0];
  test.skip(!profile, 'No profiles were found in the about content.');

  await page.goto(`./#${dialogId(profile.name)}`);

  const dialog = page.locator(`#${dialogId(profile.name)}`);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2')).toHaveText(profile.name);
});
