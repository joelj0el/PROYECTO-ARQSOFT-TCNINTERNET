import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos (con filtros opcionales)
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [bebida, comida, snack, postre, otro]
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/', getProducts);

/**
 * @openapi
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getProductById);

/**
 * @openapi
 * /api/products:
 *   post:
 *     tags: [Productos]
 *     summary: Crear un nuevo producto (solo admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('nombre')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('descripcion')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('La descripción debe tener entre 1 y 500 caracteres'),
    body('precio')
      .isFloat({ min: 0 })
      .withMessage('El precio debe ser un número positivo'),
    body('categoria')
      .isIn(['bebida', 'comida', 'snack', 'postre', 'otro'])
      .withMessage('Categoría inválida'),
    body('disponible')
      .optional()
      .isBoolean()
      .withMessage('Disponible debe ser un valor booleano'),
    body('imagen')
      .optional()
      .trim()
      .isURL()
      .withMessage('La imagen debe ser una URL válida')
  ],
  createProduct
);

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar un producto (solo admin)
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('nombre')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('La descripción debe tener entre 1 y 500 caracteres'),
    body('precio')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El precio debe ser un número positivo'),
    body('categoria')
      .optional()
      .isIn(['bebida', 'comida', 'snack', 'postre', 'otro'])
      .withMessage('Categoría inválida'),
    body('disponible')
      .optional()
      .isBoolean()
      .withMessage('Disponible debe ser un valor booleano'),
    body('imagen')
      .optional()
      .trim()
      .isURL()
      .withMessage('La imagen debe ser una URL válida')
  ],
  updateProduct
);

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar un producto (solo admin)
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
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
