const { Router } = require('express');
const projectController = require('../controllers/projectController');

const router = Router();

router.get('/', projectController.getProjects);

module.exports = router;
