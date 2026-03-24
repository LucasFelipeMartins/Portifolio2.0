export const useFetch = async (url, options = {}) => {
    const response = await fetch(url, options);
    let data = null;

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    if (isJson) {
        data = await response.json();
    }

    if (!response.ok) {
        const error = new Error(data?.error || 'Erro na requisição');
        error.status = response.status;
        throw error;
    }

    return data;
};
