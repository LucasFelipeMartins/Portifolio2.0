const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    tags: [{ type: String }],
    read_time: { type: String },
    views: { type: Number, default: 0 },
    date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema, 'posts');
