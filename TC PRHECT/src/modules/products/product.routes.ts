import { Router } from 'express';
import { body } from 'express-validator';
import { productController } from './product.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { adminMiddleware } from '../../shared/middlewares/admin.middleware';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', productController.getAll.bind(productController));

/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     tags: [Productos]
 *     summary: Productos con stock bajo (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productos donde stock <= stockMinimo
 */
router.get('/low-stock', authMiddleware, adminMiddleware, productController.getLowStock.bind(productController));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', productController.getById.bind(productController));

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Productos]
 *     summary: Crear producto (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, precio, categoria]
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria:
 *                 type: string
 *                 enum: [bebida, comida, snack, postre, otro]
 *               disponible:
 *                 type: boolean
 *               stock:
 *                 type: number
 *               stockMinimo:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('nombre').trim().isLength({ min: 3, max: 100 }),
    body('descripcion').trim().isLength({ min: 1, max: 500 }),
    body('precio').isFloat({ min: 0 }),
    body('categoria').isIn(['bebida', 'comida', 'snack', 'postre', 'otro']),
    body('stock').optional().isInt({ min: 0 }),
    body('stockMinimo').optional().isInt({ min: 0 }),
    body('disponible').optional().isBoolean(),
    body('imagen').optional().trim().isURL()
  ],
  productController.create.bind(productController)
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar producto (Admin)
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
 *               precio:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('nombre').optional().trim().isLength({ min: 3, max: 100 }),
    body('descripcion').optional().trim().isLength({ min: 1, max: 500 }),
    body('precio').optional().isFloat({ min: 0 }),
    body('categoria').optional().isIn(['bebida', 'comida', 'snack', 'postre', 'otro']),
    body('stock').optional().isInt({ min: 0 }),
    body('stockMinimo').optional().isInt({ min: 0 }),
    body('disponible').optional().isBoolean(),
    body('imagen').optional().trim().isURL()
  ],
  productController.update.bind(productController)
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar producto (Admin)
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
 *         description: Producto eliminado
 */
router.delete('/:id', authMiddleware, adminMiddleware, productController.delete.bind(productController));

export default router;
