const axios = require('axios');
const config = require('../config/env');

const verifyCaptchaToken = async (token, remoteIp) => {
    if (!config.security?.captcha?.secretKey) {
        const error = new Error('CAPTCHA não configurado.');
        error.statusCode = 503;
        throw error;
    }

    if (!token) {
        const error = new Error('Token de CAPTCHA ausente.');
        error.statusCode = 400;
        throw error;
    }

    const params = new URLSearchParams();
    params.append('secret', config.security.captcha.secretKey);
    params.append('response', token);
    if (remoteIp) {
        params.append('remoteip', remoteIp);
    }

    let response;
    try {
        response = await axios.post('https://www.google.com/recaptcha/api/siteverify', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 5000
        });
    } catch (networkError) {
        const error = new Error('Não foi possível validar o CAPTCHA no momento.');
        error.statusCode = 502;
        error.details = networkError.message;
        throw error;
    }

    const data = response.data || {};

    if (!data.success) {
        const error = new Error('Falha na validação do CAPTCHA.');
        error.statusCode = 400;
        error.details = data['error-codes'] || [];
        throw error;
    }

    if (typeof data.score === 'number' && data.score < config.security.captcha.minimumScore) {
        const error = new Error('Score de CAPTCHA insuficiente.');
        error.statusCode = 400;
        throw error;
    }

    return data;
};

module.exports = {
    verifyCaptchaToken
};
