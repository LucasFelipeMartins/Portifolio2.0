import { apiClient } from './apiClient.js';

export const postsService = {
    fetchAll: () => apiClient.get('/posts'),
    incrementView: (postId) => apiClient.patch(`/posts/${postId}/view`, {}, { keepalive: true })
        .catch((error) => console.error('Erro na API de views:', error.message))
};
