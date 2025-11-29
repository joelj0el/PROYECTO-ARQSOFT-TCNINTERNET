# 🎓 Plataforma de Servicio y Calidad Total - Backend API

Backend API REST para la optimización del servicio de alimentación universitaria mediante gestión de pedidos en línea y sistema de feedback en tiempo real.

## 📋 Descripción del Proyecto

Sistema Full-Stack que resuelve dos problemas principales en servicios de alimentación universitarios:
1. **Logística y Eficiencia (Pre-Order)**: Sistema de pedidos en línea que minimiza tiempos de espera
2. **Calidad y Experiencia (Feedback)**: Mecanismo de recolección de feedback en tiempo real con alertas proactivas

## 🛠️ Tecnologías Utilizadas

- **Runtime**: Node.js v18+
- **Lenguaje**: TypeScript
- **Framework**: Express.js
- **Base de Datos**: MongoDB
- **ODM**: Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: bcryptjs para encriptación de contraseñas
- **Validación**: express-validator

## 📁 Estructura del Proyecto

```
src/
├── config/              # Configuración general
│   ├── config.ts        # Variables de entorno
│   └── database.ts      # Conexión a MongoDB
├── models/              # Modelos de Mongoose
│   ├── User.ts          # Modelo de usuarios
│   ├── Product.ts       # Modelo de productos (menú)
│   ├── Order.ts         # Modelo de órdenes/pedidos
│   └── Feedback.ts      # Modelo de evaluaciones
├── controllers/         # Lógica de negocio
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   ├── order.controller.ts
│   └── feedback.controller.ts
├── routes/              # Definición de rutas
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── order.routes.ts
│   └── feedback.routes.ts
├── middlewares/         # Middlewares personalizados
│   ├── auth.middleware.ts   # Autenticación JWT
│   └── admin.middleware.ts  # Autorización admin
└── index.ts            # Punto de entrada
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio (o descomprimir el ZIP)

```bash
cd TC\ PRHECT
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/plataforma_calidad_total
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion
JWT_EXPIRES_IN=86400
NODE_ENV=development
```

### 4. Asegurar que MongoDB esté ejecutándose

**Opción A: MongoDB local**
```bash
# Windows (si MongoDB está instalado)
net start MongoDB

# Linux/Mac
sudo service mongod start
```

**Opción B: MongoDB Atlas (Cloud)**
- Crear cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crear un cluster
- Obtener el connection string y reemplazar en `MONGODB_URI`

### 5. Ejecutar el servidor

**Modo desarrollo (con hot-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm run build
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Endpoints de la API

### 🔐 Autenticación y Usuarios

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "123456",
  "rol": "cliente",
  "telefono": "0999999999"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "64abc123...",
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol": "cliente"
  }
}
```

#### Iniciar Sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64abc123...",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "rol": "cliente"
    }
  }
}
```

#### Listar Usuarios (Solo Admin)
```http
GET /api/users
Authorization: Bearer {token}
```

### 🍔 Productos (Menú)

#### Obtener Productos
```http
GET /api/products
GET /api/products?categoria=comida
GET /api/products?disponible=true
```

#### Obtener Producto por ID
```http
GET /api/products/:id
```

#### Crear Producto (Solo Admin)
```http
POST /api/products
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "nombre": "Hamburguesa Clásica",
  "descripcion": "Hamburguesa con carne, queso, lechuga y tomate",
  "precio": 5.50,
  "categoria": "comida",
  "disponible": true,
  "imagen": "https://ejemplo.com/imagen.jpg"
}
```

#### Actualizar Producto (Solo Admin)
```http
PUT /api/products/:id
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "precio": 6.00,
  "disponible": false
}
```

#### Eliminar Producto (Solo Admin)
```http
DELETE /api/products/:id
Authorization: Bearer {token_admin}
```

### 🛒 Pedidos/Órdenes

#### Obtener Órdenes
```http
GET /api/orders
Authorization: Bearer {token}
```
- **Cliente**: Ve solo sus propias órdenes
- **Admin**: Ve todas las órdenes

#### Obtener Orden por ID
```http
GET /api/orders/:id
Authorization: Bearer {token}
```

#### Crear Orden
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "producto": "64abc123...",
      "cantidad": 2
    },
    {
      "producto": "64abc456...",
      "cantidad": 1
    }
  ],
  "notas": "Sin cebolla, por favor"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "_id": "64def789...",
    "cliente": {
      "_id": "64abc123...",
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com"
    },
    "items": [
      {
        "producto": "64abc123...",
        "nombreProducto": "Hamburguesa Clásica",
        "cantidad": 2,
        "precioUnitario": 5.50,
        "subtotal": 11.00
      }
    ],
    "total": 11.00,
    "estado": "pending",
    "notas": "Sin cebolla, por favor",
    "createdAt": "2025-10-21T..."
  }
}
```

#### Actualizar Estado de Orden (Solo Admin)
```http
PUT /api/orders/:id/status
Authorization: Bearer {token_admin}
Content-Type: application/json

{
  "estado": "preparing"
}
```

**Estados válidos:**
- `pending` - Pendiente
- `preparing` - En preparación
- `ready` - Listo para recoger
- `completed` - Completado
- `cancelled` - Cancelado

### ⭐ Feedback (Evaluaciones)

#### Obtener Feedbacks
```http
GET /api/feedback
Authorization: Bearer {token}
```
- **Cliente**: Ve solo sus propios feedbacks
- **Admin**: Ve todos los feedbacks

#### Crear Feedback
```http
POST /api/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "orden": "64def789...",
  "calificacion": 5,
  "comentario": "Excelente servicio y comida deliciosa",
  "aspectos": {
    "calidadComida": 5,
    "tiempoEspera": 4,
    "atencion": 5
  }
}
```

**Restricciones:**
- Solo se puede dar feedback a órdenes con estado `completed`
- Solo el cliente que hizo la orden puede dar feedback
- Una orden solo puede tener un feedback (no editable)

#### Obtener Estadísticas de Feedback (Solo Admin)
```http
GET /api/feedback/stats
Authorization: Bearer {token_admin}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "promedioGeneral": 4.32,
    "promedioAspectos": {
      "calidadComida": 4.51,
      "tiempoEspera": 4.02,
      "atencion": 4.43
    },
    "distribucion": {
      "5": 28,
      "4": 12,
      "3": 3,
      "2": 1,
      "1": 1
    },
    "alertasCalidad": 2,
    "porcentajeAlertas": 4.44
  }
}
```

## 🔑 Autenticación

Todos los endpoints protegidos requieren un token JWT en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles de Usuario

1. **cliente** (por defecto)
   - Crear pedidos
   - Ver sus propias órdenes
   - Crear feedback en sus órdenes completadas
   - Ver sus propios feedbacks

2. **admin**
   - Todos los permisos de cliente
   - CRUD completo de productos
   - Ver todas las órdenes
   - Actualizar estado de órdenes
   - Ver todos los feedbacks
   - Ver estadísticas de feedback

## 🧪 Pruebas con Postman

Se incluye una colección de Postman con todas las pruebas realizadas. Ver carpeta `postman/` o capturas en `docs/postman-screenshots/`.

### Flujo de Prueba Recomendado:

1. **Registrar un usuario admin**
   ```json
   POST /api/auth/register
   { "email": "admin@snack.com", "password": "admin123", "rol": "admin", "nombre": "Admin Snack" }
   ```

2. **Registrar un cliente**
   ```json
   POST /api/auth/register
   { "email": "cliente@univ.edu", "password": "123456", "rol": "cliente", "nombre": "Estudiante Test" }
   ```

3. **Login como admin** y guardar el token

4. **Crear productos** (con token de admin)

5. **Login como cliente** y guardar el token

6. **Crear una orden** (con token de cliente)

7. **Actualizar estado de orden** a "completed" (con token de admin)

8. **Crear feedback** para la orden completada (con token de cliente)

9. **Ver estadísticas** (con token de admin)

## 📊 Modelos de Datos

### User
```typescript
{
  nombre: string;
  email: string (único);
  password: string (encriptado);
  rol: 'cliente' | 'admin';
  telefono?: string;
}
```

### Product
```typescript
{
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'bebida' | 'comida' | 'snack' | 'postre' | 'otro';
  disponible: boolean;
  imagen?: string;
}
```

### Order
```typescript
{
  cliente: ObjectId (ref: User);
  items: [{
    producto: ObjectId (ref: Product);
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }];
  total: number;
  estado: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notas?: string;
}
```

### Feedback
```typescript
{
  orden: ObjectId (ref: Order, único);
  cliente: ObjectId (ref: User);
  calificacion: number (1-5);
  comentario?: string;
  aspectos: {
    calidadComida: number (1-5);
    tiempoEspera: number (1-5);
    atencion: number (1-5);
  };
}
```

## 🔒 Seguridad Implementada

- ✅ Encriptación de contraseñas con bcryptjs
- ✅ Tokens JWT con expiración configurable
- ✅ Validación de datos con express-validator
- ✅ Protección de rutas mediante middleware de autenticación
- ✅ Autorización por roles (cliente/admin)
- ✅ Variables de entorno para información sensible

## 🐛 Solución de Problemas

### MongoDB no conecta
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solución**: Verificar que MongoDB esté ejecutándose
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo service mongod start
```

### Token inválido
```
{ "success": false, "message": "Token inválido o expirado" }
```
**Solución**: Volver a hacer login para obtener un nuevo token

### Error de validación
```
{ "success": false, "errors": [...] }
```
**Solución**: Revisar que todos los campos requeridos estén presentes y sean válidos

## 👨‍💻 Autor

Proyecto desarrollado para la asignatura de **Tecnologías en Internet** por:
**JHOEL TITIRICO CHARCA**

## 📄 Licencia

ISC

---

**Nota**: Este es un proyecto académico desarrollado con fines educativos.
