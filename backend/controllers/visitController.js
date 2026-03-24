const analyticsQueue = require('../queues/analyticsQueue');
const { getClientIp } = require('../utils/requestUtils');

const trackVisit = (req, res, next) => {
    try {
        const enqueueResult = analyticsQueue.enqueueVisitEvent({
            ip: getClientIp(req),
            userAgent: req.headers['user-agent'],
            page: req.body?.page || req.headers.referer || req.originalUrl || '/',
            referrer: req.body?.referrer || req.headers.referer || null,
            source: 'api'
        });

        if (!enqueueResult.accepted) {
            if (enqueueResult.reason === 'rate-limit') {
                return res.status(429).json({ error: 'Limite de eventos de analytics atingido.' });
            }
            return res.status(202).json({ status: 'ignored', reason: enqueueResult.reason });
        }

        return res.status(202).json({ status: 'queued' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    trackVisit
};
