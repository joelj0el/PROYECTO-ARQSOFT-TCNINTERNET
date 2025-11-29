import { User, IUser } from '../auth/auth.model';
import { AppError } from '../../shared/errors/app-error';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Servicio de gestión de usuarios (Patrón Service Layer)
 * 
 * Según IEEE-1471-2000:
 * - Componente: S_GestionUsuarios
 * - Responsabilidad: CRUD de usuarios (solo admin)
 */
class UsersService {
  /**
   * Obtener todos los usuarios
   */
  async findAll(filters?: { rol?: 'cliente' | 'admin' }): Promise<Partial<IUser>[]> {
    const query: any = {};

    if (filters?.rol) {
      query.rol = filters.rol;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return users;
  }

  /**
   * Obtener usuario por ID
   */
  async findById(userId: string): Promise<Partial<IUser>> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError('ID de usuario inválido', 400);
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return user;
  }

  /**
   * Actualizar usuario
   */
  async update(
    userId: string,
    updateData: {
      nombre?: string;
      email?: string;
      telefono?: string;
      rol?: 'cliente' | 'admin';
      password?: string;
    }
  ): Promise<Partial<IUser>> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError('ID de usuario inválido', 400);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    // Si se actualiza el email, verificar que no exista
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        throw new AppError('El email ya está registrado', 400);
      }
      user.email = updateData.email;
    }

    // Actualizar campos
    if (updateData.nombre) user.nombre = updateData.nombre;
    if (updateData.telefono !== undefined) user.telefono = updateData.telefono;
    if (updateData.rol) user.rol = updateData.rol;

    // Si se actualiza la contraseña, encriptarla
    if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
    }

    await user.save();

    return await User.findById(userId).select('-password');
  }

  /**
   * Eliminar usuario
   */
  async delete(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError('ID de usuario inválido', 400);
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
  }
}

export const usersService = new UsersService();
