import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MARKER = '<!-- VNV_BETA_PROGRAM_V1 -->';
const SCRIPT = '<script src="https://vervenveda.com/assets/vnv-beta-link.js" defer></script>';
const EXCLUDE_DIRS = new Set(['.git', 'node_modules', 'vendor']);
const REPO = process.env.GITHUB_REPOSITORY || path.basename(ROOT);

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.isFile() && entry.name.toLowerCase() === 'index.html') out.push(full);
  }
  return out;
}

function blockFor(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const source = encodeURIComponent(`${REPO}/${rel}`);
  return `\n${MARKER}\n<a id="vnvBetaProgramFallback" href="https://vervenveda.com/beta/?source=${source}" aria-label="Open the Verve N Veda Beta Program for this page">β Beta Program</a>\n${SCRIPT}\n`;
}

let changed = 0;
const files = await walk(ROOT);
for (const file of files) {
  let html = await fs.readFile(file, 'utf8');
  if (html.includes(MARKER) || html.includes('vnv-beta-link.js')) continue;
  const closeBody = /<\/body\s*>/i;
  if (!closeBody.test(html)) continue;
  html = html.replace(closeBody, `${blockFor(file)}</body>`);
  await fs.writeFile(file, html, 'utf8');
  changed += 1;
}

console.log(`Beta Program injector scanned ${files.length} index pages and updated ${changed}.`);
