import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Feedback } from '../models/Feedback';
import { Order } from '../models/Order';

/**
 * Obtener todos los feedbacks
 * GET /api/feedback
 * - Cliente: solo sus propios feedbacks
 * - Admin: todos los feedbacks
 */
export const getFeedbacks = async (req: Request, res: Response): Promise<void> => {
  try {
    // Construir filtro según rol
    const filter: any = {};
    
    // Si es cliente, solo puede ver sus propios feedbacks
    if (req.userRole === 'cliente') {
      filter.cliente = req.userId;
    }

    const feedbacks = await Feedback.find(filter)
      .populate('cliente', 'nombre email')
      .populate('orden')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error al obtener feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener feedbacks'
    });
  }
};

/**
 * Crear un nuevo feedback
 * POST /api/feedback
 */
export const createFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar errores de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { orden, calificacion, comentario, aspectos } = req.body;

    // Verificar que la orden existe
    const orderExists = await Order.findById(orden);
    if (!orderExists) {
      res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
      return;
    }

    // Verificar que la orden pertenece al cliente
    if (orderExists.cliente.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: 'No puedes crear feedback para una orden que no te pertenece'
      });
      return;
    }

    // Verificar que la orden esté completada
    if (orderExists.estado !== 'completed') {
      res.status(400).json({
        success: false,
        message: 'Solo puedes dar feedback a órdenes completadas'
      });
      return;
    }

    // Verificar que no exista ya un feedback para esta orden
    const existingFeedback = await Feedback.findOne({ orden });
    if (existingFeedback) {
      res.status(400).json({
        success: false,
        message: 'Ya existe un feedback para esta orden'
      });
      return;
    }

    // Crear el feedback
    const feedback = new Feedback({
      orden,
      cliente: req.userId,
      calificacion,
      comentario,
      aspectos
    });

    await feedback.save();

    // Poblar información
    await feedback.populate('cliente', 'nombre email');
    await feedback.populate('orden');

    res.status(201).json({
      success: true,
      message: 'Feedback creado exitosamente',
      data: feedback
    });
  } catch (error) {
    console.error('Error al crear feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear feedback'
    });
  }
};

/**
 * Obtener estadísticas de feedback (solo admin)
 * GET /api/feedback/stats
 */
export const getFeedbackStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const feedbacks = await Feedback.find();

    if (feedbacks.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No hay feedbacks registrados',
        data: {
          total: 0,
          promedioGeneral: 0,
          promedioAspectos: {
            calidadComida: 0,
            tiempoEspera: 0,
            atencion: 0
          },
          distribucion: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          },
          alertasCalidad: 0
        }
      });
      return;
    }

    // Calcular promedios
    const totalFeedbacks = feedbacks.length;
    const sumaCalificaciones = feedbacks.reduce((acc: number, fb: any) => acc + fb.calificacion, 0);
    const promedioGeneral = sumaCalificaciones / totalFeedbacks;

    // Promedios por aspecto
    const sumaCalidadComida = feedbacks.reduce((acc: number, fb: any) => acc + fb.aspectos.calidadComida, 0);
    const sumaTiempoEspera = feedbacks.reduce((acc: number, fb: any) => acc + fb.aspectos.tiempoEspera, 0);
    const sumaAtencion = feedbacks.reduce((acc: number, fb: any) => acc + fb.aspectos.atencion, 0);

    // Distribución de calificaciones
    const distribucion = {
      5: feedbacks.filter((fb: any) => fb.calificacion === 5).length,
      4: feedbacks.filter((fb: any) => fb.calificacion === 4).length,
      3: feedbacks.filter((fb: any) => fb.calificacion === 3).length,
      2: feedbacks.filter((fb: any) => fb.calificacion === 2).length,
      1: feedbacks.filter((fb: any) => fb.calificacion === 1).length
    };

    // Alertas de calidad (calificación <= 2)
    const alertasCalidad = feedbacks.filter((fb: any) => fb.calificacion <= 2).length;

    res.status(200).json({
      success: true,
      data: {
        total: totalFeedbacks,
        promedioGeneral: parseFloat(promedioGeneral.toFixed(2)),
        promedioAspectos: {
          calidadComida: parseFloat((sumaCalidadComida / totalFeedbacks).toFixed(2)),
          tiempoEspera: parseFloat((sumaTiempoEspera / totalFeedbacks).toFixed(2)),
          atencion: parseFloat((sumaAtencion / totalFeedbacks).toFixed(2))
        },
        distribucion,
        alertasCalidad,
        porcentajeAlertas: parseFloat(((alertasCalidad / totalFeedbacks) * 100).toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
};
