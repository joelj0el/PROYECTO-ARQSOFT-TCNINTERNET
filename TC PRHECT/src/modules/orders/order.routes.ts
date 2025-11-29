import { Router } from 'express';
import { body, query } from 'express-validator';
import { orderController } from './order.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { adminMiddleware } from '../../shared/middlewares/admin.middleware';

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Órdenes]
 *     summary: Crear nueva orden
 *     description: Crea una orden verificando stock y usando transacciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoId:
 *                       type: string
 *                     cantidad:
 *                       type: number
 *               notas:
 *                 type: string
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Stock insuficiente o error de validación
 */
router.post(
  '/',
  authMiddleware,
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Debe incluir al menos un producto'),
    body('items.*.productoId')
      .notEmpty()
      .withMessage('El ID del producto es requerido')
      .isMongoId()
      .withMessage('ID de producto inválido'),
    body('items.*.cantidad')
      .notEmpty()
      .withMessage('La cantidad es requerida')
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser al menos 1'),
    body('notas')
      .optional()
      .isString()
      .withMessage('Las notas deben ser texto')
      .isLength({ max: 500 })
      .withMessage('Las notas no pueden exceder 500 caracteres')
  ],
  orderController.create.bind(orderController)
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Órdenes]
 *     summary: Obtener todas las órdenes (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pending, preparing, ready, completed, cancelled]
 *     responses:
 *       200:
 *         description: Lista de órdenes
 */
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    query('estado')
      .optional()
      .isIn(['pending', 'preparing', 'ready', 'completed', 'cancelled'])
      .withMessage('Estado inválido')
  ],
  orderController.getAll.bind(orderController)
);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     tags: [Órdenes]
 *     summary: Obtener mis órdenes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mis órdenes
 */
router.get(
  '/my-orders',
  authMiddleware,
  orderController.getMyOrders.bind(orderController)
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Órdenes]
 *     summary: Obtener orden por ID
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
 *         description: Orden encontrada
 *       404:
 *         description: Orden no encontrada
 */
router.get(
  '/:id',
  authMiddleware,
  orderController.getById.bind(orderController)
);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     tags: [Órdenes]
 *     summary: Actualizar estado de orden (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pending, preparing, ready, completed, cancelled]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  [
    body('estado')
      .notEmpty()
      .withMessage('El estado es requerido')
      .isIn(['pending', 'preparing', 'ready', 'completed', 'cancelled'])
      .withMessage('Estado inválido')
  ],
  orderController.updateStatus.bind(orderController)
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     tags: [Órdenes]
 *     summary: Cancelar orden (Cliente)
 *     description: El cliente puede cancelar su propia orden si está en estado pendiente
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
 *         description: Orden cancelada y stock restaurado
 */
router.patch(
  '/:id/cancel',
  authMiddleware,
  orderController.cancel.bind(orderController)
);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     tags: [Órdenes]
 *     summary: Eliminar orden (Admin)
 *     description: Solo se pueden eliminar órdenes canceladas
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
 *         description: Orden eliminada
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  orderController.delete.bind(orderController)
);

export default router;
