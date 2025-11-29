import mongoose from 'mongoose';
import { config } from './config';

/**
 * Conexión a MongoDB usando Mongoose (Patrón Singleton)
 * 
 * Mongoose mantiene internamente un pool de conexiones singleton.
 * Esta función inicializa la conexión única a MongoDB.
 * 
 * Según IEEE-1471-2000:
 * - Componente: DatabaseConnection
 * - Patrón: Singleton
 * - Responsabilidad: Gestionar conexión única a MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};
