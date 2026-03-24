import { apiClient } from './apiClient.js';

export const contactService = {
    sendMessage: (payload) => apiClient.post('/contact', payload)
};
