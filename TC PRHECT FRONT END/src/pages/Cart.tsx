import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: items.map((item) => ({
          productoId: item.product._id,
          cantidad: item.quantity,
        })),
        notas: notes || undefined,
      };

      console.log('📦 Enviando orden:', orderData);
      const response = await api.post('/orders', orderData);
      console.log('✅ Orden creada:', response.data);
      
      clearCart();
      setNotes('');
      navigate('/orders');
    } catch (err) {
      console.error('❌ Error completo:', err);
      const error = err as { response?: { data?: { message?: string; errors?: unknown[] } } };
      const errorMessage = error.response?.data?.message || 'Error al crear la orden';
      setError(errorMessage);
      
      // Mostrar detalles adicionales en consola
      if (error.response?.data) {
        console.error('Detalles del error del servidor:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <ShoppingCart size={80} />
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestros productos y agrega algo delicioso</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Mi Carrito</h1>
        <button className="btn btn-outline" onClick={clearCart}>
          <X size={18} /> Vaciar Carrito
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="cart-item-image">
                {item.product.imagen ? (
                  <img src={item.product.imagen} alt={item.product.nombre} />
                ) : (
                  <div className="cart-item-image-placeholder">Sin imagen</div>
                )}
              </div>

              <div className="cart-item-details">
                <h3>{item.product.nombre}</h3>
                <p className="cart-item-category">{item.product.categoria}</p>
                <p className="cart-item-price">Bs. {item.product.precio.toFixed(2)}</p>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  Bs. {(item.product.precio * item.quantity).toFixed(2)}
                </div>

                <button
                  className="btn-icon btn-danger"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumen de Orden</h2>

          <div className="cart-summary-line">
            <span>Subtotal ({items.length} productos)</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>

          <div className="cart-summary-line total">
            <span>Total</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notas adicionales (opcional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones especiales para tu orden..."
              rows={3}
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar Orden'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
