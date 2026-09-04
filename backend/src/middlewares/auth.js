import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new AppError('Necesitas iniciar sesión para continuar.', 401);

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Tu sesión ha caducado. Vuelve a iniciar sesión.', 401);
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new AppError('La persona asociada a esta sesión ya no existe.', 401);
  req.user = user;
  next();
});

