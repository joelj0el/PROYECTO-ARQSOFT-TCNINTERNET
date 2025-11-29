import { Feedback, IFeedback } from './feedback.model';
import { AppError } from '../../shared/errors/app-error';
import { emailAdapter } from '../../shared/adapters/email.adapter';
import { IRiskAnalyzer } from './strategies/risk-analyzer.strategy';
import { ScoreBasedStrategy } from './strategies/score-based.strategy';
import { KeywordAnalysisStrategy } from './strategies/keyword-analysis.strategy';
import { AspectBasedStrategy } from './strategies/aspect-based.strategy';
import { Types } from 'mongoose';

/**
 * Servicio de gestión de retroalimentación (Patrón Service Layer + Strategy)
 * 
 * Según IEEE-1471-2000:
 * - Componente: S_GestionFeedback
 * - Implementa: Análisis de riesgo usando 3 estrategias en paralelo
 * - Responsabilidad: Orquestar análisis de riesgo y generar alertas
 */
class FeedbackService {
  private riskStrategies: IRiskAnalyzer[];

  constructor() {
    // Inicializar las 3 estrategias de análisis de riesgo
    this.riskStrategies = [
      new ScoreBasedStrategy(),
      new KeywordAnalysisStrategy(),
      new AspectBasedStrategy()
    ];
  }

  /**
   * Analiza el nivel de riesgo usando las 3 estrategias
   * Retorna el nivel más alto detectado
   */
  private analyzeRisk(feedbackData: {
    calificacion: number;
    comentario?: string;
    aspectos: {
      calidadComida: number;
      tiempoEspera: number;
      atencion: number;
    };
  }): 'bajo' | 'medio' | 'alto' {
    // Ejecutar todas las estrategias en paralelo
    const results = this.riskStrategies.map((strategy) =>
      strategy.analyze(feedbackData)
    );

    // Determinar el nivel de riesgo más alto
    // Prioridad: alto > medio > bajo
    if (results.includes('alto')) {
      return 'alto';
    } else if (results.includes('medio')) {
      return 'medio';
    } else {
      return 'bajo';
    }
  }

  /**
   * Crear nuevo feedback con análisis de riesgo
   */
  async create(
    ordenId: string,
    clienteId: string,
    feedbackData: {
      calificacion: number;
      comentario?: string;
      aspectos: {
        calidadComida: number;
        tiempoEspera: number;
        atencion: number;
      };
    }
  ): Promise<IFeedback> {
    // Verificar que la orden no tenga ya un feedback
    const existingFeedback = await Feedback.findOne({ orden: ordenId });
    if (existingFeedback) {
      throw new AppError('Esta orden ya tiene un feedback registrado', 400);
    }

    // Analizar nivel de riesgo
    const nivelRiesgo = this.analyzeRisk(feedbackData);

    // Crear el feedback
    const feedback = await Feedback.create({
      orden: ordenId,
      cliente: clienteId,
      ...feedbackData,
      nivelRiesgo,
      alertaGenerada: false
    });

    // Si el riesgo es alto, generar alerta
    if (nivelRiesgo === 'alto') {
      try {
        await emailAdapter.sendAlert({
          to: 'admin@snacksoft.com',
          subject: '⚠️ Alerta de Calidad - Feedback Negativo',
          body: `Se ha detectado un feedback con riesgo ALTO para la orden ${ordenId}.\n\nCalificación: ${feedbackData.calificacion}/5\nComentario: ${feedbackData.comentario || 'Sin comentario'}\n\nAspectos:\n- Calidad de comida: ${feedbackData.aspectos.calidadComida}/5\n- Tiempo de espera: ${feedbackData.aspectos.tiempoEspera}/5\n- Atención: ${feedbackData.aspectos.atencion}/5`
        });

        // Marcar que se generó la alerta
        feedback.alertaGenerada = true;
        await feedback.save();
      } catch (error) {
        console.error('Error al enviar alerta de email:', error);
        // No fallar la creación del feedback si el email falla
      }
    }

    return feedback;
  }

  /**
   * Obtener todos los feedbacks con filtros opcionales
   */
  async findAll(filters?: {
    clienteId?: string;
    nivelRiesgo?: 'bajo' | 'medio' | 'alto';
    calificacionMin?: number;
    calificacionMax?: number;
  }): Promise<IFeedback[]> {
    const query: any = {};

    if (filters?.clienteId) {
      query.cliente = filters.clienteId;
    }

    if (filters?.nivelRiesgo) {
      query.nivelRiesgo = filters.nivelRiesgo;
    }

    if (filters?.calificacionMin !== undefined) {
      query.calificacion = { ...query.calificacion, $gte: filters.calificacionMin };
    }

    if (filters?.calificacionMax !== undefined) {
      query.calificacion = { ...query.calificacion, $lte: filters.calificacionMax };
    }

    return await Feedback.find(query)
      .populate('cliente', 'nombre email')
      .populate('orden')
      .sort({ createdAt: -1 });
  }

  /**
   * Obtener feedback por ID
   */
  async findById(feedbackId: string): Promise<IFeedback> {
    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new AppError('ID de feedback inválido', 400);
    }

    const feedback = await Feedback.findById(feedbackId)
      .populate('cliente', 'nombre email')
      .populate('orden');

    if (!feedback) {
      throw new AppError('Feedback no encontrado', 404);
    }

    return feedback;
  }

  /**
   * Obtener feedback por orden
   */
  async findByOrder(ordenId: string): Promise<IFeedback | null> {
    if (!Types.ObjectId.isValid(ordenId)) {
      throw new AppError('ID de orden inválido', 400);
    }

    return await Feedback.findOne({ orden: ordenId })
      .populate('cliente', 'nombre email')
      .populate('orden');
  }

  /**
   * Obtener estadísticas de feedback
   */
  async getStatistics(): Promise<{
    total: number;
    promedioGeneral: number;
    distribucionRiesgo: {
      bajo: number;
      medio: number;
      alto: number;
    };
    alertasGeneradas: number;
  }> {
    const feedbacks = await Feedback.find();

    const total = feedbacks.length;
    const promedioGeneral =
      total > 0
        ? feedbacks.reduce((sum, f) => sum + f.calificacion, 0) / total
        : 0;

    const distribucionRiesgo = {
      bajo: feedbacks.filter((f) => f.nivelRiesgo === 'bajo').length,
      medio: feedbacks.filter((f) => f.nivelRiesgo === 'medio').length,
      alto: feedbacks.filter((f) => f.nivelRiesgo === 'alto').length
    };

    const alertasGeneradas = feedbacks.filter((f) => f.alertaGenerada).length;

    return {
      total,
      promedioGeneral: parseFloat(promedioGeneral.toFixed(2)),
      distribucionRiesgo,
      alertasGeneradas
    };
  }

  /**
   * Eliminar feedback (solo admin)
   */
  async delete(feedbackId: string): Promise<void> {
    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new AppError('ID de feedback inválido', 400);
    }

    const feedback = await Feedback.findByIdAndDelete(feedbackId);

    if (!feedback) {
      throw new AppError('Feedback no encontrado', 404);
    }
  }
}

export const feedbackService = new FeedbackService();
