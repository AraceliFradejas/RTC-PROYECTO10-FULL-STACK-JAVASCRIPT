import test from 'node:test';
import assert from 'node:assert/strict';
import { eventPayload } from '../src/controllers/eventController.js';

test('eventPayload conserva únicamente los campos editables', () => {
  const payload = eventPayload({
    title: 'The Next Inch',
    date: '2027-02-18T18:00:00.000Z',
    location: 'Madrid',
    description: 'Una experiencia de liderazgo para equipos.',
    category: 'Liderazgo',
    capacity: 180,
    attendees: ['usuario-inyectado'],
    creator: 'creador-inyectado',
    role: 'admin',
    posterPublicId: 'archivo-inyectado',
  });

  assert.deepEqual(payload, {
    title: 'The Next Inch',
    date: '2027-02-18T18:00:00.000Z',
    location: 'Madrid',
    description: 'Una experiencia de liderazgo para equipos.',
    category: 'Liderazgo',
    capacity: 180,
  });
});

test('eventPayload permite actualizaciones parciales sin añadir valores ausentes', () => {
  assert.deepEqual(eventPayload({ title: 'Nuevo título' }), { title: 'Nuevo título' });
});

test('La búsqueda incluye traducciones, ignora acentos y trata la entrada como texto literal', async () => {
  const { eventQuery } = await import('../src/controllers/eventController.js');
  const query = eventQuery({ search: 'Málaga (equipo)', category: 'Equipo' });
  assert.equal(query.category, 'Equipo');
  assert.ok(query.$or.some(field => field['translations.es.title']));
  assert.ok(query.$or.some(field => field['translations.en.description']));
  const expression = Object.values(query.$or[0])[0];
  const regex = new RegExp(expression.$regex, expression.$options);
  assert.ok(regex.test('Málaga (equipo)'));
  assert.ok(regex.test('malaga (equipo)'));
  assert.ok(!regex.test('Málaga equipo'));
  assert.deepEqual(eventQuery({ search: { $ne: '' }, category: { $ne: '' } }), {});
});

test('La API permite asignar un ponente conocido y rechaza identificadores inventados', () => {
  assert.deepEqual(eventPayload({ speakerId: 'alison-patrick', creator: 'injected' }), { speakerId: 'alison-patrick' });
  assert.deepEqual(eventPayload({ speakerId: '' }), { speakerId: '' });
  assert.throws(() => eventPayload({ speakerId: 'unknown' }), { statusCode: 400 });
});
