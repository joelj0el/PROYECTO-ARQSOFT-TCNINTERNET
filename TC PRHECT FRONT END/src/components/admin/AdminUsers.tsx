import React, { useState, useEffect, useCallback } from 'react';
import { UserCog, Edit2, Trash2, Shield, User as UserIcon } from 'lucide-react';
import api from '../../config/api';
import type { User } from '../../types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rol: 'cliente' as 'cliente' | 'admin',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const url = filter ? `/users?rol=${filter}` : '/users';
      const response = await api.get(url);
      setUsers(response.data.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono || '',
      rol: user.rol,
      password: '',
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await api.delete(`/users/${userId}`);
      setSuccess('Usuario eliminado correctamente');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMsg = error.response?.data?.message || 'Error al eliminar usuario';
      setError(errorMsg);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updateData: {
        nombre: string;
        email: string;
        rol: string;
        telefono?: string;
        password?: string;
      } = {
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
        telefono: formData.telefono || undefined,
      };

      // Solo incluir password si se proporcionó
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, updateData);
        setSuccess('Usuario actualizado correctamente');
      }

      fetchUsers();
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMsg = error.response?.data?.message || 'Error al guardar usuario';
      setError(errorMsg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      <div className="admin-filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="cliente">Clientes</option>
          <option value="admin">Administradores</option>
        </select>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {user.rol === 'admin' ? (
                      <Shield size={16} color="#F59E0B" />
                    ) : (
                      <UserIcon size={16} color="#6B7280" />
                    )}
                    {user.nombre}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.telefono || '-'}</td>
                <td>
                  <span
                    className={`badge ${
                      user.rol === 'admin' ? 'badge-warning' : 'badge-info'
                    }`}
                  >
                    {user.rol === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEdit(user)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDelete(user._id)}
                      title="Eliminar"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="empty-state">
          <UserCog size={80} />
          <p>No hay usuarios con este filtro</p>
        </div>
      )}

      {/* Modal de Edición */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <Edit2 size={24} />
                Editar Usuario
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  minLength={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono (opcional)</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rol">Rol</label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Nueva Contraseña (dejar vacío para no cambiar)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
