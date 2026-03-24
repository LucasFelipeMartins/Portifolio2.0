const analyticsQueue = require('../queues/analyticsQueue');
const { getClientIp, isApiRequest, isStaticAssetRequest } = require('../utils/requestUtils');

const analyticsMiddleware = (req, res, next) => {
    if (!isApiRequest(req.path || '') && !isStaticAssetRequest(req.path || '')) {
        const enqueueResult = analyticsQueue.enqueueVisitEvent({
            ip: getClientIp(req),
            userAgent: req.headers['user-agent'],
            page: req.originalUrl || req.path || '/',
            referrer: req.headers.referer || null,
            source: 'middleware'
        });

        if (!enqueueResult.accepted && enqueueResult.reason !== 'duplicate') {
            console.debug('Analytics descartado:', enqueueResult.reason);
        }
    }

    next();
};

module.exports = analyticsMiddleware;
