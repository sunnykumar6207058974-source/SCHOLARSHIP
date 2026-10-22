const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.get('/saved', profileController.getSavedScholarships);
router.post('/save-scholarship/:id', profileController.toggleSaveScholarship);
router.post('/documents', profileController.uploadDocument);
router.get('/notifications', profileController.getNotifications);
router.put('/notifications/:id/read', profileController.markNotificationRead);

module.exports = router;
