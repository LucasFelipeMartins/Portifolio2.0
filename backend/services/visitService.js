const axios = require('axios');
const visitRepository = require('../repositories/visitRepository');
const { sanitizeString } = require('../utils/security');

const sanitizeIp = (ipAddress) => {
    if (!ipAddress) return '8.8.8.8';
    if (ipAddress === '::1' || ipAddress === '127.0.0.1') return '8.8.8.8';
    return ipAddress.split(',')[0].trim();
};

const resolveLocation = async (ip) => {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const data = response.data || {};
        return {
            city: data.city || 'Desconhecido',
            region: data.regionName || 'Desconhecido',
            country: data.country || 'Brasil'
        };
    } catch (error) {
        return {
            city: 'Desconhecido',
            region: 'Desconhecido',
            country: 'Brasil'
        };
    }
};

const registerVisit = async ({ ip, userAgent, page, referrer, eventId, source }) => {
    const sanitizedIp = sanitizeIp(ip);
    const location = await resolveLocation(sanitizedIp);

    if (!eventId) {
        throw new Error('eventId é obrigatório para registrar visitas.');
    }

    const payload = {
        eventId,
        ip: sanitizedIp,
        device: sanitizeString(userAgent, { maxLength: 256 }) || 'unknown',
        location,
        pageVisited: sanitizeString(page, { maxLength: 128 }) || '/',
        referrer: sanitizeString(referrer, { maxLength: 256 }) || null,
        metadata: {
            source: sanitizeString(source, { maxLength: 32 }) || 'unknown'
        }
    };

    try {
        await visitRepository.create(payload);
    } catch (error) {
        if (error.code === 11000) {
            console.debug('Evento de analytics duplicado ignorado', { eventId });
            return;
        }
        throw error;
    }
};

module.exports = {
    registerVisit
};
