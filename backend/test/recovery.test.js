import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { createRecoveryHandlers } from '../src/controllers/recoveryController.js';
import { generateRecoveryToken, hashRecoveryToken, validRecoveryToken, sessionIsCurrent } from '../src/services/passwordRecovery.js';
import { passwordRecoveryEmail, recoveryUrl } from '../src/emails/passwordRecovery.js';
import { recoveryMailConfigured, sendRecoveryEmail } from '../src/services/recoveryMail.js';

const response = () => ({ headers: {}, set(key, value) { this.headers[key] = value; return this; }, json(body) { this.body = body; return this; } });
const options = { configured: () => true, allow: async () => true, wait: async () => {}, responseDelay: 0 };

test('Recovery token is unpredictable, validated and only its hash is used for storage', () => {
  const first = generateRecoveryToken();
  assert.ok(validRecoveryToken(first));
  assert.notEqual(generateRecoveryToken(), first);
  assert.notEqual(hashRecoveryToken(first), first);
  for (const value of [null, {}, 'abc', 'a'.repeat(63), 'z'.repeat(64)]) assert.equal(validRecoveryToken(value), false);
});

test('Absent, existing, throttled and failed-mail accounts return the same neutral response', async () => {
  const bodies = [];
  for (const scenario of ['absent', 'existing', 'throttled', 'failed']) {
    let sent, update, cleanup;
    const users = {
      findOneAndUpdate: async (filter, data) => { assert.equal(filter.email, 'test@example.invalid'); update = data; return scenario === 'absent' ? null : { _id: 'user1', email: filter.email }; },
      updateOne: async (filter, data) => { cleanup = { filter, data }; },
    };
    const handler = createRecoveryHandlers({ ...options, users, allow: async () => scenario !== 'throttled', sendMail: async data => { sent = data; return scenario !== 'failed'; } });
    const res = response();
    await handler.forgotPassword({ body: { email: ' Test@Example.invalid ', language: 'en' } }, res);
    bodies.push(res.body);
    assert.equal(res.headers['Cache-Control'], 'no-store');
    if (sent) {
      assert.equal(update.$set.passwordResetTokenHash, hashRecoveryToken(sent.token));
      assert.equal(sent.language, 'en');
      assert.ok(update.$set.passwordResetExpiresAt > new Date());
      assert.ok(!JSON.stringify(res.body).includes(sent.token));
    }
    if (scenario === 'failed') assert.equal(cleanup.filter.passwordResetTokenHash, update.$set.passwordResetTokenHash);
    if (scenario === 'throttled') assert.equal(update, undefined);
  }
  for (const body of bodies) assert.deepEqual(body, bodies[0]);
});

test('Recovery rejects malformed inputs and globally unavailable mail without querying a user', async () => {
  const users = { findOneAndUpdate: () => assert.fail('must not query') };
  const handler = createRecoveryHandlers({ ...options, users, configured: () => false });
  await assert.rejects(handler.forgotPassword({ body: { email: {} } }, response()), { statusCode: 400 });
  await assert.rejects(handler.forgotPassword({ body: { email: 'test@example.invalid' } }, response()), { statusCode: 503 });
  const reset = createRecoveryHandlers({ ...options, users }).resetPassword;
  await assert.rejects(reset({ body: { token: {}, password: 'valid-password' } }, response()), { statusCode: 400 });
  for (const password of ['short', 'é'.repeat(37), {}]) await assert.rejects(reset({ body: { token: generateRecoveryToken(), password } }, response()), { statusCode: 400 });
});

test('Password update consumes token atomically, hashes the password and invalidates old sessions', async () => {
  let saved;
  const token = generateRecoveryToken();
  const users = { exists: async () => true, findOneAndUpdate: async (filter, update) => {
    assert.equal(filter.passwordResetTokenHash, hashRecoveryToken(token));
    assert.ok(filter.passwordResetExpiresAt.$gt instanceof Date);
    saved = update; return { _id: 'user1' };
  } };
  const res = response();
  await createRecoveryHandlers({ ...options, users }).resetPassword({ body: { token, password: 'brand-new-password' } }, res);
  assert.ok(await bcrypt.compare('brand-new-password', saved.$set.password));
  assert.deepEqual(saved.$unset, { passwordResetTokenHash: 1, passwordResetExpiresAt: 1 });
  assert.equal(saved.$inc.sessionVersion, 1);
  assert.equal(res.body.data, undefined); // No automatic authentication or reset token in response.
  assert.equal(sessionIsCurrent({}, {}), true); // Existing pre-migration sessions keep working.
  assert.equal(sessionIsCurrent({}, { sessionVersion: 1 }), false);
  assert.equal(sessionIsCurrent({ ver: 1 }, { sessionVersion: 1 }), true);
  users.exists = async () => false;
  await assert.rejects(createRecoveryHandlers({ ...options, users }).resetPassword({ body: { token, password: 'brand-new-password' } }, response()), { statusCode: 400 });
});

test('Recovery mail is bilingual, uses the configured origin and keeps token out of query/path', async () => {
  const token = generateRecoveryToken();
  const url = new URL(recoveryUrl('https://talks.example.com', token, 'en'));
  assert.equal(url.pathname, '/reset-password');
  assert.equal(url.search, '');
  assert.ok(url.hash.includes(token));
  assert.throws(() => recoveryUrl('http://untrusted.example', token));
  const es = passwordRecoveryEmail({ appUrl: 'https://talks.example.com', token });
  const en = passwordRecoveryEmail({ appUrl: 'https://talks.example.com', token, language: 'en' });
  assert.match(es.text, /30 minutos/); assert.match(en.text, /30 minutes/);
  assert.match(es.html, /&amp;language=es/);
  assert.equal(recoveryMailConfigured({}), false);
  const env = { MAIL_ENABLED: 'true', SMTP_HOST: 'smtp.example.com', SMTP_USER: 'user', SMTP_PASSWORD: 'secret', MAIL_FROM: 'sender@example.com', PUBLIC_APP_URL: 'https://talks.example.com' };
  assert.equal(recoveryMailConfigured(env), true);
  let message, closed = false;
  assert.equal(await sendRecoveryEmail({ email: 'test@example.invalid', token, language: 'en' }, { env, createTransport: () => ({ sendMail: async value => { message = value; return { accepted: ['test@example.invalid'] }; }, close: () => { closed = true; } }) }), true);
  assert.equal(message.to, 'test@example.invalid'); assert.ok(closed);
  assert.equal(await sendRecoveryEmail({ email: 'test@example.invalid', token }, { env, createTransport: () => ({ sendMail: async () => { throw new Error('SMTP error'); }, close() {} }) }), false);
});
