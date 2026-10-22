const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/apply', applicationController.applyForScholarship);
router.get('/my', applicationController.getMyApplications);
router.get('/:id', applicationController.getApplicationDetail);

module.exports = router;
