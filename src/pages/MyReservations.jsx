import React, { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { cancelReservation, getReservations } from '../services/api';

function MyReservations() {
    const { clientId, showNotification } = useNotification();
    const [myReservations, setMyReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReservationsForClient = async () => {
        setLoading(true);
        try {
            const reservations = await getReservations(clientId);
            if (!reservations || reservations.length === 0) {
                showNotification('No reservations found for this client.', 'info');
                return;
            }
            setMyReservations(reservations);
            showNotification('My reservations loaded.', 'info');
        } catch (error) {
            console.error('Failed to fetch my reservations:', error);
            showNotification('Error loading my reservations.', 'error');
        } finally {
        setLoading(false);
        }
  };

    useEffect(() => {
        if (clientId) {
            fetchReservationsForClient();
        }
    }, [clientId]);

    const handleCancel = async (reservationId) => {
        if (window.confirm(`Are you sure you want to cancel reservation ${reservationId}?`)) {
            setLoading(true);
            try {
                const response = await cancelReservation(reservationId);
                showNotification(response.message, 'success');
                setMyReservations(prev => prev.filter(res => res.id !== reservationId));
            } catch (error) {
                console.error('Failed to cancel reservation:', error);
                showNotification(`Error canceling reservation: ${error.message}`, 'error');
            } finally {
                setLoading(false);
            }
        }
  };

    return (
        <section className="my-reservations-page">
            <h2>My Reservations for Client ID: {clientId}</h2>
            {loading && <LoadingSpinner />}
            {myReservations.length > 0 ? (
                <div className="reservations-list">
                {myReservations.flatMap(res => (
                    <div key={res.id} className="card">
                    <h4>Reservation ID: {res.id}</h4>
                    <p>Itinerary ID: {res.itinerary_id}</p>
                    <p>Passengers: {res.passengers}</p>
                    <p>Status: <strong>{res.status.replace(/_/g, ' ')}</strong></p>
                    {res.payment_link && <p>Payment Link: <a href={res.payment_link} target="_blank" rel="noopener noreferrer">{res.payment_link}</a></p>}
                    {res.status !== 'ticket_issued' && res.status !== 'payment_declined' && (
                        <button onClick={() => handleCancel(res.id)} disabled={loading}>
                        Cancel Reservation
                        </button>
                    )}
                    </div>
                ))}
                </div>
            ) : (
                !loading && <p>You have no reservations yet.</p>
            )}
        </section>
  );
}

export default MyReservations;