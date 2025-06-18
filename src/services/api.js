import axios from 'axios';

const MS_RESERVE_BASE_URL = 'http://localhost:5000/api/reserve';

const reservaApi = axios.create({
    baseURL: MS_RESERVE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * @param {object} params
 * @returns {Promise<array>}
 */
export const queryItineraries = async (params) => {
    try {
        const response = await reservaApi.get('/itineraries', { params });
        return response.data;
    } catch (error) {
        console.error('Error querying itineraries:', error);
        throw error;
    }
};

/**
 * @param {object} reservationData 
 * @returns {Promise<object>}
 */
export const createReservation = async (reservationData) => {
    try {
        const response = await reservaApi.post('/new', reservationData);
        return response.data;
    } catch (error) {
        console.error('Error creating reservation:', error);
        throw error;
    }
};

/**
 * @param {int} clientId 
 * @returns {Promise<object>}
 */
export const getReservations = async (clientId) => {
    try {
        const response = await reservaApi.get(`/list/${clientId}`);
        console.log('Reservations fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting reservations:', error);
        throw error;
    }
};

/**. 
 * @param {string} reservationId
 * @returns {Promise<object>}
 */
export const cancelReservation = async (reservationId) => {
    try {
        const response = await reservaApi.delete(`/cancel/${reservationId}`);
        return response.data;
    } catch (error) {
        console.error('Error canceling reservation:', error);
        throw error;
    }
};

/**
 * @param {string} clientId 
 * @returns {Promise<object>}
 */
export const registerPromotionInterest = async (clientId) => {
    try {
        const response = await reservaApi.post('/promotions/subscribe', { "client_id": clientId });
        return response.data;
    } catch (error) {
        console.error('Error registering promotion interest:', error);
        throw error;
    }
};

/**
 * @param {string} clientId
 * @returns {Promise<object>}
 */
export const cancelPromotionInterest = async (clientId) => {
    try {
        const response = await reservaApi.post('/promotions/unsubscribe', { "client_id": clientId });
        return response.data;
    } catch (error) {
        console.error('Error canceling promotion interest:', error);
        throw error;
    }
};