import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send } from 'lucide-react';
import api from '../config/api';
import type { Order } from '../types';

const FeedbackForm: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [aspectos, setAspectos] = useState({
    calidadComida: 0,
    tiempoEspera: 0,
    atencion: 0,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.data);
      } catch {
        setError('Error al cargar la orden');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (calificacion === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    if (!aspectos.calidadComida || !aspectos.tiempoEspera || !aspectos.atencion) {
      setError('Por favor califica todos los aspectos');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/feedback', {
        ordenId: orderId,
        calificacion,
        comentario: comentario || undefined,
        aspectos,
      });
      navigate('/orders');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al enviar feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (current: number, setter: (value: number) => void) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= current ? 'active' : ''}`}
            onClick={() => setter(star)}
          >
            <Star size={32} fill={star <= current ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error && !order) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>Califica tu Experiencia</h1>
        <p>Tu opinión nos ayuda a mejorar</p>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        {error && <div className="error-message">{error}</div>}

        <div className="feedback-section">
          <h3>Calificación General</h3>
          {renderStars(calificacion, setCalificacion)}
          {calificacion > 0 && (
            <p className="rating-text">
              {calificacion === 5 && '¡Excelente!'}
              {calificacion === 4 && 'Muy bueno'}
              {calificacion === 3 && 'Bueno'}
              {calificacion === 2 && 'Regular'}
              {calificacion === 1 && 'Necesita mejorar'}
            </p>
          )}
        </div>

        <div className="feedback-section">
          <h3>Aspectos Específicos</h3>
          
          <div className="aspect-rating">
            <label>Calidad de la Comida</label>
            {renderStars(aspectos.calidadComida, (value) =>
              setAspectos({ ...aspectos, calidadComida: value })
            )}
          </div>

          <div className="aspect-rating">
            <label>Tiempo de Espera</label>
            {renderStars(aspectos.tiempoEspera, (value) =>
              setAspectos({ ...aspectos, tiempoEspera: value })
            )}
          </div>

          <div className="aspect-rating">
            <label>Atención al Cliente</label>
            {renderStars(aspectos.atencion, (value) =>
              setAspectos({ ...aspectos, atencion: value })
            )}
          </div>
        </div>

        <div className="feedback-section">
          <h3>Comentarios Adicionales</h3>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Cuéntanos más sobre tu experiencia..."
            rows={5}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          <Send size={18} />
          {submitting ? 'Enviando...' : 'Enviar Opinión'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
