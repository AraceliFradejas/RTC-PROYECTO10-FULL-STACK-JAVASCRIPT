import { describe, expect, it } from 'vitest';
import { canEditEvent, eventFormData, localDateTime } from './eventEditing.js';

describe('event editing', () => {
  it('allows the creator and administrators, excludes guests and other users', () => {
    const event = { creator: { _id: 'owner' } };
    expect(canEditEvent(event, null)).toBe(false);
    expect(canEditEvent(event, { id: 'other', role: 'user' })).toBe(false);
    expect(canEditEvent(event, { id: 'owner', role: 'user' })).toBe(true);
    expect(canEditEvent(event, { id: 'admin', role: 'admin' })).toBe(true);
    expect(canEditEvent({ creator: 'owner' }, { id: 'owner' })).toBe(true);
  });
  it('preserves the exact original date and does not replace a poster when only text changes', () => {
    const original = { date: '2027-03-15T17:30:12.000Z' };
    const form = eventFormData({ date: localDateTime(original.date), description: 'Updated description', speakerId: '' }, null, original);
    expect(form.get('date')).toBe(original.date);
    expect(form.get('description')).toBe('Updated description');
    expect(form.get('speakerId')).toBe('');
    expect(form.has('poster')).toBe(false);
  });
  it('converts a changed local date to an ISO instant and includes an explicitly chosen poster', () => {
    const date = '2027-04-16T10:00';
    const poster = new Blob(['test'], { type: 'image/png' });
    const form = eventFormData({ date }, poster, { date: '2027-03-15T17:30:00Z' });
    expect(form.get('date')).toBe(new Date(date).toISOString());
    expect(form.get('poster').size).toBe(4);
  });
});

describe('fechas al editar', () => {
  it('permite conservar la fecha pasada pero no crear ni mover a otra fecha pasada', async () => {
    const { validEventDate } = await import('./eventEditing.js');
    const original = { date: '2020-01-01T12:00:00Z' };
    expect(validEventDate(localDateTime(original.date), original)).toBe(true);
    expect(validEventDate('2020-01-02T12:00', original)).toBe(false);
    expect(validEventDate(localDateTime(original.date))).toBe(false);
    expect(validEventDate('invalid', original)).toBe(false);
  });
});
