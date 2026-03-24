import { apiClient } from './apiClient.js';

const buildPayload = (overrides = {}) => ({
    page: window.location.pathname,
    referrer: document.referrer || null,
    ...overrides
});

export const analyticsService = {
    trackVisit: async (payload = {}) => {
        try {
            await apiClient.post('/analytics/track', buildPayload(payload), {
                keepalive: true
            });
        } catch (error) {
            if (error.status !== 429) {
                console.warn('Erro ao registrar visita:', error.message);
            }
        }
    }
};
