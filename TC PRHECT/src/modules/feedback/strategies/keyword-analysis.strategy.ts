import { IRiskAnalyzer } from './risk-analyzer.strategy';

/**
 * Estrategia de análisis basada en palabras clave en comentarios
 * 
 * Reglas:
 * - Palabras negativas graves (malo, horrible, pésimo, desastre, incomible): Riesgo ALTO
 * - Palabras negativas moderadas (regular, mejorar, demorado, frío): Riesgo MEDIO
 * - Sin palabras negativas o sin comentario: Riesgo BAJO
 */
export class KeywordAnalysisStrategy implements IRiskAnalyzer {
  private readonly HIGH_RISK_KEYWORDS = [
    'malo',
    'horrible',
    'pésimo',
    'desastre',
    'incomible',
    'asqueroso',
    'terrible',
    'inaceptable',
    'pésima',
    'fatal'
  ];

  private readonly MEDIUM_RISK_KEYWORDS = [
    'regular',
    'mejorar',
    'demorado',
    'frío',
    'fría',
    'tardó',
    'lento',
    'lenta',
    'poco',
    'insuficiente',
    'falta'
  ];

  getName(): string {
    return 'KeywordAnalysisStrategy';
  }

  analyze(feedback: {
    calificacion: number;
    comentario?: string;
    aspectos: {
      calidadComida: number;
      tiempoEspera: number;
      atencion: number;
    };
  }): 'bajo' | 'medio' | 'alto' {
    if (!feedback.comentario) {
      return 'bajo';
    }

    const comentarioLower = feedback.comentario.toLowerCase();

    // Verificar palabras de alto riesgo
    const hasHighRiskKeyword = this.HIGH_RISK_KEYWORDS.some((keyword) =>
      comentarioLower.includes(keyword)
    );

    if (hasHighRiskKeyword) {
      return 'alto';
    }

    // Verificar palabras de riesgo medio
    const hasMediumRiskKeyword = this.MEDIUM_RISK_KEYWORDS.some((keyword) =>
      comentarioLower.includes(keyword)
    );

    if (hasMediumRiskKeyword) {
      return 'medio';
    }

    return 'bajo';
  }
}
