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
