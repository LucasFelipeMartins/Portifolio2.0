const { getClientIp } = require('../utils/requestUtils');

const createRateLimiter = ({
    windowMs = 60000,
    max = 60,
    name = 'rateLimiter',
    message = 'Limite de requisições atingido. Tente novamente mais tarde.',
    keyGenerator,
    onLimitReached
} = {}) => {
    const buckets = new Map();

    const getBucket = (key) => {
        const now = Date.now();
        const existing = buckets.get(key);

        if (!existing || existing.expiresAt <= now) {
            const bucket = { count: 0, expiresAt: now + windowMs };
            buckets.set(key, bucket);
            return bucket;
        }

        return existing;
    };

    const cleanup = () => {
        const now = Date.now();
        for (const [key, bucket] of buckets.entries()) {
            if (bucket.expiresAt <= now) {
                buckets.delete(key);
            }
        }
    };

    setInterval(cleanup, windowMs).unref();

    return (req, res, next) => {
        const key = (keyGenerator || getClientIp)(req);
        const bucket = getBucket(`${name}:${key}`);
        bucket.count += 1;

        if (bucket.count > max) {
            if (typeof onLimitReached === 'function') {
                onLimitReached(req);
            }

            const retryAfterSeconds = Math.ceil((bucket.expiresAt - Date.now()) / 1000);
            res.set('Retry-After', retryAfterSeconds.toString());
            return res.status(429).json({ error: message });
        }

        next();
    };
};

module.exports = {
    createRateLimiter
};
