import React, { useState } from 'react';
import { Package, ShoppingBag, MessageSquare, Users } from 'lucide-react';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminFeedback from '../components/admin/AdminFeedback';
import AdminUsers from '../components/admin/AdminUsers';

type AdminTab = 'products' | 'orders' | 'feedback' | 'users';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestión completa de la plataforma</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={20} />
          <span>Productos</span>
        </button>

        <button
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={20} />
          <span>Órdenes</span>
        </button>

        <button
          className={`admin-tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          <MessageSquare size={20} />
          <span>Feedback</span>
        </button>

        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          <span>Usuarios</span>
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'feedback' && <AdminFeedback />}
        {activeTab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
};

export default Admin;
