import 'dotenv/config';
import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Event } from '../src/models/Event.js';
import { User } from '../src/models/User.js';
import { toggleAttendance, deleteEvent } from '../src/controllers/eventController.js';

// Opt-in: uses a new isolated database, never the application database.
test('Real transactions enforce capacity, roll back failures and protect concurrent edits', { skip: process.env.RUN_DB_INTEGRATION !== 'true' }, async (t) => {
  assert.ok(process.env.MONGODB_URI, 'MONGODB_URI is required');
  const database = `kelsets_test_${randomUUID().replaceAll('-', '').slice(0, 20)}`;
  const mail = process.env.MAIL_ENABLED;
  process.env.MAIL_ENABLED = 'false';
  await mongoose.connect(process.env.MONGODB_URI, { dbName: database, serverSelectionTimeoutMS: 10000 });
  t.after(async () => {
    try { assert.equal(mongoose.connection.name, database); await mongoose.connection.dropDatabase(); }
    finally { await mongoose.disconnect(); if (mail === undefined) delete process.env.MAIL_ENABLED; else process.env.MAIL_ENABLED = mail; }
  });
  await Promise.all([User.init(), Event.init()]);
  const users = await User.create([
    { name: 'Test One', email: 'one@example.invalid', password: 'test-password-123' },
    { name: 'Test Two', email: 'two@example.invalid', password: 'test-password-123' },
  ]);
  const event = await Event.create({ title: 'Isolated concurrency test', date: new Date(Date.now() + 86400000), location: 'Test', description: 'Temporary event for integration verification.', creator: users[0]._id, capacity: 1 });
  const response = () => ({ json(body) { this.body = body; }, status(code) { this.code = code; return this; }, send() {} });
  const request = user => ({ params: { id: event.id }, user, body: { language: 'en' } });
  const outcomes = await Promise.allSettled(users.map(user => toggleAttendance(request(user), response())));
  assert.equal(outcomes.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(outcomes.find(r => r.status === 'rejected').reason.statusCode, 409);
  const booked = await Event.findById(event.id);
  assert.equal(booked.attendees.length, 1);
  const winner = users.find(u => u._id.equals(booked.attendees[0]));
  assert.equal(await User.countDocuments({ attendingEvents: event.id }), 1);
  const stale = await Event.findById(event.id);
  await toggleAttendance(request(winner), response());
  assert.equal((await Event.findById(event.id)).attendees.length, 0);
  assert.equal(await User.countDocuments({ attendingEvents: event.id }), 0);
  stale.title = 'Stale edit';
  await assert.rejects(stale.save(), { name: 'VersionError' });
  const failure = t.mock.method(User, 'updateOne', async () => { throw new Error('simulated second-write failure'); });
  await assert.rejects(toggleAttendance(request(users[0]), response()), /simulated second-write failure/);
  failure.mock.restore();
  assert.equal((await Event.findById(event.id)).attendees.length, 0);
  assert.equal(await User.countDocuments({ attendingEvents: event.id }), 0);
  await toggleAttendance(request(users[1]), response());
  await deleteEvent(request(users[0]), response());
  assert.equal(await Event.findById(event.id), null);
  assert.equal(await User.countDocuments({ attendingEvents: event.id }), 0);
});
