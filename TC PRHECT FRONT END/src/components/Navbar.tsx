import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, User, LogOut, ShieldCheck, Home } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">UAB</span>
          <span className="brand-text">Cafetería</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <Home size={20} />
            <span>Inicio</span>
          </Link>

          <Link to="/products" className={`nav-link ${isActive('/products')}`}>
            <ShoppingCart size={20} />
            <span>Productos</span>
          </Link>

          {user && (
            <Link to="/orders" className={`nav-link ${isActive('/orders')}`}>
              <Package size={20} />
              <span>Mis Órdenes</span>
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
              <ShieldCheck size={20} />
              <span>Admin</span>
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-button">
                <ShoppingCart size={24} />
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>

              <div className="user-menu">
                <Link to="/profile" className="user-profile-link" title="Mi Perfil">
                  <User size={24} />
                </Link>
                <span>{user.nombre}</span>
                <button onClick={logout} className="btn-logout" title="Cerrar Sesión">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
