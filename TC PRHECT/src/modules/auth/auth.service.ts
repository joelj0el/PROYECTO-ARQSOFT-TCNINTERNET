import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from './auth.model';
import { config } from '../../shared/config/config';
import { AppError } from '../../shared/errors/app-error';

/**
 * Servicio de autenticación (Patrón Service Layer)
 * 
 * Según IEEE-1471-2000:
 * - Componente: S_Autenticacion
 * - Responsabilidad: Gestionar registro, login y generación de tokens JWT
 */
class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(userData: {
    nombre: string;
    email: string;
    password: string;
    rol?: 'cliente' | 'admin';
    telefono?: string;
  }): Promise<{ token: string; usuario: Partial<IUser> }> {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Crear nuevo usuario
    const user = await User.create({
      nombre: userData.nombre,
      email: userData.email,
      password: hashedPassword,
      rol: userData.rol || 'cliente',
      telefono: userData.telefono
    });

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: String(user._id),
        rol: user.rol
      },
      config.jwtSecret,
      { expiresIn: Number(config.jwtExpiresIn) }
    );

    return {
      token,
      usuario: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono
      }
    };
  }

  /**
   * Login de usuario
   */
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ token: string; usuario: Partial<IUser> }> {
    // Buscar usuario
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: String(user._id),
        rol: user.rol
      },
      config.jwtSecret,
      { expiresIn: Number(config.jwtExpiresIn) }
    );

    return {
      token,
      usuario: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono
      }
    };
  }

  /**
   * Obtener perfil de usuario por ID
   */
  async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return {
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      telefono: user.telefono,
      createdAt: user.createdAt
    };
  }
}

export const authService = new AuthService();
