import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../config/api';
import type { Order } from '../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.data);
    } catch {
      setError('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} />;
      case 'preparing':
      case 'ready':
        return <Package size={20} />;
      case 'completed':
        return <CheckCircle size={20} />;
      case 'cancelled':
        return <XCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'preparing':
        return 'status-preparing';
      case 'ready':
        return 'status-ready';
      case 'completed':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      ready: 'Listo para recoger',
      completed: 'Entregado',
      cancelled: 'Cancelado',
    };
    return texts[status] || status;
  };

  const canLeaveFeedback = (order: Order) => {
    return order.estado === 'completed';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <Package size={80} />
        <h2>No tienes órdenes</h2>
        <p>Realiza tu primera orden para comenzar</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Mis Órdenes</h1>
        <p>Historial de pedidos y estado actual</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-id">
                <strong>Orden #{order._id.slice(-8)}</strong>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className={`order-status ${getStatusClass(order.estado)}`}>
                {getStatusIcon(order.estado)}
                <span>{getStatusText(order.estado)}</span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => {
                // Usar nombreProducto del item o producto populado
                const nombreProducto = typeof item.producto === 'object' 
                  ? item.producto.nombre 
                  : item.nombreProducto;
                
                return (
                  <div key={index} className="order-item">
                    <span className="order-item-name">
                      {nombreProducto} × {item.cantidad}
                    </span>
                    <span className="order-item-price">
                      Bs. {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {order.notas && (
              <div className="order-notes">
                <strong>Notas:</strong> {order.notas}
              </div>
            )}

            <div className="order-footer">
              <div className="order-total">
                <strong>Total:</strong> Bs. {order.total.toFixed(2)}
              </div>
              {canLeaveFeedback(order) && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/feedback/${order._id}`)}
                >
                  Dejar Opinión
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
