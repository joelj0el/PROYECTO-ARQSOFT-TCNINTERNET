import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFeedback extends Document {
  orden: Types.ObjectId;
  cliente: Types.ObjectId;
  calificacion: number;
  comentario?: string;
  aspectos: {
    calidadComida: number;
    tiempoEspera: number;
    atencion: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    orden: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'La orden es requerida'],
      unique: true // Una orden solo puede tener un feedback
    },
    cliente: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El cliente es requerido']
    },
    calificacion: {
      type: Number,
      required: [true, 'La calificación es requerida'],
      min: [1, 'La calificación mínima es 1'],
      max: [5, 'La calificación máxima es 5']
    },
    comentario: {
      type: String,
      trim: true,
      maxlength: [1000, 'El comentario no puede exceder 1000 caracteres']
    },
    aspectos: {
      calidadComida: {
        type: Number,
        required: [true, 'La calificación de calidad de comida es requerida'],
        min: [1, 'La calificación mínima es 1'],
        max: [5, 'La calificación máxima es 5']
      },
      tiempoEspera: {
        type: Number,
        required: [true, 'La calificación de tiempo de espera es requerida'],
        min: [1, 'La calificación mínima es 1'],
        max: [5, 'La calificación máxima es 5']
      },
      atencion: {
        type: Number,
        required: [true, 'La calificación de atención es requerida'],
        min: [1, 'La calificación mínima es 1'],
        max: [5, 'La calificación máxima es 5']
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices para búsquedas y análisis
// Nota: 'orden' ya tiene unique: true, por lo que no es necesario crear otro índice simple
feedbackSchema.index({ cliente: 1 });
feedbackSchema.index({ calificacion: 1 });
feedbackSchema.index({ createdAt: -1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
