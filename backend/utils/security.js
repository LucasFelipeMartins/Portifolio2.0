const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeString = (value, { maxLength = 255, allowNewLines = false } = {}) => {
    if (value === undefined || value === null) {
        return '';
    }

    const stringValue = String(value).trim();
    const normalizedWhitespace = allowNewLines
        ? stringValue.replace(/[\t\r]+/g, ' ')
        : stringValue.replace(/\s+/g, ' ');

    const strippedHtml = normalizedWhitespace.replace(/[<>]/g, '');
    return strippedHtml.slice(0, maxLength);
};

const sanitizeEmail = (email) => {
    const candidate = sanitizeString(email, { maxLength: 120 }).toLowerCase();
    if (!EMAIL_REGEX.test(candidate)) {
        const error = new Error('E-mail inválido.');
        error.statusCode = 400;
        throw error;
    }
    return candidate;
};

module.exports = {
    sanitizeString,
    sanitizeEmail
};
