const mongoose = require('mongoose');

// Esquema del Usuario (debe coincidir con tu modelo)
const userSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  telefono: String
});

const User = mongoose.model('User', userSchema);

// ⚠️ CAMBIA ESTE EMAIL POR EL TUYO
const EMAIL_DEL_USUARIO = "tu@email.com";

// Nombre de tu base de datos
const DB_NAME = "cafeteria_db";

async function convertirAAdmin() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`);
    console.log('✅ Conectado a MongoDB\n');

    console.log(`🔍 Buscando usuario con email: ${EMAIL_DEL_USUARIO}`);
    const usuario = await User.findOne({ email: EMAIL_DEL_USUARIO });

    if (!usuario) {
      console.error(`❌ ERROR: No se encontró ningún usuario con email ${EMAIL_DEL_USUARIO}`);
      console.log('\n💡 Verifica que:');
      console.log('   1. El email sea correcto (respeta mayúsculas/minúsculas)');
      console.log('   2. El usuario esté registrado en la base de datos');
      console.log('   3. El nombre de la base de datos sea correcto\n');
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado: ${usuario.nombre}`);
    console.log(`   Email: ${usuario.email}`);
    console.log(`   Rol actual: ${usuario.rol}\n`);

    if (usuario.rol === 'admin') {
      console.log('ℹ️  El usuario ya es ADMIN. No se requieren cambios.\n');
    } else {
      console.log('🔄 Cambiando rol a ADMIN...');
      usuario.rol = 'admin';
      await usuario.save();
      console.log('✅ ¡Rol actualizado exitosamente!\n');
    }

    console.log('📋 Estado final del usuario:');
    console.log(`   Nombre: ${usuario.nombre}`);
    console.log(`   Email: ${usuario.email}`);
    console.log(`   Rol: ${usuario.rol}`);
    console.log(`   ID: ${usuario._id}\n`);

    console.log('🎉 ¡Proceso completado!\n');
    console.log('📝 Próximos pasos:');
    console.log('   1. Cierra sesión en la aplicación web');
    console.log('   2. Vuelve a iniciar sesión con tus credenciales');
    console.log('   3. Deberías ver el botón "Admin" en el navbar');
    console.log('   4. Haz clic para acceder al Panel de Administración\n');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\n💡 Solución:');
    console.error('   - Verifica que MongoDB esté corriendo');
    console.error('   - Ejecuta: mongod --version');
    console.error('   - Si no responde, inicia MongoDB\n');
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar el script
convertirAAdmin();
