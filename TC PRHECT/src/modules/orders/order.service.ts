import mongoose, { Types } from 'mongoose';
import { Order, IOrder, IOrderItem } from './order.model';
import { Product } from '../products/product.model';
import { productService } from '../products/product.service';
import { AppError } from '../../shared/errors/app-error';

/**
 * Servicio de gestión de órdenes (Patrón Service Layer)
 * 
 * Según IEEE-1471-2000:
 * - Componente: S_GestionOrdenes
 * - Usa: ProductService (mediante IStockVerifier)
 * - Responsabilidad: Gestionar órdenes con control de stock
 */
class OrderService {
  /**
   * Crear nueva orden con verificación de stock
   */
  async create(
    clienteId: string,
    orderData: {
      items: Array<{ productoId: string; cantidad: number }>;
      notas?: string;
    }
  ): Promise<IOrder> {
    // Validar que haya items
    if (!orderData.items || orderData.items.length === 0) {
      throw new AppError('Debe incluir al menos un producto en la orden', 400);
    }

    // Verificar IDs válidos
    for (const item of orderData.items) {
      if (!Types.ObjectId.isValid(item.productoId)) {
        throw new AppError(`ID de producto inválido: ${item.productoId}`, 400);
      }
    }

    // Verificar disponibilidad de stock para todos los productos
    const stockVerification = await productService.verifyMultipleStock(
      orderData.items.map((item) => ({
        producto: item.productoId,
        cantidad: item.cantidad
      }))
    );

    if (!stockVerification.isAvailable) {
      const unavailableList = stockVerification.unavailableProducts
        .map((productId) => `- Producto ID: ${productId}`)
        .join('\n');

      throw new AppError(
        `Los siguientes productos no tienen stock suficiente:\n${unavailableList}`,
        400
      );
    }

    try {
      // Obtener información completa de los productos
      const productIds = orderData.items.map((item) => item.productoId);
      const products = await Product.find({ _id: { $in: productIds } });

      // Crear items de la orden con información completa
      const orderItems: IOrderItem[] = orderData.items.map((item) => {
        const product = products.find(
          (p) => (p._id as any).toString() === item.productoId
        );

        if (!product) {
          throw new AppError(`Producto no encontrado: ${item.productoId}`, 404);
        }

        const subtotal = product.precio * item.cantidad;

        return {
          producto: new Types.ObjectId(item.productoId),
          nombreProducto: product.nombre,
          cantidad: item.cantidad,
          precioUnitario: product.precio,
          subtotal
        };
      });

      // Calcular total
      const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

      // Crear la orden
      const order = await Order.create({
        cliente: clienteId,
        items: orderItems,
        total,
        notas: orderData.notas,
        estado: 'pending'
      });

      // Reducir stock de los productos
      for (const item of orderData.items) {
        await productService.reduceStock(
          item.productoId,
          item.cantidad
        );
      }

      // Retornar orden creada
      const createdOrder = await Order.findById(order._id)
        .populate('cliente', 'nombre email telefono')
        .populate('items.producto', 'nombre descripcion categoria');
      
      if (!createdOrder) {
        throw new AppError('Error al recuperar la orden creada', 500);
      }
      
      return createdOrder;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todas las órdenes con filtros
   */
  async findAll(filters?: {
    clienteId?: string;
    estado?: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  }): Promise<IOrder[]> {
    const query: any = {};

    if (filters?.clienteId) {
      query.cliente = filters.clienteId;
    }

    if (filters?.estado) {
      query.estado = filters.estado;
    }

    return await Order.find(query)
      .populate('cliente', 'nombre email telefono')
      .populate('items.producto', 'nombre descripcion categoria')
      .sort({ createdAt: -1 });
  }

  /**
   * Obtener orden por ID
   */
  async findById(orderId: string): Promise<IOrder> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new AppError('ID de orden inválido', 400);
    }

    const order = await Order.findById(orderId)
      .populate('cliente', 'nombre email telefono')
      .populate('items.producto', 'nombre descripcion categoria');

    if (!order) {
      throw new AppError('Orden no encontrada', 404);
    }

    return order;
  }

  /**
   * Actualizar estado de la orden
   */
  async updateStatus(
    orderId: string,
    newStatus: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  ): Promise<IOrder> {
    const order = await this.findById(orderId);

    // Validar transición de estado
    if (order.estado === 'completed' || order.estado === 'cancelled') {
      throw new AppError(
        `No se puede modificar una orden con estado ${order.estado}`,
        400
      );
    }

    order.estado = newStatus;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('cliente', 'nombre email telefono')
      .populate('items.producto', 'nombre descripcion categoria');
    
    if (!updatedOrder) {
      throw new AppError('Error al recuperar la orden actualizada', 500);
    }
    
    return updatedOrder;
  }

  /**
   * Cancelar orden (solo si está en pending o preparing)
   * Restaura el stock de los productos
   */
  async cancelOrder(orderId: string): Promise<IOrder> {
    const order = await this.findById(orderId);

    // Validar que se puede cancelar
    if (order.estado !== 'pending' && order.estado !== 'preparing') {
      throw new AppError(
        `No se puede cancelar una orden con estado ${order.estado}`,
        400
      );
    }

    // Iniciar transacción para cancelación
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Actualizar estado a cancelado
      order.estado = 'cancelled';
      await order.save({ session });

      // Restaurar stock de todos los productos
      for (const item of order.items) {
        await productService.restoreStock(
          item.producto.toString(),
          item.cantidad,
          session
        );
      }

      await session.commitTransaction();

      const cancelledOrder = await Order.findById(orderId)
        .populate('cliente', 'nombre email telefono')
        .populate('items.producto', 'nombre descripcion categoria');
      
      if (!cancelledOrder) {
        throw new AppError('Error al recuperar la orden cancelada', 500);
      }
      
      return cancelledOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Eliminar orden (solo admin, solo si está cancelled)
   */
  async delete(orderId: string): Promise<void> {
    const order = await this.findById(orderId);

    if (order.estado !== 'cancelled') {
      throw new AppError(
        'Solo se pueden eliminar órdenes canceladas',
        400
      );
    }

    await Order.findByIdAndDelete(orderId);
  }
}

export const orderService = new OrderService();
