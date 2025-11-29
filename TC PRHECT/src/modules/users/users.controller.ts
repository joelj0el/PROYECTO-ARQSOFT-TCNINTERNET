import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';

/**
 * Controlador de Usuarios (Patrón MVC - Capa de Presentación)
 * Delega toda la lógica de negocio al UsersService
 */
class UsersController {
  /**
   * Obtener todos los usuarios (Admin)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rol } = req.query;

      const users = await usersService.findAll({
        rol: rol as 'cliente' | 'admin' | undefined
      });

      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener usuario por ID (Admin)
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await usersService.findById(id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar usuario (Admin)
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre, email, telefono, rol, password } = req.body;

      const user = await usersService.update(id, {
        nombre,
        email,
        telefono,
        rol,
        password
      });

      res.json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar usuario (Admin)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await usersService.delete(id);
      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
