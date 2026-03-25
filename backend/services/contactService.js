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

    try {
        await transporter.sendMail({
            from: config.email.user,
            to: config.email.user,
            subject: `Portfólio: Mensagem de ${safeName}`,
            text: `Nome: ${safeName}\nEmail: ${safeEmail}\n\nMensagem:\n${safeMessage}${metadataBlock}`,
            replyTo: safeEmail
        });
    } catch (error) {
        console.error('❌ Falha ao enviar e-mail de contato:', error.message);
        const mailError = new Error('Não foi possível enviar sua mensagem agora. Tente novamente em instantes.');
        mailError.statusCode = 503;
        mailError.cause = error;
        throw mailError;
    }
};

module.exports = {
    sendContactMessage
};
