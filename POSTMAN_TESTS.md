# 📮 Pruebas con Postman - Guía Paso a Paso

## Configuración Inicial de Postman

1. **Crear una nueva colección** llamada "Plataforma Servicio y Calidad Total"
2. **Crear una variable de entorno** para el token:
   - Variable: `token`
   - Initial Value: (vacío)
   - Current Value: (vacío)

## 🔥 Flujo de Pruebas Completo

### PASO 1: Registrar Usuario Admin

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Admin Snack",
  "email": "admin@snack.com",
  "password": "admin123",
  "rol": "admin",
  "telefono": "0999999999"
}
```

**Resultado Esperado: 201 Created**

---

### PASO 2: Registrar Usuario Cliente

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Estudiante Test",
  "email": "estudiante@univ.edu",
  "password": "123456",
  "rol": "cliente",
  "telefono": "0988888888"
}
```

**Resultado Esperado: 201 Created**

---

### PASO 3: Login como Admin

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@snack.com",
  "password": "admin123"
}
```

**Resultado Esperado: 200 OK**

**⚠️ IMPORTANTE:** Copiar el `token` de la respuesta y guardarlo en la variable de entorno de Postman.

**En Postman:**
1. Ir a Tests (en la pestaña de la petición)
2. Agregar este script:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.token);
```

---

### PASO 4: Crear Productos (con token de admin)

**Producto 1: Hamburguesa**
```http
POST http://localhost:3000/api/products
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Hamburguesa Clásica",
  "descripcion": "Hamburguesa con carne, queso, lechuga, tomate y salsas especiales",
  "precio": 5.50,
  "categoria": "comida",
  "disponible": true,
  "imagen": "https://ejemplo.com/hamburguesa.jpg"
}
```

**Producto 2: Coca Cola**
```http
POST http://localhost:3000/api/products
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Coca Cola 500ml",
  "descripcion": "Bebida gaseosa sabor cola",
  "precio": 1.50,
  "categoria": "bebida",
  "disponible": true
}
```

**Producto 3: Papas Fritas**
```http
POST http://localhost:3000/api/products
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Papas Fritas",
  "descripcion": "Porción grande de papas fritas crujientes",
  "precio": 2.50,
  "categoria": "snack",
  "disponible": true
}
```

**Producto 4: Brownie**
```http
POST http://localhost:3000/api/products
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Brownie de Chocolate",
  "descripcion": "Brownie casero con chips de chocolate",
  "precio": 2.00,
  "categoria": "postre",
  "disponible": true
}
```

**Resultado Esperado: 201 Created** (para cada producto)

---

### PASO 5: Listar Todos los Productos (sin autenticación)

```http
GET http://localhost:3000/api/products
```

**Resultado Esperado: 200 OK** con todos los productos

---

### PASO 6: Login como Cliente

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "estudiante@univ.edu",
  "password": "123456"
}
```

**⚠️ IMPORTANTE:** Actualizar el token con el del cliente (usar el script de Tests).

---

### PASO 7: Crear una Orden (con token de cliente)

```http
POST http://localhost:3000/api/orders
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "items": [
    {
      "producto": "PONER_ID_HAMBURGUESA_AQUI",
      "cantidad": 1
    },
    {
      "producto": "PONER_ID_COCA_COLA_AQUI",
      "cantidad": 1
    },
    {
      "producto": "PONER_ID_PAPAS_AQUI",
      "cantidad": 1
    }
  ],
  "notas": "Sin cebolla en la hamburguesa, por favor"
}
```

**⚠️ Reemplazar los IDs con los IDs reales de los productos creados en el PASO 4**

**Resultado Esperado: 201 Created**

**💡 Guardar el ID de la orden creada para los siguientes pasos**

---

### PASO 8: Ver Mis Órdenes (como cliente)

```http
GET http://localhost:3000/api/orders
Authorization: Bearer {{token}}
```

**Resultado Esperado: 200 OK** con las órdenes del cliente

---

### PASO 9: Login como Admin (nuevamente)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@snack.com",
  "password": "admin123"
}
```

**⚠️ Actualizar el token con el del admin**

---

### PASO 10: Ver Todas las Órdenes (como admin)

```http
GET http://localhost:3000/api/orders
Authorization: Bearer {{token}}
```

**Resultado Esperado: 200 OK** con TODAS las órdenes

---

### PASO 11: Actualizar Estado de Orden - Preparing

```http
PUT http://localhost:3000/api/orders/PONER_ID_ORDEN_AQUI/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "estado": "preparing"
}
```

**Resultado Esperado: 200 OK**

---

### PASO 12: Actualizar Estado de Orden - Ready

```http
PUT http://localhost:3000/api/orders/PONER_ID_ORDEN_AQUI/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "estado": "ready"
}
```

**Resultado Esperado: 200 OK**

---

### PASO 13: Actualizar Estado de Orden - Completed

```http
PUT http://localhost:3000/api/orders/PONER_ID_ORDEN_AQUI/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "estado": "completed"
}
```

**Resultado Esperado: 200 OK**

**⚠️ Este estado es necesario para poder crear feedback**

---

### PASO 14: Login como Cliente (nuevamente)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "estudiante@univ.edu",
  "password": "123456"
}
```

**⚠️ Actualizar el token con el del cliente**

---

### PASO 15: Crear Feedback (con token de cliente)

```http
POST http://localhost:3000/api/feedback
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "orden": "PONER_ID_ORDEN_AQUI",
  "calificacion": 5,
  "comentario": "Excelente servicio! La comida estaba deliciosa y el tiempo de espera fue mínimo. Muy recomendado!",
  "aspectos": {
    "calidadComida": 5,
    "tiempoEspera": 5,
    "atencion": 5
  }
}
```

**Resultado Esperado: 201 Created**

---

### PASO 16: Ver Mis Feedbacks (como cliente)

```http
GET http://localhost:3000/api/feedback
Authorization: Bearer {{token}}
```

**Resultado Esperado: 200 OK**

---

### PASO 17: Login como Admin (última vez)

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@snack.com",
  "password": "admin123"
}
```

**⚠️ Actualizar el token**

---

### PASO 18: Ver Estadísticas de Feedback (como admin)

```http
GET http://localhost:3000/api/feedback/stats
Authorization: Bearer {{token}}
```

**Resultado Esperado: 200 OK** con estadísticas completas

---

### PASO 19: Listar Todos los Usuarios (como admin)

```http
GET http://localhost:3000/api/users
Authorization: Bearer {{token}}
```

**Resultado Esperado: 200 OK** con todos los usuarios (sin contraseñas)

---

### PASO 20: Actualizar un Producto (como admin)

```http
PUT http://localhost:3000/api/products/PONER_ID_PRODUCTO_AQUI
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "precio": 6.00,
  "disponible": true
}
```

**Resultado Esperado: 200 OK**

---

## 🎯 Pruebas Adicionales Recomendadas

### Filtrar Productos por Categoría

```http
GET http://localhost:3000/api/products?categoria=comida
```

### Filtrar Productos Disponibles

```http
GET http://localhost:3000/api/products?disponible=true
```

### Filtrar Órdenes por Estado

```http
GET http://localhost:3000/api/orders?estado=completed
Authorization: Bearer {{token}}
```

### Intentar Crear Feedback sin Completar Orden (debería fallar)

```http
POST http://localhost:3000/api/feedback
Authorization: Bearer {{token_cliente}}
Content-Type: application/json

{
  "orden": "ID_ORDEN_PENDING",
  "calificacion": 4,
  "aspectos": {
    "calidadComida": 4,
    "tiempoEspera": 4,
    "atencion": 4
  }
}
```

**Resultado Esperado: 400 Bad Request** - "Solo puedes dar feedback a órdenes completadas"

---

## 📸 Capturas de Pantalla Recomendadas

Para la entrega del proyecto, tomar capturas de:

1. ✅ Registro de usuario exitoso
2. ✅ Login exitoso con token
3. ✅ Creación de producto (admin)
4. ✅ Listado de productos
5. ✅ Creación de orden
6. ✅ Actualización de estado de orden
7. ✅ Creación de feedback
8. ✅ Estadísticas de feedback
9. ✅ Error 401 (sin token)
10. ✅ Error 403 (cliente intentando acceso admin)

---

## 🔧 Tips para Postman

### Configurar Authorization automáticamente:

1. En la colección, ir a Authorization
2. Seleccionar Type: "Bearer Token"
3. Token: `{{token}}`
4. Esto aplicará el token a todas las peticiones de la colección

### Script de Tests para guardar token automáticamente:

```javascript
if (pm.response.code === 200 && pm.response.json().data.token) {
    pm.environment.set("token", pm.response.json().data.token);
    console.log("Token guardado:", pm.response.json().data.token);
}
```

---

¡Buena suerte con las pruebas! 🚀
