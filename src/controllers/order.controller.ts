import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

/**
 * Obtener todas las órdenes
 * GET /api/orders
 * - Cliente: solo sus propias órdenes
 * - Admin: todas las órdenes
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado } = req.query;
    
    // Construir filtro según rol
    const filter: any = {};
    
    // Si es cliente, solo puede ver sus propias órdenes
    if (req.userRole === 'cliente') {
      filter.cliente = req.userId;
    }
    
    // Filtrar por estado si se proporciona
    if (estado) {
      filter.estado = estado;
    }

    const orders = await Order.find(filter)
      .populate('cliente', 'nombre email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes'
    });
  }
};

/**
 * Obtener una orden por ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('cliente', 'nombre email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
      return;
    }

    // Verificar que el cliente solo pueda ver sus propias órdenes
    if (req.userRole === 'cliente' && order.cliente._id.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta orden'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener orden'
    });
  }
};

/**
 * Crear una nueva orden
 * POST /api/orders
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar errores de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { items, notas } = req.body;

    // Validar que haya items
    if (!items || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Debe incluir al menos un producto en la orden'
      });
      return;
    }

    // Procesar items y calcular total
    const processedItems = [];
    let total = 0;

    for (const item of items) {
      // Buscar producto
      const product = await Product.findById(item.producto);

      if (!product) {
        res.status(404).json({
          success: false,
          message: `Producto con ID ${item.producto} no encontrado`
        });
        return;
      }

      if (!product.disponible) {
        res.status(400).json({
          success: false,
          message: `El producto "${product.nombre}" no está disponible`
        });
        return;
      }

      const subtotal = product.precio * item.cantidad;
      total += subtotal;

      processedItems.push({
        producto: product._id,
        nombreProducto: product.nombre,
        cantidad: item.cantidad,
        precioUnitario: product.precio,
        subtotal
      });
    }

    // Crear la orden
    const order = new Order({
      cliente: req.userId,
      items: processedItems,
      total,
      notas,
      estado: 'pending'
    });

    await order.save();

    // Poblar información del cliente
    await order.populate('cliente', 'nombre email');

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: order
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear orden'
    });
  }
};

/**
 * Actualizar el estado de una orden (solo admin)
 * PUT /api/orders/:id/status
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar errores de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const { estado } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    ).populate('cliente', 'nombre email');

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Estado de orden actualizado a: ${estado}`,
      data: order
    });
  } catch (error) {
    console.error('Error al actualizar estado de orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado de orden'
    });
  }
};
