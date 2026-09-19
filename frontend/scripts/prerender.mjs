import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
try {
  const { renderPage, getMetadata, metadataHtml, utilityRoutes, publicRoutes, siteUrl } = await server.ssrLoadModule('/src/entry-server.jsx');
  const template = await readFile(path.join(dist, 'index.html'), 'utf8');
  // The SPA fallback must not advertise every unknown URL as the home page.
  const fallback = template.replace('<!--seo-->', metadataHtml({ ...getMetadata('/events/pending'), url: null, structured: null }));
  await writeFile(path.join(dist, '200.html'), fallback);
  await writeFile(path.join(dist, '404.html'), template.replace('<!--seo-->', metadataHtml(getMetadata('/not-found'))).replace('<div id="root"></div>', () => `<div id="root">${renderPage('/not-found')}</div>`));
  for (const route of [...publicRoutes, ...utilityRoutes]) {
    const html = template.replace('<!--seo-->', metadataHtml(getMetadata(route)))
      .replace('<div id="root"></div>', () => `<div id="root">${renderPage(route)}</div>`);
    const directory = path.join(dist, route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), html);
  }
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(route => `<url><loc>${siteUrl}${route}</loc></url>`).join('')}</urlset>\n`);
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`Prerendered ${publicRoutes.length + utilityRoutes.length} routes, sitemap.xml and robots.txt.`);
} finally {
  await server.close();
}
