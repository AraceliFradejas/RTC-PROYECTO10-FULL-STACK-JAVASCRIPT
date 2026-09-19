import { AppError } from './AppError.js';

export const isEmail = value => typeof value === 'string' && value.length <= 254 && /^\S+@\S+\.\S+$/.test(value);

export const validateNewPassword = password => {
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) throw new AppError('La contraseña debe tener al menos 8 caracteres y ocupar como máximo 72 bytes.', 400);
};

export const validateCredentials = (body = {}, registration = false) => {
  const { name, email, password } = body || {};
  if (typeof email !== 'string' || !isEmail(email.trim())) throw new AppError('Escribe un email válido.', 400);
  if (typeof password !== 'string' || !password.length) throw new AppError('Email y contraseña son obligatorios.', 400);
  if (registration) validateNewPassword(password);
  if (registration && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60)) throw new AppError('El nombre debe tener entre 2 y 60 caracteres.', 400);
  return { ...(registration ? { name: name.trim() } : {}), email: email.trim().toLowerCase(), password };
};
