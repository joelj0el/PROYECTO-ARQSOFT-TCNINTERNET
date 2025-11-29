import { IProduct } from '../product.model';
import { ClientSession } from 'mongoose';

/**
 * Interface para verificación y gestión de stock de productos
 * Expuesta según documento IEEE-1471 para ser consumida por OrderService
 */
export interface IStockVerifier {
  /**
   * Verifica si hay stock suficiente para un producto
   */
  verifyStock(productId: string, cantidad: number): Promise<boolean>;

  /**
   * Verifica stock para múltiples productos
   * Retorna lista de productos sin stock suficiente
   */
  verifyMultipleStock(items: Array<{ producto: string; cantidad: number }>): Promise<{
    isAvailable: boolean;
    unavailableProducts: string[];
  }>;

  /**
   * Reduce el stock de un producto
   * Soporta transacciones de MongoDB
   */
  reduceStock(productId: string, cantidad: number, session?: ClientSession): Promise<void>;

  /**
   * Restaura el stock de un producto (usado en cancelaciones)
   */
  restoreStock(productId: string, cantidad: number): Promise<void>;

  /**
   * Verifica si un producto tiene stock bajo
   */
  checkLowStock(productId: string): Promise<boolean>;

  /**
   * Obtiene todos los productos con stock bajo
   */
  getLowStockProducts(): Promise<IProduct[]>;
}
