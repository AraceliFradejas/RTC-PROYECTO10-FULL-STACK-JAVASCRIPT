import { Router } from 'express';
import { getMe, login, register, updateMe } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';
import { uploadImage } from '../middlewares/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRouter = Router();
authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.get('/me', requireAuth, asyncHandler(getMe));
authRouter.patch('/me', requireAuth, uploadImage.single('avatar'), asyncHandler(updateMe));

