import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRoutes.js';
import { eventRouter } from './routes/eventRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { connectDatabase } from './config/db.js';
import { AppError } from './utils/AppError.js';

export const app = express();
const origins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', async (_req, _res, next) => {
  try { await connectDatabase(); next(); }
  catch { next(new AppError('El servicio no está disponible temporalmente. Inténtalo de nuevo.', 503)); }
});
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'KelseTS Talks API está lista.' }));
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use(notFound);
app.use(errorHandler);
