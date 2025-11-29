import mongoose from 'mongoose';
import { config } from '../config/config';
import { Product } from '../../modules/products/product.model';

/**
 * Script de migración: Añadir campos de stock a productos existentes
 * 
 * Este script actualiza todos los productos que no tienen los campos
 * stock y stockMinimo, estableciendo valores por defecto:
 * - stock: 50
 * - stockMinimo: 10
 */

const migrateAddStock = async (): Promise<void> => {
  try {
    console.log('🔄 Iniciando migración de stock...');

    // Conectar a MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Conectado a MongoDB');

    // Actualizar productos sin campo stock
    const result = await Product.updateMany(
      { stock: { $exists: false } },
      {
        $set: {
          stock: 50,
          stockMinimo: 10
        }
      }
    );

    console.log(`✅ Migración completada: ${result.modifiedCount} productos actualizados`);

    // Mostrar productos actualizados
    const updatedProducts = await Product.find({
      stock: { $exists: true }
    }).select('nombre stock stockMinimo disponible');

    console.log('\n📦 Productos con stock:');
    updatedProducts.forEach((product) => {
      console.log(
        `- ${product.nombre}: stock=${product.stock}, stockMinimo=${product.stockMinimo}, disponible=${product.disponible}`
      );
    });

    console.log('\n✅ Migración finalizada correctamente');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

// Ejecutar migración
migrateAddStock();
