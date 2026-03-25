const dotenv = require('dotenv');

dotenv.config();

const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    mongoUri: process.env.MONGO_URI,
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        smtp: {
            host: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_SMTP_PORT ?? '587', 10),
            secure: process.env.EMAIL_SMTP_SECURE === 'true',
            requireTLS: process.env.EMAIL_SMTP_REQUIRE_TLS !== 'false',
            rejectUnauthorized: process.env.EMAIL_SMTP_REJECT_UNAUTHORIZED !== 'false',
            connectionTimeoutMs: parseInt(process.env.EMAIL_SMTP_CONN_TIMEOUT ?? '20000', 10),
            greetingTimeoutMs: parseInt(process.env.EMAIL_SMTP_GREET_TIMEOUT ?? '20000', 10),
            socketTimeoutMs: parseInt(process.env.EMAIL_SMTP_SOCKET_TIMEOUT ?? '30000', 10),
            family: parseInt(process.env.EMAIL_SMTP_FAMILY ?? '4', 10) || 4
        }
    },
    security: {
        contactRateLimit: {
            windowMs: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? '60000', 10),
            maxRequests: parseInt(process.env.CONTACT_RATE_LIMIT_MAX ?? '5', 10)
        },
        captcha: {
            provider: process.env.CAPTCHA_PROVIDER || 'recaptcha',
            siteKey: process.env.RECAPTCHA_SITE_KEY,
            secretKey: process.env.RECAPTCHA_SECRET_KEY,
            minimumScore: parseFloat(process.env.RECAPTCHA_MIN_SCORE ?? '0.5')
        }
    },
    analytics: {
        rateLimit: {
            windowMs: parseInt(process.env.ANALYTICS_RATE_WINDOW_MS ?? '60000', 10),
            maxEventsPerWindow: parseInt(process.env.ANALYTICS_RATE_MAX_EVENTS ?? '120', 10)
        },
        dedupeWindowMs: parseInt(process.env.ANALYTICS_DEDUPE_WINDOW_MS ?? '300000', 10),
        retry: {
            maxAttempts: parseInt(process.env.ANALYTICS_RETRY_ATTEMPTS ?? '5', 10),
            baseDelayMs: parseInt(process.env.ANALYTICS_RETRY_BASE_DELAY_MS ?? '2000', 10),
            maxDelayMs: parseInt(process.env.ANALYTICS_RETRY_MAX_DELAY_MS ?? '60000', 10)
        }
    }
};

if (!config.mongoUri) {
    throw new Error('MONGO_URI não foi definido no arquivo .env');
}

if (!config.email.user || !config.email.pass) {
    console.warn('⚠️  Variáveis EMAIL_USER e EMAIL_PASS não foram definidas. A rota /api/contact ficará indisponível.');
}

if (!config.security.captcha.siteKey || !config.security.captcha.secretKey) {
    console.warn('⚠️  RECAPTCHA_SITE_KEY ou RECAPTCHA_SECRET_KEY não foram definidos. O formulário de contato permanecerá bloqueado.');
}

module.exports = config;
