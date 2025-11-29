import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar contraseñas si se está cambiando
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setError('Debes ingresar tu contraseña actual para cambiarla');
        setLoading(false);
        return;
      }
    }

    try {
      const updateData: {
        nombre: string;
        email: string;
        telefono?: string;
        password?: string;
      } = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || undefined,
      };

      // Solo incluir password si se proporcionó
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await api.put(`/users/${user?._id}`, updateData);
      
      // Actualizar el contexto con los nuevos datos
      updateUser(response.data.data);
      
      setSuccess('Perfil actualizado correctamente');
      
      // Limpiar campos de contraseña
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      console.error('Error al actualizar perfil:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Volver
          </button>
          <div className="profile-title">
            <User size={48} className="profile-icon" />
            <div>
              <h1>Mi Perfil</h1>
              <p>Actualiza tu información personal</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="profile-section">
            <h2>Información Personal</h2>

            <div className="form-group">
              <label htmlFor="nombre">
                <User size={18} />
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                minLength={3}
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">
                <Phone size={18} />
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="70123456"
              />
            </div>
          </div>

          <div className="profile-section">
            <h2>Cambiar Contraseña</h2>
            <p className="section-description">
              Deja estos campos vacíos si no deseas cambiar tu contraseña
            </p>

            <div className="form-group">
              <label htmlFor="currentPassword">
                <Lock size={18} />
                Contraseña Actual
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Tu contraseña actual"
                autoComplete="current-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">
                <Lock size={18} />
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={18} />
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={6}
                placeholder="Repite la nueva contraseña"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={20} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>

        <div className="profile-info-box">
          <h3>Información de Cuenta</h3>
          <div className="info-item">
            <strong>Rol:</strong>
            <span className={`badge ${user.rol === 'admin' ? 'badge-warning' : 'badge-info'}`}>
              {user.rol === 'admin' ? 'Administrador' : 'Cliente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
