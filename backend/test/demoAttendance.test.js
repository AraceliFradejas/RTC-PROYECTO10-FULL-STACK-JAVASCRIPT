import test from 'node:test';
import assert from 'node:assert/strict';
import { demoTarget, missingDemoIds } from '../src/data/demoAttendance.js';

test('Demo targets leave few places in Q1 and progressively more later', () => {
  const event = { capacity: 100, date: '2027-03-31T12:00:00Z' };
  assert.equal(demoTarget(event), 93);
  assert.equal(demoTarget({ ...event, date: '2027-04-01' }), 68);
  assert.equal(demoTarget({ ...event, date: '2027-07-01' }), 24);
  assert.equal(demoTarget({ ...event, date: '2028-01-01' }), 0);
});
test('Repeated demo planning preserves existing reservations and respects capacity', () => {
  const event = { capacity: 4, attendees: ['real', 'demo1'] };
  const users = ['demo1', 'demo2', 'demo3'];
  assert.deepEqual(missingDemoIds(event, users, 3), ['demo2']);
  assert.deepEqual(missingDemoIds({ ...event, attendees: [...event.attendees, 'demo2'] }, users, 3), []);
  assert.deepEqual(missingDemoIds(event, users, 99), ['demo2', 'demo3']);
});
