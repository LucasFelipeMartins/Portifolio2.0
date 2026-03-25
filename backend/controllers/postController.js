const postService = require('../services/postService');

const getPosts = async (req, res, next) => {
    try {
        const posts = await postService.listPosts();
        console.info(`[Posts] ${posts.length} registros enviados para ${req.ip} às ${new Date().toISOString()}`);
        res.json(posts);
    } catch (error) {
        next(error);
    }
};

const incrementViews = async (req, res, next) => {
    try {
        await postService.incrementPostViews(req.params.id);
        console.info(`[Posts] Visualização contabilizada para ${req.params.id}`);
        res.json({ message: 'Visualização contabilizada' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPosts,
    incrementViews
};
