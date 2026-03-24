const Book = require('../models/bookModel');

const findAll = () => Book.find().sort({ createdAt: -1 });

module.exports = {
    findAll
};
