import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { productService } from './product.service';

/**
 * Controlador de Productos - Capa de Presentación
 * Solo orquesta peticiones, toda la lógica está en ProductService
 */
export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        categoria: req.query.categoria as string,
        disponible: req.query.disponible === 'true' ? true : req.query.disponible === 'false' ? false : undefined,
        search: req.query.search as string
      };

      const products = await productService.findAll(filters);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const product = await productService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const product = await productService.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await productService.getLowStockProducts();
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
