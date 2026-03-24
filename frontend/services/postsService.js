import { apiClient } from './apiClient.js';

const API_BASE_URL = 'http://localhost:3000/api';

export const postsService = {
    fetchAll: () => apiClient.get('/posts'),
    incrementView: (postId) => fetch(`${API_BASE_URL}/posts/${postId}/view`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true
    }).catch((error) => console.error('Erro na API de views:', error.message))
};
