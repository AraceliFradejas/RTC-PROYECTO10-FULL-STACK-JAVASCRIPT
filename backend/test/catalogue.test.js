import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import mongoose from 'mongoose';
import { Event } from '../src/models/Event.js';

const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const catalogue = read('../src/data/events.json');

test('La agenda persistida conserva las 12 charlas aprobadas, carteles y traducciones', async () => {
  const preview = read('../../frontend/src/data/previewEvents.json');
  const translations = read('../../frontend/src/i18n/events.json');
  assert.equal(catalogue.length, 12);
  assert.equal(new Set(catalogue.map(e => e.seedKey)).size, 12);
  assert.equal(new Set(catalogue.map(e => e.poster)).size, 12);
  for (const speaker of ['alison-patrick', 'jude-becks', 'anna-nasser', 'travis-wood']) {
    assert.equal(catalogue.filter(e => e.speakerId === speaker).length, 3);
  }
  for (const data of catalogue) {
    const original = preview.find(e => e._id === `preview-event-${data.seedKey}`);
    for (const field of ['title', 'date', 'location', 'category', 'poster', 'description', 'capacity', 'speakerId']) {
      assert.equal(data[field], original[field]);
    }
    const localized = translations.find(e => e.sourceTitle === original.title);
    assert.deepEqual(data.translations, { es: localized.es, en: localized.en });
    assert.ok(existsSync(new URL(`../../frontend/public${data.poster}`, import.meta.url)));
    const event = new Event({ ...data, creator: new mongoose.Types.ObjectId() });
    await event.validate();
    assert.deepEqual(event.toObject().translations, data.translations);
  }
});

test('El modelo rechaza ponentes desconocidos y traducciones incompletas', () => {
  const event = new Event({ ...catalogue[0], creator: new mongoose.Types.ObjectId(), speakerId: 'unknown', translations: { en: { title: 'Valid title' } } });
  const error = event.validateSync();
  assert.ok(error.errors.speakerId);
  assert.ok(error.errors['translations.en.description']);
});
