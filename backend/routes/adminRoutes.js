const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/stats', adminController.getStats);
router.get('/scholarships', adminController.getAdminScholarships);
router.post('/scholarships', adminController.createScholarship);
router.put('/scholarships/:id', adminController.updateScholarship);
router.delete('/scholarships/:id', adminController.deleteScholarship);
router.get('/applications', adminController.getAdminApplications);
router.put('/applications/:id/status', adminController.updateApplicationStatus);
router.get('/users', adminController.getAdminUsers);
router.post('/sync-portals', adminController.syncGovernmentPortals);
router.get('/crawler-status', adminController.getPortalCrawlerStatus);

module.exports = router;
