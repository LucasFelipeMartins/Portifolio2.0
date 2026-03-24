const postRepository = require('../repositories/postRepository');

const listPosts = () => postRepository.findAll();

const incrementPostViews = async (id) => {
    const result = await postRepository.incrementViews(id);
    if (!result) {
        const error = new Error('Post não encontrado');
        error.statusCode = 404;
        throw error;
    }
};

module.exports = {
    listPosts,
    incrementPostViews
};
