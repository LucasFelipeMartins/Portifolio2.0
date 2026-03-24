const bookRepository = require('../repositories/bookRepository');

const listBooks = () => bookRepository.findAll();

module.exports = {
    listBooks
};
