import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { speakers } from './speakers.js';
import invitations from './speakerVideos.json';
import talks from './speakerTalks.json';
const publicFile = src => fileURLToPath(new URL(`../../public${src}`, import.meta.url));
describe('Published speaker media', () => {
  it('keeps every speaker portrait and bilingual invitation available after cleanup', () => {
    for (const speaker of speakers) {
      expect(existsSync(publicFile(speaker.image)), speaker.image).toBe(true);
      for (const language of ['es', 'en']) {
        const clip = invitations[speaker.id][language];
        for (const field of ['src', 'captions']) expect(existsSync(publicFile(clip[field])), clip[field]).toBe(true);
      }
    }
  });
  it('provides a complete local talk, poster, transcript and timed captions in each language', () => {
    for (const speaker of speakers) for (const language of ['es', 'en']) {
      const clip = talks[speaker.id][language];
      expect(clip.title).toBeTruthy();
      expect(clip.transcript.length).toBeGreaterThan(500);
      for (const field of ['src', 'poster', 'captions']) expect(existsSync(publicFile(clip[field])), clip[field]).toBe(true);
      const captions = readFileSync(publicFile(clip.captions), 'utf8');
      expect(captions.startsWith('WEBVTT')).toBe(true);
      expect(captions).toContain('-->');
    }
  });
});
