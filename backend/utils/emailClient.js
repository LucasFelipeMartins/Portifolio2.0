const nodemailer = require('nodemailer');
const config = require('../config/env');

let cachedTransporter;

const buildTransporter = () => {
    if (!config.email.user || !config.email.pass) {
        throw new Error('Credenciais de e-mail não configuradas. Defina EMAIL_USER e EMAIL_PASS no .env.');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email.user,
            pass: config.email.pass
        },
        tls: { rejectUnauthorized: false }
    });
};

const getTransporter = () => {
    if (!cachedTransporter) {
        cachedTransporter = buildTransporter();
    }
    return cachedTransporter;
};

module.exports = {
    getTransporter
};
