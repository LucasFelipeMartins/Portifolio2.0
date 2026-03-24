const { verifyCaptchaToken } = require('../utils/captcha');
const { getClientIp } = require('../utils/requestUtils');

const captchaMiddleware = async (req, res, next) => {
    try {
        const token = req.body?.captchaToken;
        await verifyCaptchaToken(token, getClientIp(req));
        if (req.body) {
            delete req.body.captchaToken;
        }
        next();
    } catch (error) {
        const statusCode = error.statusCode || 400;
        res.status(statusCode).json({ error: error.message, details: error.details || undefined });
    }
};

module.exports = captchaMiddleware;
