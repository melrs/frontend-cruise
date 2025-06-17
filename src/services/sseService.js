const SSE_BASE_URL = 'http://localhost:5000/sse';

let eventSource = null;
let activeChannelType = null;
let activeClientId = null;

/**
 * @param {string} clientId\
 * @param {function} onStatusUpdateCallback
 * @param {function} onErrorCallback
 */
export const connectToReservationStatusSse = (clientId, onStatusUpdateCallback, onErrorCallback) => {
  const channelName = `reservation-status-${clientId}`;

  if (eventSource && eventSource.readyState !== EventSource.CLOSED && activeChannelType === 'reservation_status' && activeClientId === clientId) {
    console.log(`Already connected to reservation status SSE for client ID: ${clientId}.`);
    return;
  }

  if (eventSource) {
    eventSource.close();
    console.log('Previous SSE connection closed.');
  }

  activeChannelType = clientId;
  activeClientId = clientId;

  const sseUrl = `${SSE_BASE_URL}?channel=${channelName}`;

  eventSource = new EventSource(sseUrl);
  console.log(`Attempting to connect to SSE for reservation status at: ${sseUrl}`);

  eventSource.addEventListener('payment_approved', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('SSE: Payment Approved:', data);
      if (onStatusUpdateCallback) {
        onStatusUpdateCallback({ type: 'payment_approved', ...data });
      }
    } catch (e) {
      console.error('Error parsing payment_approved event:', e, 'Data:', event.data);
    }
  });

  eventSource.addEventListener('payment_declined', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('SSE: Payment Declined:', data);
      if (onStatusUpdateCallback) {
        onStatusUpdateCallback({ type: 'payment_declined', ...data });
      }
    } catch (e) {
      console.error('Error parsing payment_declined event:', e, 'Data:', event.data);
    }
  });

  eventSource.addEventListener('ticket_issued', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('SSE: Ticket Issued:', data);
      if (onStatusUpdateCallback) {
        onStatusUpdateCallback({ type: 'ticket_issued', ...data });
      }
    } catch (e) {
      console.error('Error parsing ticket_issued event:', e, 'Data:', event.data);
    }
  });

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('SSE Generic Message:', data);
      if (onStatusUpdateCallback) {
        onStatusUpdateCallback({ type: 'generic_message', ...data });
      }
    } catch (e) {
      console.error('Error parsing generic SSE message:', e, 'Data:', event.data);
    }
  };

  eventSource.onopen = () => {
    console.log('SSE connection for reservation status opened.');
  };

  eventSource.onerror = (error) => {
    console.error('SSE Error for reservation status:', error);
    if (onErrorCallback) {
      onErrorCallback(error);
    }
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log('SSE reservation status connection closed unexpectedly. Reconnection recommended.');
    }
  };
};

/**
 * @param {string} clientId\
 * @param {function} onPromotionUpdateCallback
 * @param {function} onErrorCallback
 */
export const connectToGeneralPromotionsSse = (clientId, onPromotionUpdateCallback, onErrorCallback) => {
  const channelName = `promotions-${clientId}`;

  console.log(`Connecting to general promotions SSE on channel: ${channelName}`);

  if (eventSource && eventSource.readyState !== EventSource.CLOSED && activeChannelType === 'promotions') {
    console.log(`Already connected to general promotions SSE.`);
    return;
  }

  if (eventSource) {
    eventSource.close();
    console.log('Previous SSE connection closed.');
  }

  activeChannelType = 'promotions';
  activeClientId = null;

  const sseUrl = `${SSE_BASE_URL}?channel=${channelName}`;

  eventSource = new EventSource(sseUrl);
  console.log(`Attempting to connect to SSE for general promotions at: ${sseUrl}`);

  eventSource.addEventListener('promotion', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('SSE: General Promotion Update:', data);
      if (onPromotionUpdateCallback) {
        onPromotionUpdateCallback({ type: 'promotion_update', ...data });
      }
    } catch (e) {
      console.error('Error parsing promotion event:', e, 'Data:', event.data);
    }
  });

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('SSE Generic Message (General Promotions):', data);
      if (onPromotionUpdateCallback) {
        onPromotionUpdateCallback({ type: 'generic_promotion_message', ...data });
      }
    } catch (e) {
      console.error('Error parsing generic SSE message (general promotions):', e, 'Data:', event.data);
    }
  };

  eventSource.onopen = () => {
    console.log('SSE connection for general promotions opened.');
  };

  eventSource.onerror = (error) => {
    console.error('SSE Error for general promotions:', error);
    if (onErrorCallback) {
      onErrorCallback(error);
    }
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log('SSE general promotions connection closed unexpectedly. Reconnection recommended.');
    }
  };
};


export const disconnectFromSse = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    activeChannelType = null;
    activeClientId = null;
    console.log('SSE connection closed manually.');
  }
};