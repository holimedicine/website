import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { listCategories } from './support/content';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function runBuild(cwd: string) {
  return new Promise<{ code: number; output: string }>((resolve) => {
    execFile(
      process.execPath,
      [path.join(PROJECT_ROOT, 'node_modules/astro/bin/astro.mjs'), 'build'],
      { cwd, env: { ...process.env, KEYSTATIC_DISABLED: '1' } },
      (error, stdout, stderr) => {
        resolve({ code: error ? 1 : 0, output: `${stdout}\n${stderr}` });
      }
    );
  });
}

test('fails the build for unknown and duplicate recipe slugs', async () => {
  test.setTimeout(60_000);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'holimedicine-build-'));

  try {
    await fs.cp(path.join(PROJECT_ROOT, 'src'), path.join(tempDir, 'src'), { recursive: true });
    for (const file of ['astro.config.mjs', 'tsconfig.json', 'package.json']) {
      await fs.copyFile(path.join(PROJECT_ROOT, file), path.join(tempDir, file));
    }
    await fs.symlink(
      path.join(PROJECT_ROOT, 'node_modules'),
      path.join(tempDir, 'node_modules'),
      'dir'
    );

    const categoriesDir = path.join(tempDir, 'src/content/kategorie-przepisow');
    const categories = listCategories();

    // Categories are editable content, so pick them dynamically instead of
    // hardcoding a slug that editors may rename in Keystatic.
    const duplicateCategory = categories.find((category) => category.recipes.length > 0);
    if (!duplicateCategory) {
      throw new Error('No recipe category with recipes found');
    }
    const unknownSlugCategory =
      categories.find((category) => category.slug !== duplicateCategory.slug) ?? duplicateCategory;

    const duplicatePath = path.join(categoriesDir, `${duplicateCategory.slug}.json`);
    const duplicateData = JSON.parse(await fs.readFile(duplicatePath, 'utf8')) as {
      recipes: string[];
    };
    const duplicate = duplicateData.recipes[0];
    if (!duplicate) throw new Error(`${duplicateCategory.slug}.json has no recipes`);
    duplicateData.recipes.push(duplicate);
    await fs.writeFile(duplicatePath, `${JSON.stringify(duplicateData, null, 2)}\n`);

    const unknownSlugPath = path.join(categoriesDir, `${unknownSlugCategory.slug}.json`);
    const unknownSlugData = JSON.parse(await fs.readFile(unknownSlugPath, 'utf8')) as {
      recipes: string[];
    };
    unknownSlugData.recipes.push('nieistniejacy-przepis');
    await fs.writeFile(unknownSlugPath, `${JSON.stringify(unknownSlugData, null, 2)}\n`);

    const result = await runBuild(tempDir);

    expect(result.code).not.toBe(0);
    expect(result.output).toContain('nieistniejacy-przepis');
    expect(result.output).toContain('występuje więcej niż raz');
  } finally {
    await fs.unlink(path.join(tempDir, 'node_modules')).catch(() => {});
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
