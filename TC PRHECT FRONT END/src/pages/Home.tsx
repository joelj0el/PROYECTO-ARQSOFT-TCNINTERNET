import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Plataforma de Servicio y Calidad Total</h1>
          <p>Optimización Logística en Alimentación Universitaria</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explorar Productos
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <ShoppingBag size={48} />
          <h3>Amplio Catálogo</h3>
          <p>Variedad de alimentos frescos y de calidad para la comunidad universitaria</p>
        </div>

        <div className="feature-card">
          <TrendingUp size={48} />
          <h3>Sistema Inteligente</h3>
          <p>Análisis de feedback y gestión optimizada de inventario</p>
        </div>

        <div className="feature-card">
          <Users size={48} />
          <h3>Tu Opinión Importa</h3>
          <p>Sistema de calificación que nos ayuda a mejorar continuamente</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
