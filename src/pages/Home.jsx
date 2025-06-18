import React, { useState, useEffect, useCallback } from 'react';
import { queryItineraries, createReservation, registerPromotionInterest, cancelPromotionInterest } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const [destination, setDestination] = useState('');
  const [boardingDate, setBoardingDate] = useState(''); 
  const [boardingPort, setBoardingPort] = useState('');
  const [itineraries, setItineraries] = useState([]);
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const [itineraryId, setItineraryId] = useState('');
  const [numPassengers, setNumPassengers] = useState('');
  const [numCabins, setNumCabins] = useState('');

  const [isSubscribed, setIsSubscribed] = useState(false);

  const { showNotification, clientId } = useNotification();

  const loadAllItineraries = useCallback(async () => {
    setLoading(true);
    try {
      const results = await queryItineraries({});
      if (results && results.length > 0) {
        setItineraries(results);
        setFilteredItineraries(results);
      } else {
        showNotification('No itineraries found.', 'info');
      }
    } catch (error) {
      console.error('Failed to fetch itineraries:', error);
      showNotification(`Error fetching itineraries: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadAllItineraries();
  }, [loadAllItineraries]);

  const handleFilterSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const params = {
      destination: destination || undefined,
      boarding_date: boardingDate || undefined,
      boarding_port: boardingPort || undefined,
    };

    const results = itineraries.filter(itinerary => {
      let match = true;
      if (params.destination && itinerary.destination.toLowerCase() !== params.destination.toLowerCase()) {
        match = false;
      }
      if (params.boarding_date && itinerary.departure !== params.boarding_date) {
        match = false;
      }
      if (params.boarding_port && itinerary.departurePort.toLowerCase() !== params.boarding_port.toLowerCase()) {
        match = false;
      }
      return match;
    });

    setFilteredItineraries(results);
    if (results.length > 0) {
      showNotification('Itineraries filtered!', 'success');
    } else {
      showNotification('No itineraries found matching criteria.', 'info');
    }
    setLoading(false);
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reservationData = {
        itinerary_id: parseInt(itineraryId),
        passengers: parseInt(numPassengers),
        numberOfCabins: parseInt(numCabins),
        client_id: clientId
      };
      console.log('Submitting reservation data:', reservationData);
      const response = await createReservation(reservationData);
      showNotification(`Reservation successful! Payment link: ${response.payment_link}`, 'success');
      setItineraryId('');
      setNumPassengers('');
      setNumCabins('');
      loadAllItineraries(); 
    } catch (error) {
      console.error('Failed to make reservation:', error);
      showNotification(`Error making reservation: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubscription = async () => {
    setLoading(true);
    try {
      if (isSubscribed) {
        await cancelPromotionInterest(clientId);
        showNotification('Unsubscribed from general promotions!', 'info');
      } else {
        await registerPromotionInterest(clientId);
        showNotification('Subscribed to general promotions!', 'success');
      }
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Failed to toggle promotion subscription:', error);
      showNotification(`Error toggling subscription: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="home-page">
      <h2>Cruise Reservations & Itineraries</h2>
      <div className="promotion-toggle-container">
        <button onClick={handleToggleSubscription} disabled={loading}>
          {isSubscribed ? 'Unsubscribe from Promotions' : 'Subscribe to Promotions'}
        </button>
      </div>

      <div className="reservation-form-container">
        <h3>Make a New Reservation</h3>
        <form onSubmit={handleReservationSubmit} className="reservation-form">
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
      </div>

      {loading && <LoadingSpinner />}

      <div className="filter-section">
        <button onClick={() => setShowFilterOptions(!showFilterOptions)}>
          {showFilterOptions ? 'Hide Filter Options' : 'Show Filter Options'}
        </button>
        {showFilterOptions && (
          <form onSubmit={handleFilterSearch} className="search-form filter-options-form">
            <div className="form-group">
              <label htmlFor="destination">Destination:</label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Caribbean"
              />
            </div>
            <div className="form-group">
              <label htmlFor="boardingDate">Boarding Date (YYYY-MM-DD):</label>
              <input
                type="date"
                id="boardingDate"
                value={boardingDate}
                onChange={(e) => setBoardingDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="boardingPort">Boarding Port:</label>
              <input
                type="text"
                id="boardingPort"
                value={boardingPort}
                onChange={(e) => setBoardingPort(e.target.value)}
                placeholder="e.g., Miami"
              />
            </div>
            <button type="submit" disabled={loading}>Apply Filter</button>
          </form>
        )}
      </div>

      {filteredItineraries.length > 0 ? (
        <div className="itineraries-list">
          <h3>Available Itineraries:</h3>
          {filteredItineraries.map((itinerary) => (
            <div key={itinerary.id} className="card">
              <h4>{itinerary.ship} - {itinerary.destination}</h4>
              <p>Departure: {itinerary.departure} from {itinerary.departurePort}</p>
              <p>Arrival: {itinerary.arrival}</p>
              <p>Stops: {itinerary.stops.join(', ')}</p>
              <p>Nights: {itinerary.nights}</p>
              <p>Price per person: ${itinerary.price}</p>
              <p>Available Cabins: {itinerary.available_cabins}</p>
              <p>Itinerary ID: <strong>{itinerary.id}</strong></p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results-message">No itineraries found matching your criteria.</p>
      )}
    </section>
  );
}

export default Home;