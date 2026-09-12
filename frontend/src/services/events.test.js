import { afterEach, describe, expect, it, vi } from 'vitest';
import events from '../data/previewEvents.json';
import { filterPreviewEvents } from './events.js';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });
describe('local event preview', () => {
  it('finds translated titles, accents and the renamed speakers', () => {
    expect(filterPreviewEvents(events, '?search=alison', 'es')[0].title).toBe('The Next Inch: Leadership');
    expect(filterPreviewEvents(events, '?search=remontada', 'es')[0].title).toBe('The Comeback Mindset');
    expect(filterPreviewEvents(events, '?search=trust', 'en').length).toBeGreaterThan(0);
    expect(filterPreviewEvents(events, '?search=malaga', 'es')[0].location).toContain('Málaga');
    expect(filterPreviewEvents(events, '?category=Innovación', 'en')).toHaveLength(3);
    expect(filterPreviewEvents(events, '?search=no-match', 'es')).toHaveLength(0);
  });
  it('offers three distinct talks per speaker spread across 2027', () => {
    for (const speaker of ['alison-patrick', 'jude-becks', 'anna-nasser', 'travis-wood']) {
      const talks = events.filter(event => event.speakerId === speaker);
      expect(talks).toHaveLength(3);
      expect(new Set(talks.map(event => event.title)).size).toBe(3);
      const months = talks.map(event => new Date(event.date).getUTCMonth());
      expect(Math.max(...months) - Math.min(...months)).toBeGreaterThanOrEqual(6);
      expect(talks.every(event => event.date.startsWith('2027-'))).toBe(true);
    }
  });
  it('sorts without changing the source catalogue', () => {
    const first = events[0]._id;
    expect(filterPreviewEvents(events, '?sort=newest')[0]._id).toBe(events.at(-1)._id);
    expect(filterPreviewEvents(events, '?sort=soonest')[0]._id).toBe(first);
    expect(events[0]._id).toBe(first);
  });
  it('opens all twelve detail records without making network requests', async () => {
    vi.stubEnv('DEV', true); vi.stubEnv('VITE_PREVIEW_MODE', 'true');
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    const { getEvent, getEvents } = await import('./events.js');
    const { data } = await getEvents('');
    expect(data).toHaveLength(12);
    for (const event of data) expect((await getEvent(event._id)).data).toEqual(event);
    await expect(getEvent('missing')).rejects.toMatchObject({ status: 404 });
    expect(fetch).not.toHaveBeenCalled();
  });
  it('rejects cancelled preview requests', async () => {
    vi.stubEnv('DEV', true); vi.stubEnv('VITE_PREVIEW_MODE', 'true');
    const { getEvents } = await import('./events.js');
    const controller = new AbortController(); controller.abort();
    await expect(getEvents('', { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' });
  });
  it('cannot enable sample data in production, even when the flag is set', async () => {
    vi.stubEnv('DEV', false); vi.stubEnv('VITE_PREVIEW_MODE', 'true');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    const { previewMode, getEvents } = await import('./events.js');
    expect(previewMode).toBe(false);
    await expect(getEvents('')).rejects.toMatchObject({ status: 0 });
  });
});
