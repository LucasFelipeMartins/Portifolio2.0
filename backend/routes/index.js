const { Router } = require('express');
const healthController = require('../controllers/healthController');
const diagnosticsController = require('../controllers/diagnosticsController');
const projectRoutes = require('./projectRoutes');
const bookRoutes = require('./bookRoutes');
const postRoutes = require('./postRoutes');
const contactRoutes = require('./contactRoutes');
const visitRoutes = require('./visitRoutes');

const router = Router();

router.get('/health', healthController.getHealth);
router.get('/test/db', diagnosticsController.getDatabaseSnapshot);
router.use('/projects', projectRoutes);
router.use('/books', bookRoutes);
router.use('/posts', postRoutes);
router.use('/contact', contactRoutes);
router.use('/analytics', visitRoutes);

module.exports = router;
