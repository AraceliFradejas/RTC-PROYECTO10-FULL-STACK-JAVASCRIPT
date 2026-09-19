import { authLimit } from '../middlewares/authLimit.js';
import { forgotPassword, resetPassword } from '../controllers/recoveryController.js';
import { Router } from 'express';
import { getMe, login, register, updateMe } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';
import { uploadImage } from '../middlewares/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRouter = Router();
authRouter.post('/forgot-password', asyncHandler(forgotPassword));
authRouter.post('/reset-password', asyncHandler(resetPassword));
authRouter.post('/register', authLimit('register', 5), asyncHandler(register));
authRouter.post('/login', authLimit('login', 10), asyncHandler(login));
authRouter.get('/me', requireAuth, asyncHandler(getMe));
authRouter.patch('/me', requireAuth, uploadImage.single('avatar'), asyncHandler(updateMe));

