import { AppError } from '../utils/AppError.js';

export const notFound = (req, _res, next) => next(new AppError(`Ruta no encontrada: ${req.method} ${req.path}`, 404));

export const errorHandler = (error, _req, res, _next) => {
  let status = error instanceof AppError ? error.statusCode : 500;
  let message = error instanceof AppError ? error.message : 'Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde.';
  let details = error instanceof AppError ? error.details : null;
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    status = 400;
    message = 'Revisa los datos del formulario.';
    details = error.errors ? Object.values(error.errors).map(({ path }) => ({ field: path, message: 'El valor de este campo no es válido.' })) : null;
  } else if (error.name === 'MulterError') {
    status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = error.code === 'LIMIT_FILE_SIZE' ? 'La imagen no puede superar 5 MB.' : 'Revisa los archivos adjuntos del formulario.';
  } else if (error.type === 'entity.parse.failed') {
    status = 400; message = 'El contenido de la petición no es un JSON válido.';
  } else if (error.type === 'entity.too.large') {
    status = 413; message = 'La petición supera el tamaño permitido.';
  } else if (error.code === 11000) {
    status = 409;
    message = error.keyPattern?.email ? 'Ya existe una cuenta con ese correo electrónico.' : 'Ya existe un registro con esos datos.';
  }
  res.status(status).json({ success: false, error: { message, details } });
};
