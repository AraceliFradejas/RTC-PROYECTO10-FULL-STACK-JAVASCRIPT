import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/db.js';

test('Concurrent cold requests share a connection and a failed attempt can retry', async (t) => {
  const previous = process.env.MONGODB_URI;
  process.env.MONGODB_URI = 'mongodb://unused/test';
  t.after(() => { if (previous === undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI = previous; });
  let finish;
  const connect = t.mock.method(mongoose, 'connect', () => new Promise(resolve => { finish = resolve; }));
  const first = connectDatabase();
  const second = connectDatabase();
  assert.equal(connect.mock.callCount(), 1);
  finish();
  await Promise.all([first, second]);
  connect.mock.mockImplementation(async () => { throw new Error('unavailable'); });
  await assert.rejects(connectDatabase(), /unavailable/);
  connect.mock.mockImplementation(async () => mongoose);
  assert.equal(await connectDatabase(), mongoose.connection);
  assert.equal(connect.mock.callCount(), 3);
});
