export interface User {
  _id: string;
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin';
  telefono?: string;
}

export interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
  disponible: boolean;
  stock: number;
  stockMinimo: number;
}

export interface OrderItem {
  producto: string | Product;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  cliente?: string | User;
  usuarioId?: string | User; // Alias para compatibilidad
  items: OrderItem[];
  total: number;
  estado: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackAspectos {
  calidadComida: number;
  tiempoEspera: number;
  atencion: number;
}

export interface Feedback {
  _id: string;
  ordenId: string | Order;
  usuarioId: string | User;
  calificacion: number;
  comentario?: string;
  aspectos: FeedbackAspectos;
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';
  analisisDetallado: {
    strategy: string;
    score: number;
    details: Record<string, unknown>;
  }[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
