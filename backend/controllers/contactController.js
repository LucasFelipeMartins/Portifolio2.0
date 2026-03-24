const contactService = require('../services/contactService');
const { getClientIp } = require('../utils/requestUtils');

const sendMessage = async (req, res, next) => {
    try {
        const { name, email, message } = req.body || {};
        await contactService.sendContactMessage({
            name,
            email,
            message,
            context: {
                ip: getClientIp(req),
                userAgent: req.headers['user-agent']
            }
        });
        res.json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendMessage
};
