import { expect, test } from '@playwright/test';
import { readCollaborationPage } from './support/content';

const content = readCollaborationPage();
const dialogId = (index: number) => `wspolpraca-obszar-${index + 1}`;

test('renders the collaboration page from the CMS singleton', async ({ page }) => {
  await page.goto('wspolpraca/');

  await expect(page.locator('h1').first()).toHaveText(content.heading);
  await expect(page.locator('.page-header .eyebrow')).toHaveText(content.eyebrow);
  await expect(page.locator('.page-header .lead')).toHaveText(content.lead);

  const partnersCta = page.locator('.page-header .partners-cta');
  await expect(partnersCta).toHaveAttribute('href', '/website/wspolpraca/partnerzy/');
  await expect(partnersCta).toHaveAttribute('aria-label', content.partnersCtaLabel);
  await expect(partnersCta.locator('.partners-cta-title')).toHaveText('Z nimi współpracujemy');
  await expect(partnersCta.locator('.partners-cta-action')).toContainText('kliknij i sprawdź!');

  const sections = page.locator('section.section');
  await expect(sections).toHaveCount(4);

  // Areas of cooperation: separate clickable tiles
  const areas = sections.nth(0);
  await expect(areas.locator('h2')).toHaveText(content.areasHeading);
  await expect(areas.locator('.collab-card')).toHaveCount(content.areas.length);
  for (let index = 0; index < content.areas.length; index += 1) {
    await expect(areas.locator('.collab-card h3').nth(index)).toHaveText(
      content.areas[index].title
    );
    await expect(areas.locator('.collab-card p').nth(index)).toHaveText(
      content.areas[index].summary
    );
    await expect(areas.locator('.collab-card-open').nth(index)).toHaveAttribute(
      'aria-controls',
      dialogId(index)
    );
  }

  // Principles
  const principles = sections.nth(1);
  await expect(principles.locator('h2')).toHaveText(content.principlesHeading);
  await expect(principles.locator('.phil-card')).toHaveCount(content.principles.length);
  for (let index = 0; index < content.principles.length; index += 1) {
    await expect(principles.locator('.phil-card h3').nth(index)).toHaveText(
      content.principles[index].title
    );
  }

  // Steps
  const steps = sections.nth(2);
  await expect(steps.locator('h2')).toHaveText(content.stepsHeading);
  await expect(steps.locator('.phil-card')).toHaveCount(content.steps.length);
  for (let index = 0; index < content.steps.length; index += 1) {
    await expect(steps.locator('.phil-card h3').nth(index)).toHaveText(
      content.steps[index].title
    );
  }

  // Contact box
  const contact = sections.nth(3).locator('.contact-box');
  await expect(contact.locator('h2')).toHaveText(content.contactHeading);
  await expect(contact.locator('p').first()).toHaveText(content.contactLead);
  await expect(contact.locator('.contact-meta > div')).toHaveCount(content.contactDetails.length);
  for (let index = 0; index < content.contactDetails.length; index += 1) {
    const detail = content.contactDetails[index];
    await expect(contact.locator('.contact-meta > div').nth(index)).toContainText(detail.label);
    await expect(contact.locator('.contact-meta > div').nth(index)).toContainText(detail.value);
  }

  const cta = contact.locator('.btn-primary');
  await expect(cta).toHaveText(content.contactCtaLabel);
  await expect(cta).toHaveAttribute('href', content.contactCtaHref);
});

test('the partner directory CTA opens the hidden directory page', async ({ page }) => {
  await page.goto('wspolpraca/');
  await page.locator('.page-header .partners-cta').click();

  await expect(page).toHaveURL(/\/website\/wspolpraca\/partnerzy\/?$/);
  await expect(page.locator('h1').first()).toHaveText(content.partnersHeading);
});

test('renders one dialog per cooperation area', async ({ page }) => {
  await page.goto('wspolpraca/');

  const dialogs = page.locator('dialog.collab-modal');
  await expect(dialogs).toHaveCount(content.areas.length);

  const ids = await dialogs.evaluateAll((elements) => elements.map((element) => element.id));
  expect(ids).toEqual(content.areas.map((_, index) => dialogId(index)));
});

test('tile opens the full area description and the close button closes it', async ({ page }) => {
  const area = content.areas[0];
  expect(area).toBeTruthy();

  const dialog = page.locator(`#${dialogId(0)}`);

  await page.goto('wspolpraca/');
  await expect(dialog).not.toBeVisible();

  await page.locator('.collab-card-open').first().click();

  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.collab-modal-body h2')).toHaveText(area.title);
  await expect(dialog.locator('.collab-modal-summary')).toHaveText(area.summary);
  await expect(dialog.locator('.collab-modal-content')).toContainText(area.body);
  await expect(page).toHaveURL(new RegExp(`#${dialogId(0)}$`));

  await dialog.locator('.collab-modal-close').click();

  await expect(dialog).not.toBeVisible();
  await expect(page).not.toHaveURL(/#wspolpraca-obszar-/);
});

test('Escape closes the area modal', async ({ page }) => {
  await page.goto('wspolpraca/');

  const dialog = page.locator('dialog.collab-modal').first();
  await page.locator('.collab-card-open').first().click();
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('deep link opens the matching area', async ({ page }) => {
  await page.goto(`wspolpraca/#${dialogId(1)}`);

  const dialog = page.locator(`#${dialogId(1)}`);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.collab-modal-body h2')).toHaveText(content.areas[1].title);
});
