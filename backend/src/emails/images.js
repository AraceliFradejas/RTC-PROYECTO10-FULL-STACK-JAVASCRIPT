import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
const catalogue = JSON.parse(readFileSync(new URL('../data/events.json', import.meta.url), 'utf8'));

// Only packaged, approved assets can be read; event input cannot select arbitrary files.
const posters = new Map(catalogue.map(event => [event.poster, event.poster.split('/').pop()]));
const contentType = filename => filename.endsWith('.webp') ? 'image/webp' : filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
export const emailImages = async event => {
  const assets = [['logo', 'kelcets-logo.png']];
  const poster = posters.get(event.poster);
  if (poster) assets.push(['poster', poster]);
  const images = {};
  const attachments = [];
  for (const [key, filename] of assets) {
    const cid = `${key}.${randomUUID()}@kelsets.example`;
    attachments.push({ filename, content: await readFile(new URL(`./assets/${filename}`, import.meta.url)), contentType: contentType(filename), contentDisposition: 'inline', cid });
    images[key] = `cid:${cid}`;
  }
  return { images, attachments };
};
