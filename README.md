# 🎓 SNACKSOFT - Sistema de Gestión Universitaria UAB

![Node.js](https://img.shields.io/badge/Node.js-20.12.1-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)

Sistema Full-Stack de gestión de pedidos en línea y análisis de feedback para servicios de alimentación para la Universidad Adventista de Bolivia, desarrollado con patron arquitectónico MODULAR POR CAPAS.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura y Tecnologías](#️-arquitectura-y-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Ejecución Local](#-ejecución-local)
- [Variables de Entorno](#-variables-de-entorno)
- [API Endpoints](#-api-endpoints)
- [Seguridad](#-seguridad)
- [Patrones de Diseño](#-patrones-de-diseño)
- [Testing](#-testing)
- [Despliegue en Red Local](#-despliegue-en-red-local)
- [Documentación API](#-documentación-api)
- [Autores](#-autores)

---

## 📖 Descripción del Proyecto

**SNACKSOFT** es una plataforma web integral que digitaliza y optimiza el servicio de cafetería universitaria mediante:

1. **Sistema de Pedidos en Línea (Pre-Order)**: Reduce tiempos de espera y mejora la logística operativa
2. **Sistema de Feedback Inteligente**: Análisis en tiempo real de satisfacción del cliente con alertas automáticas usando el patrón Strategy

### Problemática Resuelta

- ❌ **Antes**: Largas filas, tiempos de espera prolongados, feedback no estructurado
- ✅ **Ahora**: Pedidos anticipados, gestión eficiente de stock, análisis predictivo de calidad

---

## ✨ Características Principales

### Para Clientes
- 🛒 Catálogo de productos con filtros por categoría
- 🛍️ Carrito de compras persistente (localStorage)
- 📦 Historial de órdenes
- ⭐ Sistema de calificación y feedback por orden
- 👤 Gestión de perfil de usuario

### Para Administradores
- 📊 Panel de administración completo
- 🍔 CRUD de productos (con gestión de stock)
- 📋 Gestión de órdenes (cambio de estados)
- 👥 Administración de usuarios
- 📈 Visualización de feedback con análisis de riesgo
- ⚠️ Alertas automáticas de calidad baja

### Técnicas
- 🔐 Autenticación JWT (JSON Web Token)
- 🔒 Hash de contraseñas con bcrypt (10 salt rounds)
- ✅ Validación de datos con express-validator
- 🎯 Análisis de riesgo con 3 estrategias (Strategy Pattern)
- 📡 API REST completamente documentada con Swagger
- 🌐 Soporte para acceso en red local

---

## 🏗️ Arquitectura y Tecnologías

### Stack Tecnológico

#### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 20.12.1 | Runtime JavaScript |
| **Express** | 4.18.2 | Framework web REST API |
| **TypeScript** | 5.9.3 | Tipado estático |
| **MongoDB** | Latest | Base de datos NoSQL |
| **Mongoose** | 8.2.0 | ODM (Object-Document Mapping) |
| **bcryptjs** | 2.4.3 | Hash de contraseñas |
| **jsonwebtoken** | 9.0.2 | Autenticación JWT |
| **express-validator** | 7.0.1 | Validación de datos |
| **cors** | 2.8.5 | Manejo de peticiones cross-origin |
| **swagger** | 6.2.8 / 5.0.1 | Documentación API interactiva |

#### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Biblioteca UI |
| **Vite** | 7.2.4 | Build tool y dev server |
| **TypeScript** | 5.9.3 | Tipado estático |
| **React Router DOM** | 7.9.6 | Enrutamiento SPA |
| **Axios** | 1.13.2 | Cliente HTTP |
| **Lucide React** | 0.555.0 | Iconos |

### Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador)                      │
│  React SPA (http://IP:5173)                                 │
│  ├─ Components (UI)                                         │
│  ├─ Context API (Estado global: Auth, Cart)                │
│  ├─ React Router (Navegación)                              │
│  └─ Axios (Cliente HTTP)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP REST (JSON)
                     │ Authorization: Bearer <JWT>
┌────────────────────▼────────────────────────────────────────┐
│                SERVIDOR EXPRESS (http://IP:3000)             │
│  ├─ Middlewares: CORS → JSON → Auth → Admin → Routes       │
│  ├─ Routes: /api/auth, /api/users, /api/products,          │
│  │           /api/orders, /api/feedback                     │
│  ├─ Controllers (Manejo de peticiones HTTP)                │
│  ├─ Services (Lógica de negocio)                           │
│  │   └─ Strategies (Análisis de riesgo: 3 algoritmos)     │
│  └─ Models (Esquemas Mongoose)                             │
└────────────────────┬────────────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────────────────┐
│                  MongoDB (Base de Datos)                     │
│  Database: SNACKSOFT                                         │
│  Collections: users, products, orders, feedbacks            │
└──────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
PROYECTO-ARQSOFT-TCNINTERNET/
│
├── TC PRHECT/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.ts                    # Punto de entrada del servidor
│   │   ├── modules/                    # Módulos funcionales
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts      # Rutas de autenticación
│   │   │   │   ├── auth.controller.ts  # Controlador HTTP
│   │   │   │   ├── auth.service.ts     # Lógica de negocio (bcrypt, JWT)
│   │   │   │   └── auth.model.ts       # Modelo Mongoose User
│   │   │   ├── products/
│   │   │   │   ├── product.routes.ts
│   │   │   │   ├── product.controller.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   └── product.model.ts
│   │   │   ├── orders/
│   │   │   │   ├── order.routes.ts
│   │   │   │   ├── order.controller.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   └── order.model.ts
│   │   │   ├── feedback/
│   │   │   │   ├── feedback.routes.ts
│   │   │   │   ├── feedback.controller.ts
│   │   │   │   ├── feedback.service.ts
│   │   │   │   ├── feedback.model.ts
│   │   │   │   └── strategies/         # Patrón Strategy
│   │   │   │       ├── risk-analyzer.strategy.ts
│   │   │   │       ├── score-based.strategy.ts
│   │   │   │       ├── keyword-analysis.strategy.ts
│   │   │   │       └── aspect-based.strategy.ts
│   │   │   └── users/
│   │   │       ├── users.routes.ts
│   │   │       ├── users.controller.ts
│   │   │       └── users.service.ts
│   │   └── shared/
│   │       ├── config/
│   │       │   ├── config.ts           # Variables de entorno
│   │       │   ├── database.ts         # Conexión MongoDB (Singleton)
│   │       │   └── swagger.ts          # Configuración Swagger
│   │       ├── middlewares/
│   │       │   ├── auth.middleware.ts  # Verificación JWT
│   │       │   ├── admin.middleware.ts # Verificación rol admin
│   │       │   └── error-handler.middleware.ts
│   │       ├── adapters/
│   │       │   └── email.adapter.ts    # Patrón Adapter (alertas)
│   │       ├── errors/
│   │       │   └── app-error.ts        # Manejo de errores
│   │       └── types/
│   │           └── response.types.ts
│   ├── tests/
│   │   └── postman/
│   │       ├── Postman_Collection.json
│   │       └── Local.postman_environment.json
│   ├── .env.example                    # Plantilla variables de entorno
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md                       # Documentación backend
│
├── TC PRHECT FRONT END/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.tsx                     # Componente raíz
│   │   ├── App.css                     # Estilos globales (UAB theme)
│   │   ├── main.tsx                    # Punto de entrada
│   │   ├── config/
│   │   │   └── api.ts                  # Configuración Axios + interceptores
│   │   ├── context/
│   │   │   ├── AuthContext.tsx         # Estado global autenticación
│   │   │   └── CartContext.tsx         # Estado global carrito
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useCart.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── FeedbackForm.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Admin.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── admin/
│   │   │       ├── AdminProducts.tsx
│   │   │       ├── AdminOrders.tsx
│   │   │       ├── AdminFeedback.tsx
│   │   │       └── AdminUsers.tsx
│   │   └── types/
│   │       └── index.ts                # Tipos TypeScript
│   ├── .env                            # Variables de entorno frontend
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── README.md                       # Documentación frontend
│
└── README.md                           # Este archivo (Principal)
```

---

## ✅ Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 (Recomendado: 20.12.1)
- **npm** >= 8.0.0
- **MongoDB** >= 6.0 (Local o MongoDB Atlas)
- **Git** >= 2.0.0

### Verificar Instalaciones

```bash
node --version    # Debe mostrar v18.x.x o superior
npm --version     # Debe mostrar 8.x.x o superior
mongo --version   # Debe mostrar 6.x.x o superior (si usas local)
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/joelj0el/PROYECTO-ARQSOFT-TCNINTERNET.git
cd PROYECTO-ARQSOFT-TCNINTERNET
```

### 2. Instalar Dependencias

#### Backend
```bash
cd "TC PRHECT"
npm install
```

#### Frontend
```bash
cd "../TC PRHECT FRONT END"
npm install
```

### 3. Configurar MongoDB

#### Opción A: MongoDB Local (Windows)

1. Descargar e instalar MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Iniciar el servicio:
```powershell
net start MongoDB
```

#### Opción B: MongoDB Atlas (Cloud - Recomendado)

1. Crear cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster (M0 Free Tier)
3. Configurar Network Access (permitir 0.0.0.0/0 para desarrollo)
4. Obtener la cadena de conexión
5. Actualizar `MONGODB_URI` en el archivo `.env` del backend

### 4. Configurar Variables de Entorno

#### Backend: `TC PRHECT/.env`

Copiar el archivo de ejemplo y editarlo:

```bash
cd "TC PRHECT"
copy .env.example .env
```

Editar `.env` con tus valores:

```env
# Puerto del servidor
PORT=3000

# MongoDB (usar tu connection string si usas Atlas)
MONGODB_URI=mongodb://localhost:27017/SNACKSOFT

# JWT Secret (CAMBIAR en producción por una clave segura)
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion

# Duración del token (en segundos) - 86400 = 24 horas
JWT_EXPIRES_IN=86400

# Entorno
NODE_ENV=development
```

#### Frontend: `TC PRHECT FRONT END/.env`

```env
# Para localhost (solo tu computadora):
VITE_API_URL=http://localhost:3000/api

# Para acceso en red local (otros dispositivos):
# VITE_API_URL=http://TU_IP_LOCAL:3000/api
# Ejemplo: VITE_API_URL=http://192.168.1.100:3000/api
```

**Nota**: Para obtener tu IP local en Windows:
```powershell
ipconfig | Select-String -Pattern "IPv4"
```

---

## 🎮 Ejecución Local

### Iniciar Backend

```bash
cd "TC PRHECT"
npm run dev
```

El servidor estará disponible en:
- 🌐 Local: `http://localhost:3000`
- 📚 Swagger Docs: `http://localhost:3000/api-docs`

### Iniciar Frontend

```bash
cd "TC PRHECT FRONT END"
npm run dev
```

La aplicación estará disponible en:
- 🌐 Local: `http://localhost:5173`

### Usuarios de Prueba

#### Administrador
```
Email: admin@uab.edu
Password: admin123
```

#### Cliente
```
Email: cliente@uab.edu
Password: cliente123
```

O regístrate como nuevo usuario (rol por defecto: cliente).

---

## 🔧 Variables de Entorno

### Backend (`TC PRHECT/.env`)

| Variable | Descripción | Valor por Defecto | Requerido |
|----------|-------------|-------------------|-----------|
| `PORT` | Puerto del servidor Express | `3000` | ❌ |
| `MONGODB_URI` | Cadena de conexión MongoDB | `mongodb://localhost:27017/SNACKSOFT` | ✅ |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | `default_secret_key_change_in_production` | ✅ |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (segundos) | `86400` (24 horas) | ❌ |
| `NODE_ENV` | Ambiente de ejecución | `development` | ❌ |

### Frontend (`TC PRHECT FRONT END/.env`)

| Variable | Descripción | Valor por Defecto | Requerido |
|----------|-------------|-------------------|-----------|
| `VITE_API_URL` | URL base de la API backend | `http://localhost:3000/api` | ✅ |

**⚠️ Importante**: Las variables del frontend deben tener el prefijo `VITE_` para ser expuestas al navegador.

---

## 📡 API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | ❌ Público |
| POST | `/api/auth/login` | Iniciar sesión (devuelve JWT) | ❌ Público |
| GET | `/api/auth/profile` | Obtener perfil del usuario autenticado | 🔒 JWT |

### Usuarios (`/api/users`) - Solo Admin

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Listar todos los usuarios (filtro por rol) | 🔒👑 JWT + Admin |
| GET | `/api/users/:id` | Obtener usuario por ID | 🔒👑 JWT + Admin |
| PUT | `/api/users/:id` | Actualizar usuario | 🔒👑 JWT + Admin |
| DELETE | `/api/users/:id` | Eliminar usuario | 🔒👑 JWT + Admin |

### Productos (`/api/products`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Listar productos (filtros: categoría, disponibilidad) | ❌ Público |
| GET | `/api/products/low-stock` | Productos con stock bajo | 🔒👑 JWT + Admin |
| GET | `/api/products/:id` | Obtener producto por ID | ❌ Público |
| POST | `/api/products` | Crear nuevo producto | 🔒👑 JWT + Admin |
| PUT | `/api/products/:id` | Actualizar producto | 🔒👑 JWT + Admin |
| DELETE | `/api/products/:id` | Eliminar producto | 🔒👑 JWT + Admin |

### Órdenes (`/api/orders`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Crear nueva orden | 🔒 JWT |
| GET | `/api/orders` | Listar todas las órdenes | 🔒👑 JWT + Admin |
| GET | `/api/orders/my-orders` | Mis órdenes | 🔒 JWT |
| GET | `/api/orders/:id` | Obtener orden por ID | 🔒 JWT |
| PATCH | `/api/orders/:id/status` | Actualizar estado de orden | 🔒👑 JWT + Admin |
| DELETE | `/api/orders/:id` | Eliminar orden | 🔒👑 JWT + Admin |

### Feedback (`/api/feedback`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/feedback` | Crear feedback (análisis automático) | 🔒 JWT |
| GET | `/api/feedback` | Listar todo el feedback | 🔒👑 JWT + Admin |
| GET | `/api/feedback/my-feedbacks` | Mi feedback | 🔒 JWT |
| GET | `/api/feedback/statistics` | Estadísticas de feedback | 🔒👑 JWT + Admin |
| GET | `/api/feedback/order/:ordenId` | Feedback de una orden | 🔒 JWT |
| GET | `/api/feedback/:id` | Obtener feedback por ID | 🔒 JWT |

**Leyenda**:
- ❌ Público: No requiere autenticación
- 🔒 JWT: Requiere token de autenticación
- 🔒👑 JWT + Admin: Requiere token + rol de administrador

---

## 🔐 Seguridad

### Autenticación JWT (JSON Web Token)

El sistema utiliza JWT para autenticación stateless:

1. **Login**: Usuario envía credenciales → Backend valida → Genera JWT
2. **Token**: Contiene `{ userId, rol, exp }` firmado con `JWT_SECRET`
3. **Verificación**: Cada petición protegida valida el token en el middleware

**Ubicación del código**:
- Generación: `TC PRHECT/src/modules/auth/auth.service.ts` (líneas 44-50, 88-94)
- Verificación: `TC PRHECT/src/shared/middlewares/auth.middleware.ts` (línea 39)

### Hash de Contraseñas (bcrypt)

Las contraseñas se almacenan hasheadas con **bcrypt** (10 salt rounds):

```typescript
// Registro (auth.service.ts línea 31)
const hashedPassword = await bcrypt.hash(userData.password, 10);

// Login (auth.service.ts líneas 80-83)
const isValidPassword = await bcrypt.compare(credentials.password, user.password);
```

**Características**:
- ✅ Hash unidireccional (no reversible)
- ✅ Salt automático único por contraseña
- ✅ Resistente a ataques de fuerza bruta (10 rounds = ~100ms por hash)

### CORS (Cross-Origin Resource Sharing)

Configurado para permitir peticiones del frontend:

```typescript
// index.ts línea 19
app.use(cors()); // Permite todos los orígenes (desarrollo)
```

**Producción**: Restringir a dominios específicos:
```typescript
app.use(cors({ origin: 'https://tu-dominio.com' }));
```

### Validación de Datos

Usa `express-validator` en todas las rutas:

```typescript
// Ejemplo: Validar email en registro
body('email')
  .notEmpty().withMessage('El email es requerido')
  .isEmail().withMessage('Email inválido')
```

---

## 🎨 Patrones de Diseño

### 1. Strategy Pattern (Análisis de Riesgo de Feedback)

**Ubicación**: `TC PRHECT/src/modules/feedback/strategies/`

Implementa 3 estrategias intercambiables para analizar riesgo de feedback:

```typescript
// Interfaz común
interface IRiskAnalyzer {
  analyze(feedback): 'bajo' | 'medio' | 'alto';
}

// Estrategia 1: Basada en calificación general
class ScoreBasedStrategy implements IRiskAnalyzer { ... }

// Estrategia 2: Análisis de palabras clave
class KeywordAnalysisStrategy implements IRiskAnalyzer { ... }

// Estrategia 3: Análisis por aspectos
class AspectBasedStrategy implements IRiskAnalyzer { ... }
```

**Principios SOLID aplicados**:
- ✅ **S**ingle Responsibility: Cada estrategia tiene una sola responsabilidad
- ✅ **O**pen/Closed: Puedes agregar estrategias sin modificar código existente
- ✅ **L**iskov Substitution: Todas las estrategias son intercambiables
- ✅ **I**nterface Segregation: Interfaz mínima (solo `analyze()`)
- ✅ **D**ependency Inversion: FeedbackService depende de la interfaz, no de implementaciones

### 2. Adapter Pattern (Envío de Emails)

**Ubicación**: `TC PRHECT/src/shared/adapters/email.adapter.ts`

```typescript
interface IEmailAdapter {
  sendAlert(data: {...}): Promise<void>;
}

class EmailAdapter implements IEmailAdapter {
  // Implementación actual: console.log
  // Futuro: Nodemailer, SendGrid, etc.
}
```

### 3. Singleton Pattern (Conexión a BD)

**Ubicación**: `TC PRHECT/src/shared/config/database.ts`

```typescript
export const connectDB = async () => {
  await mongoose.connect(config.mongoUri);
  // Mongoose mantiene una única conexión (singleton)
};
```

### 4. Service Layer Pattern

Separa lógica de negocio de controladores HTTP:

```
Controller (HTTP) → Service (Lógica) → Model (Datos)
```

### 5. Repository Pattern (Mongoose)

Mongoose actúa como repositorio:

```typescript
await User.findOne({ email });
await Product.create({ nombre, precio });
```

---

## 🧪 Testing

### Pruebas Funcionales con Postman

**Ubicación**: `TC PRHECT/tests/postman/`

1. Importar `Postman_Collection.json` en Postman
2. Importar `Local.postman_environment.json` como entorno
3. Ejecutar colección completa o por carpetas

**Cobertura de tests**:
- ✅ Autenticación (Register, Login, Profile)
- ✅ Productos (CRUD completo)
- ✅ Órdenes (Crear, Listar, Actualizar estado)
- ✅ Feedback (Crear, Análisis de riesgo)
- ✅ Usuarios Admin (CRUD completo)

### Tests de Seguridad

#### 1. Autenticación JWT
```bash
# Test: Acceder a endpoint protegido sin token
curl http://localhost:3000/api/orders
# Resultado: 401 Unauthorized
```

#### 2. Autorización por Roles
```bash
# Test: Cliente intenta acceder a endpoint admin
curl -H "Authorization: Bearer <token_cliente>" http://localhost:3000/api/users
# Resultado: 403 Forbidden
```

#### 3. Validación de Datos
```bash
# Test: Crear producto sin nombre
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer <token_admin>" \
  -d '{"precio": 10}'
# Resultado: 400 Bad Request + mensaje de error
```

#### 4. Hash de Contraseñas
```bash
# Verificar en MongoDB que las contraseñas están hasheadas
# Las contraseñas nunca se almacenan en texto plano
```

---

## 🌐 Despliegue en Red Local

Para permitir acceso desde otros dispositivos en la misma red WiFi:

### 1. Obtener tu IP local

**Windows**:
```powershell
ipconfig | Select-String -Pattern "IPv4"
```

**Linux/Mac**:
```bash
ifconfig | grep "inet "
```

Ejemplo de salida: `192.168.1.100`

### 2. Configurar Backend

El backend ya está configurado para escuchar en todas las interfaces (`0.0.0.0`):

```typescript
// TC PRHECT/src/index.ts línea 71
app.listen(config.port, '0.0.0.0', () => { ... });
```

### 3. Configurar Frontend

Editar `TC PRHECT FRONT END/.env`:

```env
VITE_API_URL=http://192.168.1.100:3000/api
```

Reemplaza `192.168.1.100` con tu IP local.

### 4. Ejecutar en Modo Red

**Backend**:
```bash
cd "TC PRHECT"
npm run dev:network
```

**Frontend**:
```bash
cd "TC PRHECT FRONT END"
npm run dev:network
```

### 5. Acceder desde Otros Dispositivos

- Backend API: `http://192.168.1.100:3000`
- Frontend App: `http://192.168.1.100:5173`
- Swagger Docs: `http://192.168.1.100:3000/api-docs`

**Nota**: Asegúrate de que el firewall de Windows permita conexiones en los puertos 3000 y 5173.

---

## 📚 Documentación API

### Swagger UI (Interactiva)

Accede a la documentación interactiva en:
```
http://localhost:3000/api-docs
```

**Características**:
- 📖 Documentación completa de todos los endpoints
- 🧪 Prueba endpoints directamente desde el navegador
- 🔐 Autenticación JWT integrada (botón "Authorize")
- 📋 Esquemas de datos (request/response)
- 💡 Ejemplos de uso

### Ejemplo de Uso con Swagger

1. Ir a `http://localhost:3000/api-docs`
2. Expandir sección "Autenticación"
3. Click en `POST /api/auth/login`
4. Click en "Try it out"
5. Ingresar:
```json
{
  "email": "admin@uab.edu",
  "password": "admin123"
}
```
6. Click en "Execute"
7. Copiar el `token` de la respuesta
8. Click en botón "Authorize" (arriba a la derecha)
9. Pegar token en formato: `Bearer <token>`
10. Ahora puedes probar endpoints protegidos

---

## 👥 Autores

**Proyecto desarrollado por:**
- Jhoel Titirico Charca - [GitHub](https://github.com/joelj0el)

**Carrera**: INGENIERIA DE SISTEMAS 
**Curso**: Tecnologías de Internet  
**Institución**: UNIVERSIDAD ADVENTISTA DE BOLIVIA 
**Año**: 2025

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Soporte

Si tienes preguntas o problemas:
- 🐛 Abre un [Issue en GitHub](https://github.com/joelj0el/PROYECTO-ARQSOFT-TCNINTERNET/issues)
- 📧 Contacta al autor

---

## 🙏 Agradecimientos

- UAB
- Docente de Tecnologías de Internet: Victor Hugo SARZURI FLORES

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!**
