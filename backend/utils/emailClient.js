const nodemailer = require('nodemailer');
const dns = require('dns');
const config = require('../config/env');

let cachedTransporter;

const buildTransporter = () => {
    if (!config.email.user || !config.email.pass) {
        throw new Error('Credenciais de e-mail não configuradas. Defina EMAIL_USER e EMAIL_PASS no .env.');
    }

    const {
        host,
        port,
        secure,
        rejectUnauthorized,
        connectionTimeoutMs,
        greetingTimeoutMs,
        socketTimeoutMs,
        family
    } = config.email.smtp;

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user: config.email.user,
            pass: config.email.pass
        },
        tls: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized
        },
        connectionTimeout: connectionTimeoutMs,
        greetingTimeout: greetingTimeoutMs,
        socketTimeout: socketTimeoutMs,
        pool: true,
        maxConnections: 2,
        maxMessages: 50,
        logger: config.nodeEnv !== 'production',
        dnsLookup: (hostname, options, callback) => {
            const lookupOptions = {
                ...(options || {}),
                family,
                all: false
            };
            dns.lookup(hostname, lookupOptions, callback);
        }
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
