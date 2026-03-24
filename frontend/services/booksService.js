import { apiClient } from './apiClient.js';

export const booksService = {
    fetchAll: () => apiClient.get('/books')
};
