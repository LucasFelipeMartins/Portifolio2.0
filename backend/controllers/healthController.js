const getHealth = (req, res) => {
    res.json({
        status: 'ok',
        message: 'API do Portfólio está rodando! 🚀'
    });
};

module.exports = {
    getHealth
};
