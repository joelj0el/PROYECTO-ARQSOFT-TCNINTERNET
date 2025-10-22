import { Router } from 'express';
import { body } from 'express-validator';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags: [Órdenes]
 *     summary: Listar órdenes (cliente ve las suyas, admin ve todas)
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
router.get('/', authMiddleware, getOrders);

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags: [Órdenes]
 *     summary: Obtener una orden por ID
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
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No encontrada
 */
router.get('/:id', authMiddleware, getOrderById);

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags: [Órdenes]
 *     summary: Crear una nueva orden
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
 *                   $ref: '#/components/schemas/OrderItem'
 *               notas:
 *                 type: string
 *                 example: "Sin cebolla"
 *     responses:
 *       201:
 *         description: Orden creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  '/',
  authMiddleware,
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Debe incluir al menos un producto'),
    body('items.*.producto')
      .notEmpty()
      .withMessage('El ID del producto es requerido'),
    body('items.*.cantidad')
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser un número entero positivo'),
    body('notas')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Las notas no pueden exceder 500 caracteres')
  ],
  createOrder
);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   put:
 *     tags: [Órdenes]
 *     summary: Actualizar el estado de una orden (solo admin)
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
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No encontrada
 */
router.put(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  [
    body('estado')
      .isIn(['pending', 'preparing', 'ready', 'completed', 'cancelled'])
      .withMessage('Estado inválido')
  ],
  updateOrderStatus
);

export default router;
