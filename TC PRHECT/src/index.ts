import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './shared/config/config';
import { connectDB } from './shared/config/database';
import { swaggerSpec } from './shared/config/swagger';
import { errorHandler } from './shared/middlewares/error-handler.middleware';

// Importar rutas modulares
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import productRoutes from './modules/products/product.routes';
import orderRoutes from './modules/orders/order.routes';
import feedbackRoutes from './modules/feedback/feedback.routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📚 Swagger UI - Documentación interactiva
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SNACKSOFT API Docs'
}));

// Ruta de bienvenida
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🎓 API - Plataforma de Servicio y Calidad Total',
    version: '1.0.0',
    documentation: '📚 http://localhost:' + config.port + '/api-docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      feedback: '/api/feedback'
    }
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);

// Ruta 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Iniciar servidor
    app.listen(config.port, '0.0.0.0', () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${config.port}`);
      console.log(`🌐 URL Local: http://localhost:${config.port}`);
      console.log(`🌐 URL Red: Usa 'ipconfig' para ver tu IP local`);
      console.log(`📚 Documentación Swagger: http://localhost:${config.port}/api-docs`);
      console.log(`📚 Entorno: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
