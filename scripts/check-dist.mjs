import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const BASE_PATH = (process.env.BASE_PATH ?? '/website/').replace(/\/+$/, '') + '/';

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function stripMarkup(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

function extractRefs(html) {
  const refs = [];
  const attrPattern = /\b(?:href|src)="([^"]*)"/gi;
  for (const match of html.matchAll(attrPattern)) {
    refs.push(match[1]);
  }
  return refs;
}

function isExternal(ref) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|data:)/i.test(ref);
}

function resolveTarget(ref, htmlFile) {
  const withoutQuery = ref.split(/[?#]/, 1)[0];
  if (!withoutQuery) return null;

  const clean = decodeURIComponent(withoutQuery);

  if (clean.startsWith('/') && !clean.startsWith(BASE_PATH)) {
    return { error: `root-relative URL does not use ${BASE_PATH}` };
  }

  const relative = clean.startsWith(BASE_PATH)
    ? clean.slice(BASE_PATH.length)
    : clean.replace(/^\/+/, '');
  const baseDirectory = clean.startsWith('/') ? DIST : path.dirname(htmlFile);
  const candidate = path.join(baseDirectory, relative);

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return { file: candidate };
  }

  const withIndex = path.join(candidate, 'index.html');
  if (fs.existsSync(withIndex)) {
    return { file: withIndex };
  }

  if (!path.extname(relative)) {
    const withHtml = `${candidate}.html`;
    if (fs.existsSync(withHtml)) {
      return { file: withHtml };
    }
  }

  return { error: 'referenced file does not exist in dist/' };
}

if (!fs.existsSync(DIST)) {
  console.error('check-dist: dist/ does not exist. Run the build first.');
  process.exit(1);
}

const htmlFiles = walk(DIST).filter((file) => file.endsWith('.html'));
const problems = [];

for (const file of htmlFiles) {
  const html = stripMarkup(fs.readFileSync(file, 'utf8'));
  for (const ref of extractRefs(html)) {
    if (!ref || isExternal(ref)) continue;

    const result = resolveTarget(ref, file);
    if (result?.error) {
      problems.push(`${path.relative(DIST, file)}: ${ref} — ${result.error}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`check-dist: found ${problems.length} broken reference(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`check-dist: OK (${htmlFiles.length} HTML file(s), base path ${BASE_PATH})`);
