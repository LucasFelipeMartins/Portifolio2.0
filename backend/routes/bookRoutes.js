const { Router } = require('express');
const bookController = require('../controllers/bookController');

const router = Router();

router.get('/', bookController.getBooks);

module.exports = router;
