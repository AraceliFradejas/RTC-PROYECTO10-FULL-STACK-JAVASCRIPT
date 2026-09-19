import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dist = fileURLToPath(new URL('../dist', import.meta.url));
const files = (await readdir(dist, { recursive: true })).filter(file => file.endsWith('.html'));
const titles = new Set();
for (const file of files) {
  const html = await readFile(path.join(dist, file), 'utf8');
  assert(!html.includes('<!--seo-->'), `${file}: unfilled metadata`);
  assert.equal((html.match(/<title\b/g) || []).length, 1, `${file}: title`);
  assert.equal((html.match(/name="description"/g) || []).length, 1, `${file}: description`);
  assert.equal((html.match(/property="og:title"/g) || []).length, 1, `${file}: Open Graph`);
  if (file === '200.html') {
    assert(!html.includes('rel="canonical"'), 'Dynamic fallback must not canonicalize to home');
    assert(!html.includes('noindex'), 'Do not prevent rendering of dynamic event pages');
    continue;
  }
  const title = html.match(/<title[^>]*>(.*?)<\/title>/s)[1];
  assert(!titles.has(title), `${file}: duplicate title`);
  titles.add(title);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: one main heading`);
  const headings = [...html.matchAll(/<h([1-6])\b/g)].map(match => Number(match[1]));
  headings.slice(1).forEach((heading, index) => assert(heading <= headings[index] + 1, `${file}: skipped heading level`));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: duplicate IDs`);
  for (const reference of html.matchAll(/\s(?:aria-controls|aria-describedby|aria-labelledby)="([^"]+)"/g)) {
    for (const id of reference[1].split(' ')) assert(ids.includes(id), `${file}: missing ${id}`);
  }
  for (const [image] of html.matchAll(/<img\b[^>]*>/g)) assert(/\salt=/.test(image), `${file}: image without alt`);
  const privatePage = ['auth/index.html', 'forgot-password/index.html', 'reset-password/index.html', '404.html'].includes(file);
  assert(html.includes(privatePage ? 'noindex, follow' : 'index, follow'), `${file}: robots`);
  const json = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
  if (!privatePage) assert.equal(JSON.parse(json[1])['@type'], 'WebPage');
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
assert(!sitemap.includes('/auth') && !sitemap.includes('/events/new'));
assert.equal((sitemap.match(/<loc>/g) || []).length, 9);
console.log(`Built HTML checks passed: ${files.length} documents; headings, references, alt text, metadata and sitemap.`);
