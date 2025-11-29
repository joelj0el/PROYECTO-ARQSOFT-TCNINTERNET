import { Product, IProduct } from './product.model';
import { IStockVerifier } from './interfaces/stock-verifier.interface';
import { AppError } from '../../shared/errors/app-error';
import { ClientSession } from 'mongoose';

/**
 * Servicio de Productos - Capa de Lógica de Negocio
 * Implementa IStockVerifier según arquitectura IEEE-1471
 */
export class ProductService implements IStockVerifier {
  // ==================== CRUD BÁSICO ====================

  async findAll(filters?: {
    categoria?: string;
    disponible?: boolean;
    search?: string;
  }): Promise<IProduct[]> {
    const query: any = {};

    if (filters?.categoria) {
      query.categoria = filters.categoria;
    }

    if (filters?.disponible !== undefined) {
      query.disponible = filters.disponible;
    }

    if (filters?.search) {
      query.$or = [
        { nombre: { $regex: filters.search, $options: 'i' } },
        { descripcion: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return Product.find(query).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    return product;
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(data);
    await product.save();
    return product;
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    return product;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      throw new AppError('Producto no encontrado', 404);
    }
    return true;
  }

  // ==================== IMPLEMENTACIÓN DE IStockVerifier ====================

  async verifyStock(productId: string, cantidad: number): Promise<boolean> {
    const product = await Product.findById(productId);
    if (!product) {
      return false;
    }
    return product.disponible && product.stock >= cantidad;
  }

  async verifyMultipleStock(
    items: Array<{ producto: string; cantidad: number }>
  ): Promise<{ isAvailable: boolean; unavailableProducts: string[] }> {
    const unavailableProducts: string[] = [];

    for (const item of items) {
      const available = await this.verifyStock(item.producto, item.cantidad);
      if (!available) {
        const product = await Product.findById(item.producto);
        unavailableProducts.push(
          product?.nombre || item.producto
        );
      }
    }

    return {
      isAvailable: unavailableProducts.length === 0,
      unavailableProducts
    };
  }

  async reduceStock(
    productId: string,
    cantidad: number,
    session?: ClientSession
  ): Promise<void> {
    const options = session ? { session } : {};
    
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -cantidad } },
      { ...options, new: true }
    );

    if (!product) {
      throw new AppError('Producto no encontrado al reducir stock', 404);
    }

    // Si el stock llega a 0, marcar como no disponible
    if (product.stock === 0) {
      product.disponible = false;
      await product.save(options);
    }
  }

  async restoreStock(
    productId: string,
    cantidad: number,
    session?: ClientSession
  ): Promise<void> {
    const options = session ? { session } : {};
    
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: cantidad } },
      { ...options, new: true }
    );

    if (!product) {
      throw new AppError('Producto no encontrado al restaurar stock', 404);
    }

    // Si el stock vuelve a estar disponible, marcar como disponible
    if (product.stock > 0 && !product.disponible) {
      product.disponible = true;
      await product.save(options);
    }
  }

  async checkLowStock(productId: string): Promise<boolean> {
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    return product.stock <= product.stockMinimo;
  }

  async getLowStockProducts(): Promise<IProduct[]> {
    // Buscar productos donde stock <= stockMinimo
    return Product.find({
      $expr: { $lte: ['$stock', '$stockMinimo'] }
    }).sort({ stock: 1 });
  }
}

// Exportar instancia singleton del servicio
export const productService = new ProductService();
