# 📖 Guía de Uso con Swagger

## ✅ Swagger ya está integrado en tu proyecto

Después de instalar las dependencias y configurar Swagger, ya puedes usarlo.

## 🚀 Cómo Usar Swagger

### 1. **Iniciar el Servidor**

```bash
npm run dev
```

### 2. **Abrir la Documentación Interactiva**

Abre tu navegador en:

```
http://localhost:3000/api-docs
```

## 🎯 Ventajas de Swagger sobre Postman

| Característica | Swagger | Postman |
|---------------|---------|---------|
| **Interfaz web integrada** | ✅ Sí (en el navegador) | ❌ Aplicación separada |
| **Documentación automática** | ✅ Desde el código | ⏳ Manual |
| **Pruebas en vivo** | ✅ Directamente | ✅ En la app |
| **Compartir** | ✅ Solo una URL | 📤 Exportar JSON |
| **Profesional para presentar** | ✅✅✅ Muy profesional | ✅ Profesional |

## 📸 Cómo Probar las APIs con Swagger

### **Paso 1: Abrir Swagger UI**
- Ve a `http://localhost:3000/api-docs`
- Verás toda tu documentación organizada por tags

### **Paso 2: Probar el Registro**
1. Busca la sección **"Autenticación"**
2. Click en `POST /api/auth/register`
3. Click en **"Try it out"**
4. Modifica el JSON con tus datos:
```json
{
  "nombre": "Maria García",
  "email": "maria@test.com",
  "password": "123456",
  "rol": "cliente",
  "telefono": "3001234567"
}
```
5. Click en **"Execute"**
6. Verás la respuesta abajo con el código de estado

### **Paso 3: Hacer Login y Obtener Token**
1. Click en `POST /api/auth/login`
2. Click en **"Try it out"**
3. Ingresa tus credenciales:
```json
{
  "email": "maria@test.com",
  "password": "123456"
}
```
4. Click en **"Execute"**
5. **COPIA EL TOKEN** de la respuesta

### **Paso 4: Autenticar con el Token**
1. En la parte superior derecha, click en el botón **"Authorize" 🔒**
2. En el campo que aparece, escribe:
```
Bearer TU_TOKEN_AQUI
```
(Reemplaza `TU_TOKEN_AQUI` con el token que copiaste)
3. Click en **"Authorize"**
4. Click en **"Close"**

### **Paso 5: Probar Endpoints Protegidos**
Ahora puedes probar cualquier endpoint que requiera autenticación:

- **Crear Producto** (requiere rol admin)
- **Crear Orden**
- **Ver Mis Órdenes**
- **Crear Feedback**
- etc.

## 🎨 Características de Swagger UI

### **Schemas Interactivos**
- Ver estructura completa de cada modelo
- Tipos de datos
- Validaciones
- Ejemplos

### **Pruebas en Tiempo Real**
- Ejecutar requests directamente
- Ver respuestas con código de estado
- Ver headers
- Ver tiempo de respuesta

### **Documentación Completa**
- Descripción de cada endpoint
- Parámetros requeridos/opcionales
- Códigos de respuesta posibles
- Ejemplos de uso

## 📊 Para tu Proyecto de Clase

### **Ventajas para la Presentación:**

1. **Más Profesional** ⭐
   - Interfaz moderna y limpia
   - Todo en un solo lugar
   - No necesitas alternar entre aplicaciones

2. **Fácil de Demostrar** 🎯
   - Solo compartes la URL: `http://localhost:3000/api-docs`
   - El profesor puede probarlo directamente
   - No necesita instalar nada

3. **Documentación Automática** 📚
   - Se actualiza con tu código
   - Muestra todos los endpoints
   - Incluye modelos y validaciones

4. **Mejores Capturas de Pantalla** 📸
   - Vista profesional
   - Muestra request y response
   - Códigos de estado visibles

## 💡 Recomendación

### **Usa AMBOS:**

1. **Swagger** → Para demostrar y documentar
   - URL principal de documentación
   - Capturas de pantalla para el reporte
   - Demostración en vivo

2. **Postman** → Para desarrollo y pruebas rápidas
   - Guardar colecciones de pruebas
   - Tests automatizados
   - Variables de entorno

## 🎓 Para tu Entrega

Incluye en tu proyecto:

1. **Captura de Swagger UI** mostrando:
   - La página principal con todos los endpoints
   - Un ejemplo de request ejecutado con éxito
   - La respuesta JSON

2. **URL de Swagger en tu README**:
```markdown
## 📚 Documentación Interactiva

Swagger UI: http://localhost:3000/api-docs
```

3. **Mención en tu reporte**:
   - "Se implementó Swagger UI para documentación interactiva"
   - "Permite probar los endpoints directamente desde el navegador"
   - "Incluye schemas completos de todos los modelos"

## 🔧 Estado Actual

✅ Swagger instalado y configurado
✅ Integrado en el servidor
✅ Schemas de todos los modelos configurados
✅ Seguridad JWT configurada
✅ Tags organizados por módulos
✅ URL disponible en: http://localhost:3000/api-docs

## 🚀 Próximos Pasos

1. Inicia el servidor: `npm run dev`
2. Abre: http://localhost:3000/api-docs
3. Prueba los endpoints
4. Toma capturas de pantalla
5. ¡Disfruta de la documentación interactiva!

## 💬 Respuesta a tu Pregunta

**"¿Lo puedo usar con Swagger?"**

✅ **Sí, ya está integrado y funcionando**

- Solo ejecuta `npm run dev`
- Abre http://localhost:3000/api-docs
- Puedes usar Swagger Y Postman juntos
- Swagger es más profesional para presentar
- Postman es más práctico para desarrollo

**¡Tu proyecto ahora tiene documentación interactiva profesional!** 🎉
