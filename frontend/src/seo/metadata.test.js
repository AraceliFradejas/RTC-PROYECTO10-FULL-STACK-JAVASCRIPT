import { describe, expect, it } from 'vitest';
import { getMetadata, metadataHtml, publicRoutes } from './metadata.js';

describe('metadata for public and private routes', () => {
  it('gives every public route its own canonical, title and educational description in both languages', () => {
    for (const language of ['es', 'en']) {
      const entries = publicRoutes.map(path => getMetadata(path, language));
      expect(new Set(entries.map(entry => entry.title)).size).toBe(publicRoutes.length);
      for (const entry of entries) {
        expect(entry.robots).toBe('index, follow');
        expect(entry.url.startsWith('https://kelse-ts-talks.vercel.app/')).toBe(true);
        expect(entry.structured.inLanguage).toBe(language);
        expect(entry.description.length).toBeGreaterThan(50);
      }
    }
  });
  it('excludes login, event creation and missing resources without declaring fictional people/events as real', () => {
    for (const path of ['/auth', '/forgot-password', '/reset-password', '/events/new', '/missing', '/speakers/missing']) {
      expect(getMetadata(path).robots).toBe('noindex, follow');
      expect(getMetadata(path).structured).toBeNull();
    }
    expect(getMetadata('/events/123', 'es', undefined, true).robots).toBe('noindex, follow');
    expect(getMetadata('/speakers/alison-patrick').structured['@type']).toBe('WebPage');
  });
  it('updates event content and escapes untrusted text in HTML and JSON-LD', () => {
    const event = { title: '</title><script>alert(1)</script>', description: 'An organiser description <script>', poster: '/poster.png' };
    const meta = getMetadata('/events/123', 'en', event);
    expect(meta.title).toContain(event.title);
    expect(meta.image).toBe('https://kelse-ts-talks.vercel.app/poster.png');
    const html = metadataHtml(meta);
    expect(html).not.toContain('<script>alert(1)');
    expect(html).toContain('\\u003c');
    expect(html).toContain('&lt;/title&gt;');
  });
});
