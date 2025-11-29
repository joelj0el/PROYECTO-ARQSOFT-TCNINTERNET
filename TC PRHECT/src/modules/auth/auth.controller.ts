import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

/**
 * Controlador de Autenticación (Patrón MVC - Capa de Presentación)
 * Delega toda la lógica de negocio al AuthService
 */
class AuthController {
  /**
   * Registrar nuevo usuario
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nombre, email, password, rol, telefono } = req.body;

      const result = await authService.register({
        nombre,
        email,
        password,
        rol,
        telefono
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login de usuario
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId!;
      const profile = await authService.getProfile(userId);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
