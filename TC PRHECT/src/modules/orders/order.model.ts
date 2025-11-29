import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  producto: Types.ObjectId;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface IOrder extends Document {
  cliente: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  estado: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    nombreProducto: {
      type: String,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: [0, 'El precio unitario no puede ser negativo']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo']
    }
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    cliente: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El cliente es requerido']
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: 'Debe haber al menos un item en el pedido'
      }
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo']
    },
    estado: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending'
    },
    notas: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices para consultas frecuentes
orderSchema.index({ cliente: 1, createdAt: -1 });
orderSchema.index({ estado: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
