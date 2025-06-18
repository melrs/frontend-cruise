import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { connectToReservationStatusSse, connectToGeneralPromotionsSse, disconnectFromSse } from '../services/sseService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [clientId, setClientId] = useState(localStorage.getItem('clientId') || `${Date.now()}`);

  useEffect(() => {
    localStorage.setItem('clientId', clientId);
  }, [clientId]);

  const showNotification = useCallback((message, type = 'info', data = null) => {
    const newNotification = { id: Date.now(), message, type, data, timestamp: new Date() };
    setNotification(newNotification);

    setNotificationHistory(prevHistory => {
      const updatedHistory = [newNotification, ...prevHistory.slice(0, 49)];
      return updatedHistory;
    });

    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    if (clientId) {
      console.log(`Attempting to connect SSE for reservation status for client: ${clientId}`);
      connectToReservationStatusSse(
        clientId,
        (data) => {
          let message = 'Update received!';
          let type = 'info';
          if (data.type === 'payment_approved') {
            message = `Payment Approved for Transaction ID: ${data.data.transaction_id || 'N/A'}. Reservation: ${data.data.reservation_id || 'N/A'}`;
            type = 'success';
          } else if (data.type === 'payment_declined') {
            message = `Payment Declined for Transaction ID: ${data.data.transaction_id || 'N/A'}. Reservation: ${data.data.reservation_id || 'N/A'}`;
            type = 'error';
          } else if (data.type === 'ticket_issued') {
            message = `Ticket Issued! Message: ${data.message}`;
            type = 'success';
          } else if (data.type === 'generic_message') {
            message = `Generic Reservation Update: ${data.message}`;
          }
          showNotification(message, type, data);
        },
        (error) => {
          console.error('SSE Reservation Status Connection Error:', error);
          showNotification('SSE connection error for reservation status. Please refresh.', 'error');
        }
      );


      console.log('Attempting to connect SSE for general promotions.');
      connectToGeneralPromotionsSse(
        clientId,
        (data) => {
          let message = 'New Promotion!';
          let type = 'info';
          if (data.type === 'promotion_update') {
            message = `New Promotion: ${data.message || 'Check out our latest offers!'}`;
            type = 'info';
          } else if (data.type === 'generic_promotion_message') {
            message = `Generic Promotion Update: ${data.message}`;
          }
          showNotification(message, type, data);
        },
        (error) => {
          console.error('SSE General Promotions Connection Error:', error);
          showNotification('SSE connection error for promotions. Please refresh.', 'error');
        }
      );
    }

    return () => {
      disconnectFromSse();
    };
  }, [clientId, showNotification]);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, clearNotification, clientId, notificationHistory }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);