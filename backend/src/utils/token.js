import jwt from 'jsonwebtoken';

export const createToken = (userId, version = 0) =>
  jwt.sign({ sub: userId, ver: version }, process.env.JWT_SECRET, { expiresIn: '7d' });

