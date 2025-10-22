import { Response, NextFunction, Request } from 'express';

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
