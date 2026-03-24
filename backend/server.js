const config = require('./config/env');
const { connectDatabase } = require('./config/database');
const app = require('./app');

const startServer = async () => {
    await connectDatabase();

    app.listen(config.port, () => {
        console.log(`Servidor rodando na porta ${config.port} 🚀`);
    });
};

startServer();
