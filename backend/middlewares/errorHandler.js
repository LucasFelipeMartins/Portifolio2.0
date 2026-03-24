const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    console.error('❌ API Error:', {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method
    });

    const payload = {
        error: err.message || 'Erro interno do servidor'
    };

    if (process.env.NODE_ENV !== 'production' && err.stack) {
        payload.stack = err.stack;
    }

    res.status(statusCode).json(payload);
};

module.exports = errorHandler;
