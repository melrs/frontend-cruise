import React, { useState } from 'react';
import { createReservation } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Reserve() {
  const [itineraryId, setItineraryId] = useState('');
  const [numPassengers, setNumPassengers] = useState('');
  const [numCabins, setNumCabins] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification, clientId } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reservationData = {
        itinerary_id: parseInt(itineraryId),
        passengers: parseInt(numPassengers),
        numberOfCabins: parseInt(numCabins),
        client_id: clientId
      };
      const response = await createReservation(reservationData);
      showNotification(`Reservation successful! Payment link: ${response.payment_link}`, 'success');
      setItineraryId('');
      setNumPassengers('');
      setNumCabins('');
    } catch (error) {
      console.error('Failed to make reservation:', error);
      showNotification(`Error making reservation: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reserve-page">
      <h2>Make a New Reservation</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-group">
          <label htmlFor="itineraryId">Itinerary ID:</label>
          <input
            type="number"
            id="itineraryId"
            value={itineraryId}
            onChange={(e) => setItineraryId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numPassengers">Number of Passengers:</label>
          <input
            type="number"
            id="numPassengers"
            value={numPassengers}
            onChange={(e) => setNumPassengers(e.target.value)}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numCabins">Number of Cabins:</label>
          <input
            type="number"
            id="numCabins"
            value={numCabins}
            onChange={(e) => setNumCabins(e.target.value)}
            min="1"
            required
          />
        </div>
        <button type="submit" disabled={loading}>Confirm Reservation</button>
      </form>
      {loading && <LoadingSpinner />}
    </section>
  );
}

export default Reserve;