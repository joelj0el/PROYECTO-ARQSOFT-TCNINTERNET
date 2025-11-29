import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  nombre: string;
  email: string;
  password: string;
  rol: 'cliente' | 'admin';
  telefono?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    rol: {
      type: String,
      enum: ['cliente', 'admin'],
      default: 'cliente'
    },
    telefono: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Nota: ya existe un índice único en email por unique: true; evitar índices duplicados

export const User = mongoose.model<IUser>('User', userSchema);
