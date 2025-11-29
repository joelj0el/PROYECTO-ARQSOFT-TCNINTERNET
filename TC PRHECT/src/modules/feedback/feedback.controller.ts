import { Request, Response, NextFunction } from 'express';
import { feedbackService } from './feedback.service';

/**
 * Controlador de Feedback (Patrón MVC - Capa de Presentación)
 * Delega toda la lógica de negocio al FeedbackService
 */
class FeedbackController {
  /**
   * Crear nuevo feedback (Cliente)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ordenId, calificacion, comentario, aspectos } = req.body;
      const clienteId = req.userId!;

      const feedback = await feedbackService.create(ordenId, clienteId, {
        calificacion,
        comentario,
        aspectos
      });

      res.status(201).json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todos los feedbacks con filtros (Admin)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nivelRiesgo, calificacionMin, calificacionMax } = req.query;

      const feedbacks = await feedbackService.findAll({
        nivelRiesgo: nivelRiesgo as 'bajo' | 'medio' | 'alto' | undefined,
        calificacionMin: calificacionMin ? Number(calificacionMin) : undefined,
        calificacionMax: calificacionMax ? Number(calificacionMax) : undefined
      });

      res.json({ success: true, data: feedbacks });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener mis feedbacks (Cliente)
   */
  async getMyFeedbacks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clienteId = req.userId!;
      const feedbacks = await feedbackService.findAll({ clienteId });
      res.json({ success: true, data: feedbacks });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener feedback por ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const feedback = await feedbackService.findById(id);
      res.json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener feedback por orden
   */
  async getByOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ordenId } = req.params;
      const feedback = await feedbackService.findByOrder(ordenId);
      res.json({ success: true, data: feedback });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadísticas (Admin)
   */
  async getStatistics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await feedbackService.getStatistics();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar feedback (Admin)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await feedbackService.delete(id);
      res.json({ success: true, message: 'Feedback eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

export const feedbackController = new FeedbackController();
