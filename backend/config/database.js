const mongoose = require('mongoose');
const config = require('./env');

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('🍃 MongoDB conectado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar no MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = { connectDatabase };
