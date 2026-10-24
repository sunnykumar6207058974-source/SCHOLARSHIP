const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { optionalToken } = require('../middleware/auth');

router.get('/', optionalToken, scholarshipController.getScholarships);
router.get('/featured', scholarshipController.getFeaturedScholarships);
router.get('/categories', scholarshipController.getCategories);
router.get('/:idOrSlug', optionalToken, scholarshipController.getScholarshipDetail);
router.post('/:idOrSlug/notify-me', optionalToken, scholarshipController.subscribeAlert);

module.exports = router;
