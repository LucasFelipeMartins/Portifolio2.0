import { useFetch } from '../hooks/useFetch.js';

const normalizeOrigin = (origin) => origin?.replace(/\/$/, '') || '';

const resolveBrowserBaseUrl = () => {
    if (typeof window === 'undefined') {
        return 'http://localhost:3000/api';
    }

    if (window.__API_BASE_URL) {
        return window.__API_BASE_URL;
    }

    const origin = normalizeOrigin(window.location.origin);
    if (/localhost|127\.0\.0\.1/.test(origin)) {
        return `${origin}/api`;
    }

    return '/api';
};

const API_BASE_URL = resolveBrowserBaseUrl();

const buildOptions = (method, body, extra = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(extra.headers || {}) };
    const options = { ...extra, method, headers };

    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }

    return options;
};

const request = (path, options) => useFetch(`${API_BASE_URL}${path}`, options);

export const apiClient = {
    get: (path, options = {}) => request(path, { method: 'GET', ...options }),
    post: (path, body, options = {}) => request(path, buildOptions('POST', body, options)),
    patch: (path, body, options = {}) => request(path, buildOptions('PATCH', body, options))
};
