import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { createToken } from '../utils/token.js';
import { uploadBuffer } from '../config/cloudinary.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new AppError('Nombre, email y contraseña son obligatorios.', 400);
  if (password.length < 8) throw new AppError('La contraseña debe tener al menos 8 caracteres.', 400);

  const exists = await User.exists({ email: email.trim().toLowerCase() });
  if (exists) throw new AppError('Ya existe una cuenta con ese correo electrónico.', 409);

  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, data: { token: createToken(user.id), user: publicUser(user) } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email y contraseña son obligatorios.', 400);
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new AppError('El email o la contraseña no son correctos.', 401);
  res.json({ success: true, data: { token: createToken(user.id), user: publicUser(user) } });
};

export const getMe = async (req, res) => res.json({ success: true, data: publicUser(req.user) });

export const updateMe = async (req, res) => {
  if (req.body.name) req.user.name = req.body.name;
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, 'lumina/avatars');
    req.user.avatar = uploaded.secure_url;
    req.user.avatarPublicId = uploaded.public_id;
  }
  await req.user.save();
  res.json({ success: true, data: publicUser(req.user) });
};

