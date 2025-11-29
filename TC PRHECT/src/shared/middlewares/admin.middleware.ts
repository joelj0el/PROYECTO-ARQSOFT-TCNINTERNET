import { Response, NextFunction, Request } from 'express';

/**
 * Middleware de autorización por rol (Patrón RBAC)
 * Verifica que el usuario autenticado tenga rol de administrador
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.userRole) {
    res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
    return;
  }

  if (req.userRole !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
    return;
  }

  next();
};
