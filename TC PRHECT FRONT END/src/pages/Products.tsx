import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../config/api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categoria === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const productsData = response.data.data as Product[];
      setProducts(productsData);
      
      // Extraer categorías únicas
      const uniqueCategories = [...new Set(productsData.map((p) => p.categoria))];
      setCategories(uniqueCategories);
    } catch {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Productos Disponibles</h1>
        <p>Explora nuestro catálogo de alimentos</p>
      </div>

      <div className="products-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <Filter size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
