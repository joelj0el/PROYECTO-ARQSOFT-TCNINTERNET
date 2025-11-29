import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

/**
 * Middleware de manejo centralizado de errores
 * Captura todos los errores y devuelve respuestas consistentes
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Si es un error operacional conocido (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  // Error de JSON parsing (body-parser)
  if (err.name === 'SyntaxError' && 'body' in err) {
    res.status(400).json({
      success: false,
      message: 'Formato de datos inválido. Verifica que el email contenga @ y los datos sean correctos.'
    });
    return;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Error de validación: ' + err.message
    });
    return;
  }

  // Error desconocido o del sistema
  console.error('❌ Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};
