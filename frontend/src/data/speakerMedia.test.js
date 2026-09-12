import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { speakers } from './speakers.js';
import invitations from './speakerVideos.json';
import talks from './speakerTalks.json';
const publicFile = src => fileURLToPath(new URL(`../../public${src}`, import.meta.url));
describe('Published speaker media', () => {
  it('keeps portraits and static invitations available in both languages', () => {
    for (const speaker of speakers) {
      expect(existsSync(publicFile(speaker.image)), speaker.image).toBe(true);
      for (const language of ['es', 'en']) {
        const clip = invitations[speaker.id][language];
        expect(clip).not.toHaveProperty('src');
        expect(clip).toHaveProperty('youtubeUrl');
        if (clip.poster) expect(existsSync(publicFile(clip.poster))).toBe(true);
      }
    }
  });
  it('provides static talk posters and transcripts without bundling video sources', () => {
    for (const speaker of speakers) for (const language of ['es', 'en']) {
      const clip = talks[speaker.id][language];
      expect(clip.title).toBeTruthy();
      expect(clip.transcript.length).toBeGreaterThan(500);
      expect(existsSync(publicFile(clip.poster)), clip.poster).toBe(true);
      expect(clip).not.toHaveProperty('src');
      expect(clip).toHaveProperty('youtubeUrl');
    }
  });
});
