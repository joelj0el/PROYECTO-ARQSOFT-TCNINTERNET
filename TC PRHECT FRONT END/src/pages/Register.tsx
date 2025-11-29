import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validación de email
    if (!formData.email.includes('@')) {
      setError('Por favor ingresa un email válido con @');
      return;
    }
    
    setLoading(true);

    try {
      // Limpiar espacios en blanco
      const cleanData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        password: formData.password,
        telefono: formData.telefono.trim()
      };
      
      await register(cleanData);
      navigate('/');
    } catch (err: unknown) {
      console.error('Error completo de registro:', err);
      const error = err as { code?: string; response?: { data?: { message?: string } }; message?: string };
      
      if (error.code === 'ERR_NETWORK') {
        setError('No se puede conectar al servidor. Verifica que el backend esté corriendo y que la IP sea correcta.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Error al registrarse. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <UserPlus size={48} className="auth-icon" />
          <h1>Crear Cuenta</h1>
          <p>Únete a nuestra plataforma</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
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
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono (Opcional)</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+591 12345678"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
