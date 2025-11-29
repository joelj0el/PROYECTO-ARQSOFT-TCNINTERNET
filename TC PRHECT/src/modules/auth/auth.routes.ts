import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from './auth.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               rol:
 *                 type: string
 *                 enum: [cliente, admin]
 *                 default: cliente
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post(
  '/register',
  [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 3, max: 50 })
      .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('email')
      .notEmpty()
      .withMessage('El email es requerido')
      .isEmail()
      .withMessage('Debe ser un email válido'),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol')
      .optional()
      .isIn(['cliente', 'admin'])
      .withMessage('Rol inválido'),
    body('telefono')
      .optional()
      .isString()
      .withMessage('El teléfono debe ser texto')
  ],
  authController.register.bind(authController)
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión
 *     description: Autenticar usuario y obtener token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  '/login',
  [
    body('email')
      .notEmpty()
      .withMessage('El email es requerido')
      .isEmail()
      .withMessage('Debe ser un email válido'),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
  ],
  authController.login.bind(authController)
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Autenticación]
 *     summary: Obtener perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: No autorizado
 */
router.get(
  '/profile',
  authMiddleware,
  authController.getProfile.bind(authController)
);

export default router;
