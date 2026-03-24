const { Router } = require('express');
const contactController = require('../controllers/contactController');
const { createRateLimiter } = require('../middlewares/rateLimiter');
const captchaMiddleware = require('../middlewares/captchaMiddleware');
const config = require('../config/env');

const router = Router();

const contactRateLimiter = createRateLimiter({
	windowMs: config.security.contactRateLimit.windowMs,
	max: config.security.contactRateLimit.maxRequests,
	name: 'contact',
	message: 'Limite de mensagens atingido. Aguarde e tente novamente.'
});

router.post('/', contactRateLimiter, captchaMiddleware, contactController.sendMessage);

module.exports = router;
