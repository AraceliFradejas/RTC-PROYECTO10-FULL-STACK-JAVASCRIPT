import { it, expect } from 'vitest';
import { availability } from './availability.js';
const event = { date: '2027-03-01', capacity: 100, attendees: [] };
const now = Date.parse('2026-09-13');
it('Updates urgency from actual attendance, including cancellation and full capacity', () => {
  expect(availability(event, now).tone).toBe('open');
  expect(availability({ ...event, attendees: Array(70) }, now).tone).toBe('reserve');
  expect(availability({ ...event, attendees: Array(95) }, now).remaining).toBe(5);
  expect(availability({ ...event, attendees: Array(95) }, now).tone).toBe('urgent');
  expect(availability({ ...event, attendees: Array(100) }, now).message).toBe('Aforo completo');
  expect(availability(event, Date.parse('2028-01-01')).message).toBe('Evento finalizado');
});
