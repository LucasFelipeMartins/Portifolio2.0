const { getTransporter } = require('../utils/emailClient');
const config = require('../config/env');
const { sanitizeString, sanitizeEmail } = require('../utils/security');

const buildValidationError = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const sendContactMessage = async ({ name, email, message, context = {} }) => {
    const safeName = sanitizeString(name, { maxLength: 80 });
    const safeEmail = sanitizeEmail(email);
    const safeMessage = sanitizeString(message, { maxLength: 2000, allowNewLines: true });

    if (!safeName) {
        throw buildValidationError('Nome é obrigatório.');
    }

    if (!safeMessage) {
        throw buildValidationError('Mensagem é obrigatória.');
    }

    const transporter = getTransporter();
    const recipient = config.email.recipient;
    const sender = config.email.from || config.email.user;

    if (!recipient) {
        const error = new Error('Destinatário do formulário não configurado.');
        error.statusCode = 500;
        throw error;
    }

    const metadata = [];
    if (context.ip) {
        metadata.push(`IP: ${context.ip}`);
    }
    if (context.userAgent) {
        metadata.push(`User-Agent: ${sanitizeString(context.userAgent, { maxLength: 256 })}`);
    }

    const metadataBlock = metadata.length ? `\n---\n${metadata.join('\n')}` : '';
    const metadataHtml = metadata.length
        ? `<hr><pre style="font-family:monospace;white-space:pre-wrap;">${metadata.join('\n')}</pre>`
        : '';

    const textBody = `Nome: ${safeName}\nEmail: ${safeEmail}\n\nMensagem:\n${safeMessage}${metadataBlock}`;
    const htmlBody = `
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Mensagem:</strong><br>${safeMessage.replace(/\n/g, '<br>')}</p>
        ${metadataHtml}
    `;

    const mailOptions = {
        from: sender,
        to: recipient,
        replyTo: safeEmail,
        subject: `[Portfólio] Nova mensagem de ${safeName}`,
        text: textBody,
        html: htmlBody,
        headers: {
            'X-Contact-IP': context.ip || 'n/a',
            'X-Contact-UA': context.userAgent ? sanitizeString(context.userAgent, { maxLength: 256 }) : 'n/a'
        }
    };

    try {
        console.info('📨 Enviando e-mail de contato', {
            to: recipient,
            replyTo: safeEmail
        });
        await transporter.sendMail(mailOptions);
        console.info('✅ E-mail de contato enviado com sucesso');
    } catch (error) {
        console.error('❌ Falha ao enviar e-mail de contato:', {
            message: error.message,
            stack: error.stack
        });
        const mailError = new Error('Não foi possível enviar sua mensagem agora. Tente novamente em instantes.');
        mailError.statusCode = 503;
        mailError.cause = error;
        throw mailError;
    }
};

module.exports = {
    sendContactMessage
};
