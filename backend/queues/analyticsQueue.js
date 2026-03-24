const crypto = require('crypto');
const visitService = require('../services/visitService');
const config = require('../config/env');
const { sanitizeString } = require('../utils/security');

const queue = [];
let workerRunning = false;

const generateId = () => (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'));

const ipBuckets = new Map();
const dedupeCache = new Map();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const computeBackoff = (attempt) => {
    const base = config.analytics.retry.baseDelayMs;
    const maxDelay = config.analytics.retry.maxDelayMs;
    const delay = base * Math.pow(2, attempt - 1);
    return Math.min(delay, maxDelay);
};

const getIpBucket = (ipKey) => {
    const now = Date.now();
    const bucket = ipBuckets.get(ipKey);

    if (!bucket || bucket.expiresAt <= now) {
        const fresh = { count: 0, expiresAt: now + config.analytics.rateLimit.windowMs };
        ipBuckets.set(ipKey, fresh);
        return fresh;
    }

    return bucket;
};

const registerIpHit = (ip) => {
    const ipKey = sanitizeString(ip, { maxLength: 64 }) || 'anonymous';
    const bucket = getIpBucket(ipKey);
    bucket.count += 1;
    return bucket.count <= config.analytics.rateLimit.maxEventsPerWindow;
};

const createFingerprint = ({ ip, page, userAgent }) => {
    const normalizedIp = sanitizeString(ip, { maxLength: 64 }) || 'anonymous';
    const normalizedPage = sanitizeString(page, { maxLength: 128 }) || '/';
    const normalizedUa = sanitizeString(userAgent, { maxLength: 180 }) || 'unknown';
    return crypto.createHash('sha1').update(`${normalizedIp}|${normalizedPage}|${normalizedUa}`).digest('hex');
};

const isDuplicateEvent = (fingerprint) => {
    const now = Date.now();
    const existing = dedupeCache.get(fingerprint);
    if (existing && existing + config.analytics.dedupeWindowMs > now) {
        return true;
    }
    dedupeCache.set(fingerprint, now);
    return false;
};

const cleanupCaches = () => {
    const now = Date.now();
    for (const [fingerprint, timestamp] of dedupeCache.entries()) {
        if (timestamp + config.analytics.dedupeWindowMs <= now) {
            dedupeCache.delete(fingerprint);
        }
    }

    for (const [ipKey, bucket] of ipBuckets.entries()) {
        if (bucket.expiresAt <= now) {
            ipBuckets.delete(ipKey);
        }
    }
};

setInterval(cleanupCaches, config.analytics.dedupeWindowMs).unref();

const runWorker = async () => {
    if (workerRunning) {
        return;
    }

    workerRunning = true;

    while (queue.length) {
        queue.sort((a, b) => a.nextRunAt - b.nextRunAt);
        const job = queue[0];
        const waitTime = job.nextRunAt - Date.now();

        if (waitTime > 0) {
            await wait(Math.min(waitTime, 1000));
            continue;
        }

        queue.shift();

        try {
            await visitService.registerVisit(job.payload);
        } catch (error) {
            job.attempts += 1;
            if (job.attempts <= config.analytics.retry.maxAttempts) {
                job.nextRunAt = Date.now() + computeBackoff(job.attempts);
                queue.push(job);
            } else {
                console.error('❌ Falha definitiva ao processar evento de analytics', {
                    jobId: job.id,
                    eventId: job.payload.eventId,
                    error: error.message
                });
            }
            continue;
        }
    }

    workerRunning = false;
};

const enqueueVisitEvent = (eventPayload = {}) => {
    const ipAddress = eventPayload.ip || '0.0.0.0';
    const accepted = registerIpHit(ipAddress);
    if (!accepted) {
        return { accepted: false, reason: 'rate-limit' };
    }

    const fingerprint = createFingerprint({ ...eventPayload, ip: ipAddress });
    if (isDuplicateEvent(fingerprint)) {
        return { accepted: false, reason: 'duplicate' };
    }

    const job = {
        id: generateId(),
        attempts: 0,
        nextRunAt: Date.now(),
        payload: {
            ...eventPayload,
            ip: ipAddress,
            eventId: generateId()
        }
    };

    queue.push(job);
    runWorker();

    return { accepted: true };
};

module.exports = {
    enqueueVisitEvent
};
