import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

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

    const daniaPath = path.join(categoriesDir, 'dania.json');
    const dania = JSON.parse(await fs.readFile(daniaPath, 'utf8')) as { recipes: string[] };
    const duplicate = dania.recipes[0];
    if (!duplicate) throw new Error('dania.json has no recipes');
    dania.recipes.push(duplicate);
    await fs.writeFile(daniaPath, `${JSON.stringify(dania, null, 2)}\n`);

    const naWynosPath = path.join(categoriesDir, 'na-wynos.json');
    const naWynos = JSON.parse(await fs.readFile(naWynosPath, 'utf8')) as { recipes: string[] };
    naWynos.recipes.push('nieistniejacy-przepis');
    await fs.writeFile(naWynosPath, `${JSON.stringify(naWynos, null, 2)}\n`);

    const result = await runBuild(tempDir);

    expect(result.code).not.toBe(0);
    expect(result.output).toContain('nieistniejacy-przepis');
    expect(result.output).toContain('występuje więcej niż raz');
  } finally {
    await fs.unlink(path.join(tempDir, 'node_modules')).catch(() => {});
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});
