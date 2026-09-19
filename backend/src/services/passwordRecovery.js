import { createHash, randomBytes } from 'node:crypto';
import { RecoveryLimit } from '../models/RecoveryLimit.js';

export const recoveryLifetime = 30 * 60 * 1000;
export const hashRecoveryToken = token => createHash('sha256').update(token).digest('hex');
export const generateRecoveryToken = () => randomBytes(32).toString('hex');
export const validRecoveryToken = token => typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
export const sessionIsCurrent = (payload, user) => (payload.ver ?? 0) === (user.sessionVersion ?? 0);

export async function allowRecoveryRequest(scope, value, limit, now = Date.now()) {
  const window = 15 * 60 * 1000;
  const bucket = Math.floor(now / window);
  const _id = `${scope}:${hashRecoveryToken(value)}:${bucket}`;
  const update = { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * window) } };
  let entry;
  try { entry = await RecoveryLimit.findOneAndUpdate({ _id }, update, { upsert: true, new: true }); }
  catch (error) {
    if (error.code !== 11000) throw error;
    entry = await RecoveryLimit.findOneAndUpdate({ _id }, { $inc: { count: 1 } }, { new: true });
  }
  return entry.count <= limit;
}
