import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import type { Order, User } from '../../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { estado: newStatus });
      fetchOrders();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Error al actualizar el estado';
      alert(errorMessage);
      console.error('Error completo:', err.response?.data);
    }
  };

  const filteredOrders = filter
    ? orders.filter((order) => order.estado === filter)
    : orders;

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-orders">
      <div className="admin-filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="preparing">Preparando</option>
          <option value="ready">Listo</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const user = (order.cliente || order.usuarioId) as User;
              const userName = typeof user === 'object' ? user.nombre : 'Usuario';
              return (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8)}</td>
                  <td>{userName}</td>
                  <td>{order.items.length} items</td>
                  <td>Bs. {order.total.toFixed(2)}</td>
                  <td>
                    <select
                      value={order.estado}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="preparing">Preparando</option>
                      <option value="ready">Listo</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        const items = order.items
                          .map((item) => {
                            const nombreProducto = typeof item.producto === 'object' 
                              ? item.producto.nombre 
                              : item.nombreProducto;
                            return `${nombreProducto} x${item.cantidad} - Bs. ${item.subtotal.toFixed(2)}`;
                          })
                          .join('\n');
                        alert(`Detalles de la orden:\n\n${items}\n\nTotal: Bs. ${order.total.toFixed(2)}\n\nNotas: ${order.notas || 'Sin notas'}`);
                      }}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <p>No hay órdenes con este filtro</p>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
