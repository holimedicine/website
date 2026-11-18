import { expect, test } from '@playwright/test';
import { listProfessions, readCollaborationPage } from './support/content';

const content = readCollaborationPage();
const professions = listProfessions();

test('renders the collaborator directory from CMS content', async ({ page }) => {
  await page.goto('wspolpraca/partnerzy/');

  await expect(page.locator('h1').first()).toHaveText(content.partnersHeading);
  await expect(page.locator('.page-header .eyebrow')).toHaveText(content.partnersEyebrow);
  await expect(page.locator('.page-header .lead')).toHaveText(content.partnersLead);

  const items = page.locator('.profession');
  await expect(items).toHaveCount(professions.length);

  for (let index = 0; index < professions.length; index += 1) {
    const profession = professions[index];
    const item = items.nth(index);

    await expect(item.locator('.profession-title')).toHaveText(profession.title);
    await expect(item.locator('.profession-count')).toContainText(
      String(profession.members.length)
    );
    await expect(item).not.toHaveAttribute('open', '');
  }
});

test('expands a profession and shows its collaborators', async ({ page }) => {
  const profession = professions[0];
  expect(profession).toBeTruthy();

  await page.goto('wspolpraca/partnerzy/');

  const item = page.locator('.profession').first();
  await expect(item.locator('.collaborator-card').first()).toBeHidden();

  await item.locator('summary').click();

  await expect(item).toHaveAttribute('open', '');
  await expect(item.locator('.profession-summary')).toHaveText(profession.summary ?? '');
  await expect(item.locator('.collaborator-card')).toHaveCount(profession.members.length);

  for (let index = 0; index < profession.members.length; index += 1) {
    const member = profession.members[index];
    const card = item.locator('.collaborator-card').nth(index);

    await expect(card.locator('h3')).toHaveText(member.name);
    if (member.role) await expect(card.locator('.collaborator-role')).toHaveText(member.role);
    if (member.workplace) {
      await expect(card.locator('.collaborator-workplace')).toContainText(member.workplace);
    }
    if (member.bio) await expect(card.locator('.collaborator-bio')).toHaveText(member.bio);

    if (member.photo) {
      await expect(card.locator('img.collaborator-photo')).toHaveAttribute(
        'src',
        `/website${member.photo}`
      );
    } else {
      await expect(card.locator('.collaborator-photo-initials')).toBeVisible();
    }

    if (member.link && member.linkLabel) {
      const link = card.locator('.collaborator-link');
      await expect(link).toHaveAttribute('href', member.link);
      await expect(link).toContainText(member.linkLabel);
    }
  }
});

test('each profession can be expanded independently', async ({ page }) => {
  await page.goto('wspolpraca/partnerzy/');

  const items = page.locator('.profession');
  await items.nth(1).locator('summary').click();
  await items.nth(2).locator('summary').click();

  await expect(items.nth(1)).toHaveAttribute('open', '');
  await expect(items.nth(2)).toHaveAttribute('open', '');
  await expect(items.nth(0)).not.toHaveAttribute('open', '');
  await expect(items.nth(3)).not.toHaveAttribute('open', '');
});
