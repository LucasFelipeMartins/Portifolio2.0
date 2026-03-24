const Post = require('../models/postModel');

const findAll = () => Post.find().sort({ createdAt: -1 });

const incrementViews = (id) => Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

module.exports = {
    findAll,
    incrementViews
};
