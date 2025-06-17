import React, { useState } from 'react';
import { cancelReservation } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

function CancelReservation() {
  const [reservationId, setReservationId] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await cancelReservation(reservationId);
      showNotification(`Cancellation request initiated: ${response.message}`, 'success');
      setReservationId('');
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      showNotification(`Error cancelling reservation: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cancel-reservation-page">
      <h2>Cancel a Reservation</h2>
      <form onSubmit={handleSubmit} className="cancel-form">
        <div className="form-group">
          <label htmlFor="reservationId">Reservation Id:</label>
          <input
            type="text"
            id="reservationId"
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
            required
            placeholder="e.g., XYZ123"
          />
        </div>
        <button type="submit" disabled={loading}>Cancel Reservation</button>
      </form>
      {loading && <LoadingSpinner />}
    </section>
  );
}

export default CancelReservation;