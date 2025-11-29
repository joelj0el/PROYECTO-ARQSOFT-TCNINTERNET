import { Router } from 'express';
import { body, query } from 'express-validator';
import { usersController } from './users.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { adminMiddleware } from '../../shared/middlewares/admin.middleware';

const router = Router();

/**
 * Todas las rutas requieren autenticación y permisos de admin
 */
router.use(authMiddleware, adminMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener todos los usuarios (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: rol
 *         schema:
 *           type: string
 *           enum: [cliente, admin]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get(
  '/',
  [
    query('rol')
      .optional()
      .isIn(['cliente', 'admin'])
      .withMessage('Rol inválido')
  ],
  usersController.getAll.bind(usersController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener usuario por ID (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', usersController.getById.bind(usersController));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar usuario (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               rol:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put(
  '/:id',
  [
    body('nombre')
      .optional()
      .isLength({ min: 3, max: 50 })
      .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('email').optional().isEmail().withMessage('Debe ser un email válido'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol')
      .optional()
      .isIn(['cliente', 'admin'])
      .withMessage('Rol inválido'),
    body('telefono').optional().isString().withMessage('El teléfono debe ser texto')
  ],
  usersController.update.bind(usersController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar usuario (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/:id', usersController.delete.bind(usersController));

export default router;
