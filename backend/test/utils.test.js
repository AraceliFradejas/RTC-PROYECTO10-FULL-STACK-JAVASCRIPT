import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { AppError } from '../src/utils/AppError.js';
import { createToken } from '../src/utils/token.js';

test('AppError conserva el mensaje, código y detalles', () => {
  const error = new AppError('Dato no válido', 422, [{ field: 'title' }]);
  assert.equal(error.message, 'Dato no válido');
  assert.equal(error.statusCode, 422);
  assert.deepEqual(error.details, [{ field: 'title' }]);
});

test('createToken firma un JWT con el usuario como subject', () => {
  process.env.JWT_SECRET = 'test-secret-that-is-only-used-in-tests';
  const token = createToken('user-123');
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  assert.equal(payload.sub, 'user-123');
  assert.ok(payload.exp > payload.iat);
});

