import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

function Header() {
  const { clientId, notification, notificationHistory } = useNotification();
  const [showNotificationHistory, setShowNotificationHistory] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotificationHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const BellIconSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.93 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z"/>
    </svg>
  );

  const ShipIconSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M178-80h-58v-60h58q40 0 79-11t76-34q35 22 72 32.5t75 10.5q38 0 75-10.5t72-32.5q38 23 77.5 34t78.5 11h57v60h-57q-39 0-78-9t-77-28q-38 19-75 28t-73 9q-36 0-73-9.5T333-117q-38 18-77.5 27.5T178-80Zm302-149q-36 0-75.5-20.5T330-307q-33 33-71 52.5T182-230l-71-245q-4-12 2-22.5t18-14.5l55-16v-190q0-25 17.5-42.5T246-778h132v-103h204v103h132q25 0 42.5 17.5T774-718v190l55 16q12 4 18 14.5t2 22.5l-71 245q-39-5-77-24.5T630-307q-35 37-74.5 57.5T480-229Zm1-60q32 0 58.5-18t47.5-43l41-48 36 38q16 17 34 31t38 25l48-159-304-92-304 92 48 159q20-11 38-25t34-31l36-38 41 48q22 25 49 43t59 18ZM246-547l234-71 234 72v-172H246v171Zm234 125Z"/></svg>
  );


  const NotificationHistoryDropdown = () => {
    if (!showNotificationHistory) return null;

    return (
      <div className="notification-history-dropdown" ref={dropdownRef}>
        <h3>Notification History</h3>
        {notificationHistory.length > 0 ? (
          <ul>
            {notificationHistory.map((notif) => (
              <li key={notif.id} className={notif.type}>
                {notif.message}
                <span className="timestamp">{notif.timestamp.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No past notifications.</p>
        )}
      </div>
    );
  };

  return (
    <header className="app-header">
      {/* Logo no canto superior esquerdo */}
      <Link to="/" className="logo-container">
        <ShipIconSVG />
        <span className="logo-text">Cruise System</span>
      </Link>

      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/my-reservations">My Reservations</Link></li>
        </ul>
      </nav>

      <div className="header-right-section">
        <div className="client-info">
          Client ID: <strong>{clientId}</strong>
        </div>
        <div className="notification-bell-container">
          <button className="notification-bell-button" onClick={() => setShowNotificationHistory(!showNotificationHistory)}>
            <BellIconSVG />
            {notification && <span className="notification-indicator">!</span>}
          </button>
          <NotificationHistoryDropdown />
        </div>
      </div>
    </header>
  );
}

export default Header;