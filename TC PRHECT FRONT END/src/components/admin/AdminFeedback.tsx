import React, { useState, useEffect } from 'react';
import { Star, AlertTriangle } from 'lucide-react';
import api from '../../config/api';
import type { Feedback, User, Order } from '../../types';

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState<string>('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/feedback');
      setFeedbacks(response.data.data);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeClass = (nivel: string) => {
    switch (nivel) {
      case 'critico':
        return 'badge-danger';
      case 'alto':
        return 'badge-warning';
      case 'medio':
        return 'badge-info';
      case 'bajo':
        return 'badge-success';
      default:
        return '';
    }
  };

  const getRiskText = (nivel: string) => {
    const texts: Record<string, string> = {
      critico: 'Crítico',
      alto: 'Alto',
      medio: 'Medio',
      bajo: 'Bajo',
    };
    return texts[nivel] || nivel;
  };

  const filteredFeedbacks = riskFilter
    ? feedbacks.filter((fb) => fb.nivelRiesgo === riskFilter)
    : feedbacks;

  const highRiskCount = feedbacks.filter(
    (fb) => fb.nivelRiesgo === 'critico' || fb.nivelRiesgo === 'alto'
  ).length;

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-feedback">
      {highRiskCount > 0 && (
        <div className="alert alert-danger">
          <AlertTriangle size={20} />
          <span>
            Hay {highRiskCount} feedback(s) de riesgo alto/crítico que requieren atención
          </span>
        </div>
      )}

      <div className="admin-filters">
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
          <option value="">Todos los niveles de riesgo</option>
          <option value="critico">Crítico</option>
          <option value="alto">Alto</option>
          <option value="medio">Medio</option>
          <option value="bajo">Bajo</option>
        </select>
      </div>

      <div className="feedback-list">
        {filteredFeedbacks.map((feedback) => {
          const user = feedback.usuarioId as User;
          const order = feedback.ordenId as Order;
          
          const userName = typeof user === 'object' ? user.nombre : 'Usuario';
          const orderId = typeof order === 'object' ? order._id : order;

          return (
            <div key={feedback._id} className="feedback-card">
              <div className="feedback-header">
                <div>
                  <strong>{userName}</strong>
                  <span className="feedback-date">
                    {new Date(feedback.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className={`badge ${getRiskBadgeClass(feedback.nivelRiesgo)}`}>
                  {getRiskText(feedback.nivelRiesgo)}
                </span>
              </div>

              <div className="feedback-rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= feedback.calificacion ? '#F59E0B' : 'none'}
                      stroke={star <= feedback.calificacion ? '#F59E0B' : '#D1D5DB'}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {feedback.calificacion}/5
                </span>
              </div>

              {feedback.comentario && (
                <div className="feedback-comment">
                  <p>{feedback.comentario}</p>
                </div>
              )}

              <div className="feedback-aspects">
                <div className="aspect">
                  <span>Calidad de Comida:</span>
                  <strong>{feedback.aspectos.calidadComida}/5</strong>
                </div>
                <div className="aspect">
                  <span>Tiempo de Espera:</span>
                  <strong>{feedback.aspectos.tiempoEspera}/5</strong>
                </div>
                <div className="aspect">
                  <span>Atención:</span>
                  <strong>{feedback.aspectos.atencion}/5</strong>
                </div>
              </div>

              <div className="feedback-order-info">
                <small>Orden: #{typeof orderId === 'string' ? orderId.slice(-8) : 'N/A'}</small>
              </div>

              {feedback.analisisDetallado && feedback.analisisDetallado.length > 0 && (
                <div className="feedback-analysis">
                  <h4>Análisis de Riesgo:</h4>
                  {feedback.analisisDetallado.map((analisis, idx) => (
                    <div key={idx} className="analysis-item">
                      <strong>{analisis.strategy}:</strong> Score {analisis.score.toFixed(2)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFeedbacks.length === 0 && (
        <div className="empty-state">
          <p>No hay feedback con este filtro</p>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
