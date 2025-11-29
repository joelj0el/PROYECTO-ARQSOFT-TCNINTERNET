import { IRiskAnalyzer } from './risk-analyzer.strategy';

/**
 * Estrategia de análisis basada en aspectos específicos
 * 
 * Reglas:
 * - Si algún aspecto <= 2: Riesgo ALTO
 * - Si algún aspecto === 3 y ninguno <= 2: Riesgo MEDIO
 * - Si todos los aspectos >= 4: Riesgo BAJO
 */
export class AspectBasedStrategy implements IRiskAnalyzer {
  getName(): string {
    return 'AspectBasedStrategy';
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
    const { calidadComida, tiempoEspera, atencion } = feedback.aspectos;
    const aspectos = [calidadComida, tiempoEspera, atencion];

    // Verificar si hay algún aspecto con calificación muy baja
    const hasVeryLowAspect = aspectos.some((aspecto) => aspecto <= 2);
    if (hasVeryLowAspect) {
      return 'alto';
    }

    // Verificar si hay algún aspecto con calificación media
    const hasMediumAspect = aspectos.some((aspecto) => aspecto === 3);
    if (hasMediumAspect) {
      return 'medio';
    }

    // Todos los aspectos son >= 4
    return 'bajo';
  }
}
