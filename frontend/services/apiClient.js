import { useFetch } from '../hooks/useFetch.js';

const API_BASE_URL = 'http://localhost:3000/api';

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
