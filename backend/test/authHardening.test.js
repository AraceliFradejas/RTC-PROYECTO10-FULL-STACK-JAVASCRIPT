import test from 'node:test';
import assert from 'node:assert/strict';
import { assertAuthConfiguration } from '../src/config/auth.js';
import { authLimit } from '../src/middlewares/authLimit.js';
import { RecoveryLimit } from '../src/models/RecoveryLimit.js';

test('JWT requiere un secreto configurado de longitud suficiente', () => {
  const original = process.env.JWT_SECRET;
  try {
    delete process.env.JWT_SECRET;
    assert.throws(assertAuthConfiguration, /JWT_SECRET/);
    process.env.JWT_SECRET = 'short';
    assert.throws(assertAuthConfiguration, /JWT_SECRET/);
    process.env.JWT_SECRET = 'a-test-secret-with-at-least-32-characters';
    assert.doesNotThrow(assertAuthConfiguration);
  } finally {
    if (original === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = original;
  }
});

test('El límite de acceso comparte el correo normalizado y devuelve 429 con espera', async t => {
  const keys = [];
  let count = 0;
  t.mock.method(RecoveryLimit, 'findOneAndUpdate', async ({ _id }) => { keys.push(_id); return { count: ++count }; });
  const middleware = authLimit('login', 1);
  const headers = {};
  const response = { set: (name, value) => { headers[name] = value; } };
  let result;
  await middleware({ body: { email: ' User@Example.com ' } }, response, error => { result = error; });
  assert.equal(result, undefined);
  await middleware({ body: { email: 'user@example.com' } }, response, error => { result = error; });
  assert.equal(result.statusCode, 429);
  assert.equal(headers['Retry-After'], '900');
  assert.equal(keys[0], keys[1]);
  assert.ok(!keys[0].includes('user@example.com'));
});
