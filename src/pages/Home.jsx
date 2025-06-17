import React, { useState } from 'react';
import { queryItineraries } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const [destination, setDestination]= useState('');
  const [boardingDate, setBoardingDate] = useState(''); 
  const [boardingPort, setBoardingPort] = useState('');
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItineraries([]); 
    try {
      const params = {
        destination: destination || undefined,
        boarding_date: boardingDate || undefined,
        boarding_port: boardingPort || undefined,
      };
      const results = await queryItineraries(params);
      if (results && results.length > 0) {
        setItineraries(results);
        showNotification('Itineraries found!', 'success');
      } else {
        showNotification('No itineraries found matching criteria.', 'info');
      }
    } catch (error) {
      console.error('Failed to fetch itineraries:', error);
      showNotification(`Error fetching itineraries: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="home-page">
      <h2>Search for Cruises</h2>
      <form onSubmit={handleSearch} className="search-form">
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
        <button type="submit" disabled={loading}>Search</button>
      </form>

      {loading && <LoadingSpinner />}

      {itineraries.length > 0 && (
        <div className="itineraries-list">
          <h3>Available Itineraries:</h3>
          {itineraries.map((itinerary) => (
            <div key={itinerary.id} className="itinerary-card">
              <h4>{itinerary.ship} - {itinerary.destination}</h4>
              <p>Departure: {itinerary.departure} from {itinerary.departurePort}</p>
              <p>Arrival: {itinerary.arrival}</p>
              <p>Stops: {itinerary.stops.join(', ')}</p>
              <p>Nights: {itinerary.nights}</p>
              <p>Price per person: ${itinerary.price}</p>
              <p>Available Cabins: {itinerary.available_cabins}</p>
              <p>Itinerary ID: {itinerary.id}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;