import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './config';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Plataforma de Servicio y Calidad Total - SNACKSOFT',
      version: '1.0.0',
      description: `
        API RESTful para gestión de pedidos y retroalimentación en tiempo real 
        de una plataforma de servicio de alimentos universitaria.
        
        ## Características
        - 🔐 Autenticación JWT
        - 👥 Roles de usuario (Cliente y Admin)
        - 🍕 Gestión de productos del menú
        - 📦 Sistema de órdenes con estados
        - ⭐ Sistema de retroalimentación por orden
        
        ## Autenticación
        La mayoría de los endpoints requieren autenticación JWT. 
        1. Registra un usuario en /api/auth/register
        2. Inicia sesión en /api/auth/login para obtener el token
        3. Usa el token en el header: Authorization: Bearer {token}
      `,
      contact: {
        name: 'SNACKSOFT',
        email: 'soporte@snacksoft.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Servidor de Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del login'
        }
      },
      schemas: {
        // Schema de Usuario
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', format: 'email', example: 'juan@example.com' },
            rol: { type: 'string', enum: ['cliente', 'admin'], example: 'cliente' },
            telefono: { type: 'string', example: '3001234567' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schema de Producto
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Hamburguesa Clásica' },
            descripcion: { type: 'string', example: 'Hamburguesa con queso y vegetales' },
            precio: { type: 'number', format: 'float', example: 15000 },
            categoria: { 
              type: 'string', 
              enum: ['bebida', 'comida', 'snack', 'postre', 'otro'],
              example: 'comida'
            },
            disponible: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schema de Item de Orden
        OrderItem: {
          type: 'object',
          properties: {
            producto: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombreProducto: { type: 'string', example: 'Hamburguesa Clásica' },
            cantidad: { type: 'integer', minimum: 1, example: 2 },
            precioUnitario: { type: 'number', format: 'float', example: 15000 },
            subtotal: { type: 'number', format: 'float', example: 30000 }
          }
        },
        
        // Schema de Orden
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            cliente: { type: 'string', example: '507f1f77bcf86cd799439012' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' }
            },
            total: { type: 'number', format: 'float', example: 30000 },
            estado: {
              type: 'string',
              enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
              example: 'pending'
            },
            notas: { type: 'string', example: 'Sin cebolla por favor' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        
        // Schema de Feedback
        Feedback: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            orden: { type: 'string', example: '507f1f77bcf86cd799439012' },
            cliente: { type: 'string', example: '507f1f77bcf86cd799439013' },
            calificacion: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comentario: { type: 'string', example: 'Excelente servicio y comida deliciosa' },
            aspectos: {
              type: 'object',
              properties: {
                calidadComida: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                tiempoEspera: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
                atencion: { type: 'integer', minimum: 1, maximum: 5, example: 5 }
              }
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        
        // Respuestas comunes
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operación exitosa' },
            data: { type: 'object' }
          }
        },
        
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error en la operación' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints para registro y login de usuarios'
      },
      {
        name: 'Usuarios',
        description: 'Gestión de usuarios (solo admin)'
      },
      {
        name: 'Productos',
        description: 'Gestión del menú de productos'
      },
      {
        name: 'Órdenes',
        description: 'Gestión de pedidos de clientes'
      },
      {
        name: 'Feedback',
        description: 'Sistema de retroalimentación y calificaciones'
      }
    ]
  },
  apis: ['./src/routes/*.ts'] // Archivos donde buscar anotaciones
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
