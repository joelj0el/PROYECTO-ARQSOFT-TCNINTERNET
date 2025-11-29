import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

// Extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token no proporcionado. Acceso denegado.'
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: string;
        rol: string;
      };

      req.userId = decoded.userId;
      req.userRole = decoded.rol;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};
