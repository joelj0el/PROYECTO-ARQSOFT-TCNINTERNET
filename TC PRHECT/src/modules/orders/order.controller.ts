import { Request, Response, NextFunction } from 'express';
import { orderService } from './order.service';

/**
 * Controlador de Órdenes (Patrón MVC - Capa de Presentación)
 * Delega toda la lógica de negocio al OrderService
 */
class OrderController {
  /**
   * Crear nueva orden (Cliente)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items, notas } = req.body;
      const clienteId = req.userId!;

      const order = await orderService.create(clienteId, { items, notas });

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todas las órdenes (Admin)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { estado } = req.query;

      const orders = await orderService.findAll({
        estado: estado as any
      });

      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener mis órdenes (Cliente)
   */
  async getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clienteId = req.userId!;
      const orders = await orderService.findAll({ clienteId });
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener orden por ID
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const order = await orderService.findById(id);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar estado de orden (Admin)
   */
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const order = await orderService.updateStatus(id, estado);

      res.json({
        success: true,
        message: 'Estado actualizado correctamente',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancelar orden
   */
  async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const order = await orderService.cancelOrder(id);

      res.json({
        success: true,
        message: 'Orden cancelada correctamente',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar orden (Admin, solo cancelled)
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await orderService.delete(id);
      res.json({ success: true, message: 'Orden eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
