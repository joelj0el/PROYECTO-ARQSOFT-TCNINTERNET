import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import api from '../../config/api';
import type { Product } from '../../types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    stock: 0,
    stockMinimo: 5,
    disponible: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchLowStock();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStock = async () => {
    try {
      const response = await api.get('/products/low-stock');
      setLowStockProducts(response.data.data);
    } catch {
      // Error handled silently
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      
      resetForm();
      fetchProducts();
      fetchLowStock();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string; errors?: unknown[] } } };
      const errorMessage = err.response?.data?.message || 'Error al guardar el producto';
      alert(errorMessage);
      console.error('Error completo:', err.response?.data);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      stock: product.stock,
      stockMinimo: product.stockMinimo,
      disponible: product.disponible,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
        fetchLowStock();
      } catch {
        alert('Error al eliminar el producto');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      stock: 0,
      stockMinimo: 5,
      disponible: true,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-products">
      {lowStockProducts.length > 0 && (
        <div className="alert alert-warning">
          <AlertCircle size={20} />
          <span>
            Hay {lowStockProducts.length} producto(s) con stock bajo
          </span>
        </div>
      )}

      <div className="admin-actions">
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="bebida">Bebida</option>
                <option value="comida">Comida</option>
                <option value="snack">Snack</option>
                <option value="postre">Postre</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio (Bs.)</label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Mínimo</label>
              <input
                type="number"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.disponible}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
              />
              Disponible
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.nombre}</td>
                <td>{product.categoria}</td>
                <td>Bs. {product.precio.toFixed(2)}</td>
                <td>
                  <span className={product.stock <= product.stockMinimo ? 'text-danger' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`badge ${product.disponible ? 'badge-success' : 'badge-danger'}`}>
                    {product.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
                <td>
                  <button className="btn-icon" onClick={() => handleEdit(product)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(product._id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
