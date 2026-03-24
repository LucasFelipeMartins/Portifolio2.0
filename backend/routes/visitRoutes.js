const { Router } = require('express');
const visitController = require('../controllers/visitController');

const router = Router();

router.post('/track', visitController.trackVisit);

module.exports = router;
