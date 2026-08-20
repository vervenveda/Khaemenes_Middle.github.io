import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['.git', '.github', 'node_modules', 'vendor', 'admin', 'private', 'protected']);
const MARKER = 'data-vnv-beta-program="1"';

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function isTarget(file) {
  const name = path.basename(file).toLowerCase();
  return name === 'index.html' || name.endsWith('_index.html');
}

function htmlEscape(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

const files = walk(ROOT).filter(isTarget);
let changed = 0, already = 0, noBody = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARKER) || html.includes('vnv-beta-link.js')) { already++; continue; }
  const rel = '/' + path.relative(ROOT, file).split(path.sep).join('/');
  const source = encodeURIComponent(rel);
  const label = `Beta Program feedback for ${rel}`;
  const snippet = `\n<a ${MARKER} id="vnv-beta-program-link" href="https://vervenveda.com/beta/?source=${source}" aria-label="${htmlEscape(label)}" title="Beta Program · Send feedback" style="position:fixed;right:14px;bottom:14px;z-index:2147483000;display:inline-flex;align-items:center;gap:7px;padding:9px 12px;border:1px solid rgba(255,255,255,.30);border-radius:7px;background:#111827;color:#fff;text-decoration:none;font:700 13px/1.1 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.28)">β <span>Beta Program</span></a>\n`;
  const closeBody = html.toLowerCase().lastIndexOf('</body>');
  if (closeBody >= 0) html = html.slice(0, closeBody) + snippet + html.slice(closeBody);
  else { html += snippet; noBody++; }
  fs.writeFileSync(file, html, 'utf8');
  changed++;
}
console.log(JSON.stringify({ scanned: files.length, changed, already, noBody }, null, 2));
