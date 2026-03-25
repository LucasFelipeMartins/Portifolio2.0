const Project = require('../models/projectModel');
const Book = require('../models/bookModel');
const Post = require('../models/postModel');

const buildStats = async (Model) => {
    const [count, sample] = await Promise.all([
        Model.countDocuments(),
        Model.find().sort({ createdAt: -1 }).limit(1)
    ]);

    return {
        collection: Model.collection.collectionName,
        count,
        sample: sample[0] || null
    };
};

const getDatabaseSnapshot = async (req, res, next) => {
    try {
        const [projectStats, bookStats, postStats] = await Promise.all([
            buildStats(Project),
            buildStats(Book),
            buildStats(Post)
        ]);

        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            projects: projectStats,
            books: bookStats,
            posts: postStats
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDatabaseSnapshot
};
