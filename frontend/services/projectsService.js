import { apiClient } from './apiClient.js';

export const projectsService = {
    fetchAll: () => apiClient.get('/projects')
};
