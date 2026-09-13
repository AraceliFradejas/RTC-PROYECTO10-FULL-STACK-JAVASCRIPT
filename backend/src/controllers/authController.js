import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { createToken } from '../utils/token.js';
import { validateCredentials } from '../utils/validation.js';
import { saveWithImage } from '../utils/saveImage.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
});

export const register = async (req, res) => {
  const { name, email, password } = validateCredentials(req.body, true);

  const exists = await User.exists({ email: email.trim().toLowerCase() });
  if (exists) throw new AppError('Ya existe una cuenta con ese correo electrónico.', 409);

  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, data: { token: createToken(user.id), user: publicUser(user) } });
};

export const login = async (req, res) => {
  const { email, password } = validateCredentials(req.body);
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new AppError('El email o la contraseña no son correctos.', 401);
  res.json({ success: true, data: { token: createToken(user.id), user: publicUser(user) } });
};

export const getMe = async (req, res) => res.json({ success: true, data: publicUser(req.user) });

export const updateMe = async (req, res) => {
  if (req.body?.name !== undefined) {
    if (typeof req.body.name !== 'string') throw new AppError('El nombre debe tener entre 2 y 60 caracteres.', 400);
    req.user.name = req.body.name;
  }
  // The private image ID is needed to retire the previous avatar after saving.
  const stored = await User.findById(req.user.id).select('+avatarPublicId');
  stored.name = req.user.name;
  await saveWithImage(stored, req.file, { field: 'avatar', idField: 'avatarPublicId', folder: 'kelsets-talks/avatars' });
  req.user = stored;
  res.json({ success: true, data: publicUser(req.user) });
};
