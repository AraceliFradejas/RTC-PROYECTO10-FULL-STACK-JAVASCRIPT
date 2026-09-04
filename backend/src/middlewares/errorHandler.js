import { AppError } from '../utils/AppError.js';

export const notFound = (req, _res, next) => next(new AppError(`Ruta no encontrada: ${req.method} ${req.path}`, 404));

export const errorHandler = (error, _req, res, _next) => {
  let status = error.statusCode || 500;
  let message = error.message || 'Ha ocurrido un error inesperado.';
  let details = error.details || null;

  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Revisa los datos del formulario.';
    details = Object.values(error.errors).map(({ path, message: fieldMessage }) => ({ field: path, message: fieldMessage }));
  }
  if (error.code === 11000) {
    status = 409;
    message = 'Ya existe una cuenta con ese correo electrónico.';
  }

  res.status(status).json({ success: false, error: { message, details } });
};

