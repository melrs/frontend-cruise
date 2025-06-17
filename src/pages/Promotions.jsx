import React, { useState } from 'react';
import { registerPromotionInterest, cancelPromotionInterest } from '../services/api'; 
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Promotions() {
  const [loading, setLoading] = useState(false);
  const { showNotification, clientId } = useNotification();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      
      const response = await registerPromotionInterest(clientId);
      showNotification(`Subscribed to general promotions! Client ID: ${response.client_id}`, 'success');
    } catch (error) {
      console.error('Failed to subscribe to promotions:', error);
      showNotification(`Error subscribing to promotions: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      
      const response = await cancelPromotionInterest(clientId);
      showNotification(`Unsubscribed from general promotions!`, 'info');
    } catch (error) {
      console.error('Failed to unsubscribe from promotions:', error);
      showNotification(`Error unsubscribing from promotions: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="promotions-page">
      <h2>Promotion Notifications</h2>
      <p>Manage your interest in receiving general cruise promotion updates.</p>
      <div className="button-group">
        <button onClick={handleSubscribe} disabled={loading}>Subscribe to Promotions</button>
        <button onClick={handleUnsubscribe} disabled={loading}>Unsubscribe from Promotions</button>
      </div>
      {loading && <LoadingSpinner />}
    </section>
  );
}

export default Promotions;