import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Product } from '../models/Product';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SNACKSOFT';

const seedData = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Datos anteriores eliminados');

    // Crear usuarios
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientePassword = await bcrypt.hash('123456', 10);

    await User.create({
      nombre: 'Admin Snack',
      email: 'admin@snack.com',
      password: adminPassword,
      rol: 'admin',
      telefono: '0999999999'
    });

    await User.create({
      nombre: 'Estudiante Test',
      email: 'estudiante@univ.edu',
      password: clientePassword,
      rol: 'cliente',
      telefono: '0988888888'
    });

    console.log('👥 Usuarios creados:');
    console.log('   - Admin: admin@snack.com / admin123');
    console.log('   - Cliente: estudiante@univ.edu / 123456');

    // Crear productos
    const productos = [
      {
        nombre: 'Hamburguesa Clásica',
        descripcion: 'Hamburguesa con carne, queso, lechuga, tomate y salsas especiales',
        precio: 5.50,
        categoria: 'comida',
        disponible: true
      },
      {
        nombre: 'Hamburguesa BBQ',
        descripcion: 'Hamburguesa con carne, queso cheddar, cebolla caramelizada y salsa BBQ',
        precio: 6.50,
        categoria: 'comida',
        disponible: true
      },
      {
        nombre: 'Hot Dog',
        descripcion: 'Hot dog con salchicha alemana, papas fritas y salsas',
        precio: 3.50,
        categoria: 'comida',
        disponible: true
      },
      {
        nombre: 'Sándwich de Pollo',
        descripcion: 'Sándwich de pechuga de pollo a la plancha con vegetales',
        precio: 4.50,
        categoria: 'comida',
        disponible: true
      },
      {
        nombre: 'Coca Cola 500ml',
        descripcion: 'Bebida gaseosa sabor cola',
        precio: 1.50,
        categoria: 'bebida',
        disponible: true
      },
      {
        nombre: 'Sprite 500ml',
        descripcion: 'Bebida gaseosa sabor lima-limón',
        precio: 1.50,
        categoria: 'bebida',
        disponible: true
      },
      {
        nombre: 'Jugo Natural de Naranja',
        descripcion: 'Jugo 100% natural de naranja recién exprimida',
        precio: 2.00,
        categoria: 'bebida',
        disponible: true
      },
      {
        nombre: 'Agua Mineral 600ml',
        descripcion: 'Agua mineral sin gas',
        precio: 1.00,
        categoria: 'bebida',
        disponible: true
      },
      {
        nombre: 'Papas Fritas',
        descripcion: 'Porción grande de papas fritas crujientes',
        precio: 2.50,
        categoria: 'snack',
        disponible: true
      },
      {
        nombre: 'Nachos con Queso',
        descripcion: 'Nachos crujientes con salsa de queso cheddar',
        precio: 3.00,
        categoria: 'snack',
        disponible: true
      },
      {
        nombre: 'Alitas de Pollo',
        descripcion: '6 alitas de pollo con salsa BBQ o picante',
        precio: 4.00,
        categoria: 'snack',
        disponible: true
      },
      {
        nombre: 'Brownie de Chocolate',
        descripcion: 'Brownie casero con chips de chocolate',
        precio: 2.00,
        categoria: 'postre',
        disponible: true
      },
      {
        nombre: 'Helado de Vainilla',
        descripcion: 'Copa de helado artesanal de vainilla',
        precio: 2.50,
        categoria: 'postre',
        disponible: true
      },
      {
        nombre: 'Cheesecake de Fresa',
        descripcion: 'Rebanada de cheesecake con topping de fresas',
        precio: 3.50,
        categoria: 'postre',
        disponible: true
      }
    ];

    await Product.insertMany(productos);
    console.log(`🍔 ${productos.length} productos creados`);

    console.log('\n✨ Seed completado exitosamente!');
    console.log('\n🚀 Ahora puedes ejecutar: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedData();
