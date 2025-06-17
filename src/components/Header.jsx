import React from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext'; // To display client ID

function Header() {
  const { clientId } = useNotification();
  return (
    <header className="app-header">
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/reserve">Make Reservation</Link></li>
          <li><Link to="/cancel">Cancel Reservation</Link></li>
          <li><Link to="/promotions">Promotions</Link></li>
        </ul>
      </nav>
      <div className="client-info">
        Client ID: <strong>{clientId}</strong>
      </div>
      <h1>Cruise Reservation System</h1>
    </header>
  );
}

export default Header;