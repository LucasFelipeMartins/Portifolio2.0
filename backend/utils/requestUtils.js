const STATIC_ASSET_REGEX = /(\.jpg|\.jpeg|\.png|\.gif|\.ico|\.svg|\.css|\.js|\.map)$/i;

const getClientIp = (req) => {
    if (!req) return '0.0.0.0';
    const forwarded = req.headers?.['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    if (req.socket?.remoteAddress) {
        return req.socket.remoteAddress;
    }
    return req.ip || '0.0.0.0';
};

const isStaticAssetRequest = (path = '') => STATIC_ASSET_REGEX.test(path);

const isApiRequest = (path = '') => path.startsWith('/api');

module.exports = {
    getClientIp,
    isStaticAssetRequest,
    isApiRequest
};
