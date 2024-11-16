import { Request, Response } from 'express';
import { AuthenticationError, DatabaseError } from '../utils/errors';

interface ErrorResponse {
  message: string;
  status: number;
  stack?: string;
}

export default function errorMiddleware(
  err: Error,
  req: Request,
  res: Response
) {
  const errorResponse: ErrorResponse = {
    message: 'Error interno del servidor',
    status: 500
  };

  // Agregar stack trace en desarrollo
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Manejar errores específicos
  if (err instanceof AuthenticationError) {
    errorResponse.status = 401;
    errorResponse.message = err.message;
  } else if (err instanceof DatabaseError) {
    errorResponse.status = 503;
    errorResponse.message = 'Error en el servicio de base de datos';
  } else if (err.name === 'ValidationError') {
    errorResponse.status = 400;
    errorResponse.message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    errorResponse.status = 401;
    errorResponse.message = 'Token inválido';
  } else if (err.name === 'TokenExpiredError') {
    errorResponse.status = 401;
    errorResponse.message = 'Token expirado';
  }

  // Registrar el error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Enviar respuesta
  res.status(errorResponse.status).json({
    error: {
      message: errorResponse.message,
      ...(errorResponse.stack && { stack: errorResponse.stack })
    }
  });
}
