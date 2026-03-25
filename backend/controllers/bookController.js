const bookService = require('../services/bookService');

const getBooks = async (req, res, next) => {
    try {
        const books = await bookService.listBooks();
        console.info(`[Books] ${books.length} registros enviados para ${req.ip} às ${new Date().toISOString()}`);
        res.json(books);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBooks
};
