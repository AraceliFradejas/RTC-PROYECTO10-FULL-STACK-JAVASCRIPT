import multer from 'multer';
import { AppError } from '../utils/AppError.js';

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return callback(new AppError('La imagen debe ser JPG, PNG o WebP.', 400));
    }
    callback(null, true);
  },
});

