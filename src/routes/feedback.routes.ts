import { Router } from 'express';
import { body } from 'express-validator';
import {
  getFeedbacks,
  createFeedback,
  getFeedbackStats
} from '../controllers/feedback.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

/**
 * @openapi
 * /api/feedback:
 *   get:
 *     tags: [Feedback]
 *     summary: Listar feedbacks (cliente ve los suyos, admin ve todos)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de feedbacks
 */
router.get('/', authMiddleware, getFeedbacks);

/**
 * @openapi
 * /api/feedback/stats:
 *   get:
 *     tags: [Feedback]
 *     summary: Obtener estadísticas de feedback (solo admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas calculadas
 *       401:
 *         description: No autorizado
 */
router.get('/stats', authMiddleware, adminMiddleware, getFeedbackStats);

/**
 * @openapi
 * /api/feedback:
 *   post:
 *     tags: [Feedback]
 *     summary: Crear un nuevo feedback para una orden (una vez por orden)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orden, calificacion, aspectos]
 *             properties:
 *               orden:
 *                 type: string
 *               calificacion:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comentario:
 *                 type: string
 *               aspectos:
 *                 type: object
 *                 properties:
 *                   calidadComida:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                   tiempoEspera:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                   atencion:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *     responses:
 *       201:
 *         description: Feedback creado
 *       400:
 *         description: Datos inválidos o ya existe feedback para la orden
 *       401:
 *         description: No autorizado
 */
router.post(
  '/',
  authMiddleware,
  [
    body('orden')
      .notEmpty()
      .withMessage('El ID de la orden es requerido'),
    body('calificacion')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación debe ser un número entre 1 y 5'),
    body('comentario')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('El comentario no puede exceder 1000 caracteres'),
    body('aspectos.calidadComida')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación de calidad de comida debe ser entre 1 y 5'),
    body('aspectos.tiempoEspera')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación de tiempo de espera debe ser entre 1 y 5'),
    body('aspectos.atencion')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación de atención debe ser entre 1 y 5')
  ],
  createFeedback
);

export default router;
