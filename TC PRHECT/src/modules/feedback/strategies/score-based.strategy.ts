import { IRiskAnalyzer } from './risk-analyzer.strategy';

/**
 * Estrategia de análisis basada en calificación general
 * 
 * Reglas:
 * - calificacion <= 2: Riesgo ALTO
 * - calificacion === 3: Riesgo MEDIO
 * - calificacion >= 4: Riesgo BAJO
 */
export class ScoreBasedStrategy implements IRiskAnalyzer {
  getName(): string {
    return 'ScoreBasedStrategy';
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
    if (feedback.calificacion <= 2) {
      return 'alto';
    } else if (feedback.calificacion === 3) {
      return 'medio';
    } else {
      return 'bajo';
    }
  }
}
