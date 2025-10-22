# 🚀 Guía Rápida de Postman - SNACKSOFT API

## 📥 PASO 1: Importar la Colección en Postman

1. **Abrir Postman**
2. Click en **"Import"** (arriba a la izquierda)
3. Click en **"Upload Files"**
4. Seleccionar el archivo: `Postman_Collection.json`
5. Click en **"Import"**

## 🔧 PASO 2: Crear Environment (Variables)

1. Click en **"Environments"** (icono de ojo, arriba derecha)
2. Click en **"+"** para crear nuevo environment
3. Nombre: **"SNACKSOFT Local"**
4. Agregar esta variable:
   - Variable: `token`
   - Initial Value: (dejar vacío)
   - Current Value: (dejar vacío)
5. Click en **"Save"**
6. Seleccionar el environment **"SNACKSOFT Local"** del dropdown

## ✅ PASO 3: Flujo de Prueba Completo

### 1️⃣ REGISTRAR USUARIOS

**a) Registrar Admin**
- Ir a: `1. AUTENTICACIÓN` → `Registrar Admin`
- Click en **"Send"**
- ✅ Debe responder **201 Created**

**b) Registrar Cliente**
- Ir a: `1. AUTENTICACIÓN` → `Registrar Cliente`
- Click en **"Send"**
- ✅ Debe responder **201 Created**

### 2️⃣ LOGIN COMO ADMIN

- Ir a: `1. AUTENTICACIÓN` → `Login Admin`
- Click en **"Send"**
- ✅ Debe responder **200 OK**
- 🔑 **El token se guarda automáticamente** en la variable `{{token}}`

### 3️⃣ CREAR PRODUCTOS (con token de admin)

**a) Crear Hamburguesa**
- Ir a: `3. PRODUCTOS` → `Crear Hamburguesa`
- Click en **"Send"**
- ✅ Debe responder **201 Created**
- 📝 **COPIAR el `_id` del producto** (lo necesitarás después)

**b) Crear Coca Cola**
- Ir a: `3. PRODUCTOS` → `Crear Coca Cola`
- Click en **"Send"**
- 📝 **COPIAR el `_id`**

**c) Crear Papas Fritas**
- Ir a: `3. PRODUCTOS` → `Crear Papas Fritas`
- Click en **"Send"**
- 📝 **COPIAR el `_id`**

### 4️⃣ LOGIN COMO CLIENTE

- Ir a: `1. AUTENTICACIÓN` → `Login Cliente`
- Click en **"Send"**
- 🔑 **Ahora tienes token de cliente**

### 5️⃣ CREAR UNA ORDEN

- Ir a: `4. ÓRDENES` → `Crear Orden`
- **REEMPLAZAR** los IDs en el JSON:
  ```json
  {
    "items": [
      {
        "producto": "PEGAR_ID_HAMBURGUESA_AQUÍ",
        "cantidad": 1
      },
      {
        "producto": "PEGAR_ID_COCA_COLA_AQUÍ",
        "cantidad": 1
      },
      {
        "producto": "PEGAR_ID_PAPAS_AQUÍ",
        "cantidad": 1
      }
    ],
    "notas": "Sin cebolla en la hamburguesa, por favor"
  }
  ```
- Click en **"Send"**
- ✅ Debe responder **201 Created**
- 📝 **COPIAR el `_id` de la orden**

### 6️⃣ LOGIN COMO ADMIN (otra vez)

- Ir a: `1. AUTENTICACIÓN` → `Login Admin`
- Click en **"Send"**

### 7️⃣ CAMBIAR ESTADO DE LA ORDEN

**a) Cambiar a "Preparing"**
- Ir a: `4. ÓRDENES` → `Cambiar a Preparing`
- **REEMPLAZAR** `REEMPLAZAR_CON_ID` en la URL con el ID de tu orden
- Click en **"Send"**

**b) Cambiar a "Ready"**
- Ir a: `4. ÓRDENES` → `Cambiar a Ready`
- **REEMPLAZAR** el ID en la URL
- Click en **"Send"**

**c) Cambiar a "Completed"** ⚠️ **Necesario para feedback**
- Ir a: `4. ÓRDENES` → `Cambiar a Completed`
- **REEMPLAZAR** el ID en la URL
- Click en **"Send"**

### 8️⃣ LOGIN COMO CLIENTE (última vez)

- Ir a: `1. AUTENTICACIÓN` → `Login Cliente`
- Click en **"Send"**

### 9️⃣ CREAR FEEDBACK

- Ir a: `5. FEEDBACK` → `Crear Feedback`
- **REEMPLAZAR** `REEMPLAZAR_CON_ID_ORDEN` con el ID de tu orden completada
- Click en **"Send"**
- ✅ Debe responder **201 Created**

### 🔟 VER ESTADÍSTICAS (Admin)

- Ir a: `1. AUTENTICACIÓN` → `Login Admin`
- Click en **"Send"**
- Ir a: `5. FEEDBACK` → `Estadísticas de Feedback (Admin)`
- Click en **"Send"**
- ✅ Verás el análisis completo de feedback

---

## 🎯 TIPS IMPORTANTES

### ✅ Verificar que el token se guarda automáticamente:
1. Después de hacer login
2. Ir a **"Environments"** (icono de ojo)
3. Ver que la variable `token` tiene un valor largo (JWT)

### ✅ Si el token NO se guarda automáticamente:
1. Ir a la petición de Login
2. Click en **"Tests"** (pestaña abajo)
3. Pegar este código:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set('token', jsonData.data.token);
    console.log('Token guardado:', jsonData.data.token);
}
```
4. Click en **"Save"**

### ✅ Ver el token en las peticiones:
- En cualquier petición protegida
- Ir a pestaña **"Authorization"**
- Type: **Bearer Token**
- Token: `{{token}}`

### ✅ Ver los logs:
- Abrir **Console** (abajo de Postman, o View → Show Postman Console)
- Ahí verás cuando se guarda el token

---

## 📸 Capturas Recomendadas para la Entrega

1. ✅ Registro exitoso de usuario
2. ✅ Login exitoso mostrando el token
3. ✅ Creación de producto (admin)
4. ✅ Listado de productos
5. ✅ Creación de orden
6. ✅ Cambio de estado de orden
7. ✅ Creación de feedback
8. ✅ Estadísticas de feedback
9. ✅ Error 401 (intentar acceso sin token)
10. ✅ Error 403 (cliente intentando crear producto)

---

## 🚨 Solución de Problemas

### Error: "Token no proporcionado"
- Verificar que el environment "SNACKSOFT Local" esté seleccionado
- Hacer login nuevamente

### Error: "Token inválido"
- El token expiró (24 horas)
- Hacer login nuevamente

### Error: "No se encuentra el producto"
- Verificar que hayas reemplazado los IDs correctamente
- Copiar el ID completo (ej: `67362abc123def456789`)

### Error: "Solo puedes dar feedback a órdenes completadas"
- Cambiar el estado de la orden a "completed" primero

---

¡Listo para probar! 🎉
