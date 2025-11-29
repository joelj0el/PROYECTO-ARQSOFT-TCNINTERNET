import { Router } from 'express';
import { body, query } from 'express-validator';
import { feedbackController } from './feedback.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { adminMiddleware } from '../../shared/middlewares/admin.middleware';

const router = Router();

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     tags: [Feedback]
 *     summary: Crear feedback con análisis de riesgo
 *     description: Crea feedback y analiza riesgo con 3 estrategias (Score, Keywords, Aspects)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ordenId, calificacion, aspectos]
 *             properties:
 *               ordenId:
 *                 type: string
 *               calificacion:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comentario:
 *                 type: string
 *               aspectos:
 *                 type: object
 *                 properties:
 *                   calidadComida:
 *                     type: number
 *                   tiempoEspera:
 *                     type: number
 *                   atencion:
 *                     type: number
 *     responses:
 *       201:
 *         description: Feedback creado con análisis de riesgo
 */
router.post(
  '/',
  authMiddleware,
  [
    body('ordenId')
      .notEmpty()
      .withMessage('El ID de la orden es requerido')
      .isMongoId()
      .withMessage('ID de orden inválido'),
    body('calificacion')
      .notEmpty()
      .withMessage('La calificación es requerida')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación debe estar entre 1 y 5'),
    body('comentario')
      .optional()
      .isString()
      .withMessage('El comentario debe ser un texto')
      .isLength({ max: 1000 })
      .withMessage('El comentario no puede exceder 1000 caracteres'),
    body('aspectos.calidadComida')
      .notEmpty()
      .withMessage('La calificación de calidad de comida es requerida')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación debe estar entre 1 y 5'),
    body('aspectos.tiempoEspera')
      .notEmpty()
      .withMessage('La calificación de tiempo de espera es requerida')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación debe estar entre 1 y 5'),
    body('aspectos.atencion')
      .notEmpty()
      .withMessage('La calificación de atención es requerida')
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación debe estar entre 1 y 5')
  ],
  feedbackController.create.bind(feedbackController)
);

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     tags: [Feedback]
 *     summary: Obtener todos los feedbacks (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nivelRiesgo
 *         schema:
 *           type: string
 *           enum: [bajo, medio, alto]
 *       - in: query
 *         name: calificacionMin
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *       - in: query
 *         name: calificacionMax
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *     responses:
 *       200:
 *         description: Lista de feedbacks con filtros aplicados
 */
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    query('nivelRiesgo')
      .optional()
      .isIn(['bajo', 'medio', 'alto'])
      .withMessage('Nivel de riesgo debe ser: bajo, medio o alto'),
    query('calificacionMin')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Calificación mínima debe estar entre 1 y 5'),
    query('calificacionMax')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Calificación máxima debe estar entre 1 y 5')
  ],
  feedbackController.getAll.bind(feedbackController)
);

/**
 * @swagger
 * /api/feedback/my-feedbacks:
 *   get:
 *     tags: [Feedback]
 *     summary: Obtener mis feedbacks (Cliente)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mis feedbacks
 */
router.get(
  '/my-feedbacks',
  authMiddleware,
  feedbackController.getMyFeedbacks.bind(feedbackController)
);

/**
 * @swagger
 * /api/feedback/statistics:
 *   get:
 *     tags: [Feedback]
 *     summary: Obtener estadísticas de feedback (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas completas incluyendo distribución de riesgo
 */
router.get(
  '/statistics',
  authMiddleware,
  adminMiddleware,
  feedbackController.getStatistics.bind(feedbackController)
);

/**
 * @swagger
 * /api/feedback/order/{ordenId}:
 *   get:
 *     tags: [Feedback]
 *     summary: Obtener feedback por orden
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ordenId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback de la orden
 */
router.get(
  '/order/:ordenId',
  authMiddleware,
  feedbackController.getByOrder.bind(feedbackController)
);

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     tags: [Feedback]
 *     summary: Obtener feedback por ID
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
 *         description: Feedback encontrado
 *       404:
 *         description: Feedback no encontrado
 */
router.get(
  '/:id',
  authMiddleware,
  feedbackController.getById.bind(feedbackController)
);

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     tags: [Feedback]
 *     summary: Eliminar feedback (Admin)
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
 *         description: Feedback eliminado
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  feedbackController.delete.bind(feedbackController)
);

export default router;
