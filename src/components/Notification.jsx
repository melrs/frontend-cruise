import React, { useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import './Notification.css';

function Notification({ message, type }) {
  const { clearNotification } = useNotification();

  useEffect(() => {
    const timer = setTimeout(() => {
      clearNotification();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, type, clearNotification]);

  if (!message) return null;

  return (
    <div className={`notification-container ${type}`}>
      <p>{message}</p>
      <button onClick={clearNotification} className="close-button">X</button>
    </div>
  );
}

export default Notification;