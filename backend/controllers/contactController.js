const contactService = require('../services/contactService');
const { getClientIp } = require('../utils/requestUtils');

const validatePayload = (body = {}) => {
    const errors = {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name) {
        errors.name = 'Nome é obrigatório.';
    }
    if (!email) {
        errors.email = 'E-mail é obrigatório.';
    }
    if (!message) {
        errors.message = 'Mensagem é obrigatória.';
    }

    if (Object.keys(errors).length) {
        const validationError = new Error('Falha na validação do formulário.');
        validationError.statusCode = 400;
        validationError.details = errors;
        throw validationError;
    }

    return { name, email, message };
};

const sendMessage = async (req, res, next) => {
    try {
        const { name, email, message } = validatePayload(req.body);
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
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message,
                ...(error.details ? { details: error.details } : {})
            });
        }
        return next(error);
    }
};

module.exports = {
    sendMessage
};
