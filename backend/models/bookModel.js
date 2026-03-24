const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    category: { type: String },
    status: { type: String },
    amazon_link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema, 'books');
