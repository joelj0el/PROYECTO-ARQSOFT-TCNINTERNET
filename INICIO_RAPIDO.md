# 🚀 Inicio Rápido - Plataforma de Servicio y Calidad Total

## ⚡ Pasos para Ejecutar el Proyecto

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Verificar/Iniciar MongoDB

**Opción A - MongoDB Local (Windows):**
```powershell
net start MongoDB
```

**Opción B - MongoDB Atlas (Cloud):**
- Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crear cuenta gratuita
- Crear cluster
- Obtener connection string
- Actualizar `MONGODB_URI` en el archivo `.env`

### 3. Configurar Variables de Entorno

El archivo `.env` ya está configurado con valores por defecto:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/plataforma_calidad_total
JWT_SECRET=plataforma_servicio_calidad_total_secret_key_2025
JWT_EXPIRES_IN=86400
NODE_ENV=development
```

### 4. (Opcional) Poblar Base de Datos con Datos de Prueba

```bash
npm run seed
```

Esto creará:
- ✅ Usuario Admin: `admin@snack.com` / `admin123`
- ✅ Usuario Cliente: `estudiante@univ.edu` / `123456`
- ✅ 14 productos de muestra (hamburguesas, bebidas, snacks, postres)

### 5. Ejecutar el Servidor

```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

---

## 📝 Credenciales por Defecto (después del seed)

**Administrador:**
- Email: `admin@snack.com`
- Password: `admin123`

**Cliente:**
- Email: `estudiante@univ.edu`
- Password: `123456`

---

## 🧪 Probar la API

### Opción 1: Con Postman
Ver el archivo `POSTMAN_TESTS.md` para la guía completa paso a paso.

### Opción 2: Prueba Rápida con cURL

**Verificar que el servidor está corriendo:**
```bash
curl http://localhost:3000
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@snack.com\",\"password\":\"admin123\"}"
```

---

## 📚 Endpoints Principales

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (admin)
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `PUT /api/orders/:id/status` - Actualizar estado (admin)
- `GET /api/feedback` - Listar evaluaciones
- `POST /api/feedback` - Crear evaluación
- `GET /api/feedback/stats` - Estadísticas (admin)

Ver `README.md` para documentación completa.

---

## 🛠️ Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo (con hot-reload)
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar versión compilada
- `npm run seed` - Poblar base de datos con datos de prueba

---

## ❓ Problemas Comunes

### Error: "Cannot find module..."
```bash
npm install
```

### Error: "connect ECONNREFUSED 127.0.0.1:27017"
MongoDB no está ejecutándose. Iniciar con:
```bash
net start MongoDB
```

### Puerto 3000 ya en uso
Cambiar el puerto en `.env`:
```env
PORT=4000
```

---

## 📖 Documentación Completa

Ver `README.md` para:
- Arquitectura del proyecto
- Modelos de datos detallados
- Ejemplos de todas las peticiones HTTP
- Seguridad implementada
- Solución de problemas

---

¡Listo para empezar! 🎉
