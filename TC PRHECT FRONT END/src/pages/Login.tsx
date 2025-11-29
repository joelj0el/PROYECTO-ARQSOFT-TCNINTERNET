import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validación básica
    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido con @');
      return;
    }
    
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err: unknown) {
      console.error('Error completo de login:', err);
      const error = err as { code?: string; response?: { data?: { message?: string } }; message?: string };
      
      if (error.code === 'ERR_NETWORK') {
        setError('No se puede conectar al servidor. Verifica que el backend esté corriendo y que la IP sea correcta.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LogIn size={48} className="auth-icon" />
          <h1>Iniciar Sesión</h1>
          <p>Bienvenido de vuelta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
