const bookService = require('../services/bookService');

const getBooks = async (req, res, next) => {
    try {
        const books = await bookService.listBooks();
        res.json(books);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBooks
};
