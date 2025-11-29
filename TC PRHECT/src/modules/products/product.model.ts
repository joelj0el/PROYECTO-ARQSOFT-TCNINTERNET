import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'bebida' | 'comida' | 'snack' | 'postre' | 'otro';
  disponible: boolean;
  stock: number;
  stockMinimo: number;
  imagen?: string;
  createdAt: Date;
  updatedAt: Date;
  stockBajo: boolean; // Virtual
}

const productSchema = new Schema<IProduct>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    precio: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo']
    },
    categoria: {
      type: String,
      enum: ['bebida', 'comida', 'snack', 'postre', 'otro'],
      required: [true, 'La categoría es requerida']
    },
    disponible: {
      type: Boolean,
      default: true
    },
    stock: {
      type: Number,
      required: [true, 'El stock es requerido'],
      min: [0, 'El stock no puede ser negativo'],
      default: 50
    },
    stockMinimo: {
      type: Number,
      required: [true, 'El stock mínimo es requerido'],
      min: [0, 'El stock mínimo no puede ser negativo'],
      default: 10
    },
    imagen: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual: indicador de stock bajo
productSchema.virtual('stockBajo').get(function() {
  return this.stock <= this.stockMinimo;
});

// Pre-save hook: si el stock es 0, marcar como no disponible
productSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.disponible = false;
  }
  next();
});

// Índices para búsquedas
productSchema.index({ categoria: 1, disponible: 1 });
productSchema.index({ stock: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
