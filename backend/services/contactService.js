const { getTransporter } = require('../utils/emailClient');
const config = require('../config/env');
const { sanitizeString, sanitizeEmail } = require('../utils/security');

const sendContactMessage = async ({ name, email, message, context = {} }) => {
    const safeName = sanitizeString(name, { maxLength: 80 });
    const safeEmail = sanitizeEmail(email);
    const safeMessage = sanitizeString(message, { maxLength: 2000, allowNewLines: true });

    if (!safeName || !safeMessage) {
        const error = new Error('Campos obrigatórios faltando.');
        error.statusCode = 400;
        throw error;
    }

    const transporter = getTransporter();

    const metadata = [];
    if (context.ip) {
        metadata.push(`IP: ${context.ip}`);
    }
    if (context.userAgent) {
        metadata.push(`User-Agent: ${sanitizeString(context.userAgent, { maxLength: 256 })}`);
    }

    const metadataBlock = metadata.length ? `\n---\n${metadata.join('\n')}` : '';

    await transporter.sendMail({
        from: config.email.user,
        to: config.email.user,
        subject: `Portfólio: Mensagem de ${safeName}`,
        text: `Nome: ${safeName}\nEmail: ${safeEmail}\n\nMensagem:\n${safeMessage}${metadataBlock}`,
        replyTo: safeEmail
    });
};

module.exports = {
    sendContactMessage
};
