/**
 * Interfaz para estrategias de análisis de riesgo (Patrón Strategy)
 * Según IEEE-1471-2000: I_AnalizarRiesgo
 */
export interface IRiskAnalyzer {
  analyze(feedback: {
    calificacion: number;
    comentario?: string;
    aspectos: {
      calidadComida: number;
      tiempoEspera: number;
      atencion: number;
    };
  }): 'bajo' | 'medio' | 'alto';

  getName(): string;
}
