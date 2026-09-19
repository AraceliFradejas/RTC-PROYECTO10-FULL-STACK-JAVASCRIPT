import { allowRecoveryRequest } from '../services/passwordRecovery.js';
import { isEmail } from '../utils/validation.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Account-based buckets use the same persistent store as password recovery.
export const authLimit = (scope, limit) => asyncHandler(async (req, res, next) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (isEmail(email) && !await allowRecoveryRequest(scope, email, limit)) {
    res.set('Retry-After', '900');
    throw new AppError('Demasiados intentos. Espera 15 minutos antes de volver a intentarlo.', 429);
  }
  next();
});
