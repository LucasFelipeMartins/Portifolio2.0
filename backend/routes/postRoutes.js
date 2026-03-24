const { Router } = require('express');
const postController = require('../controllers/postController');

const router = Router();

router.get('/', postController.getPosts);
router.patch('/:id/view', postController.incrementViews);

module.exports = router;
