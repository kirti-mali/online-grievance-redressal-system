const express = require('express');
const router = express.Router();
const statusHistoryController = require('../controllers/statusHistoryController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get status history for grievance
router.get('/grievance/:grievance_id', statusHistoryController.getStatusHistory);

// Get status change statistics (admin)
router.get('/stats/all', authorizeRole('admin'), statusHistoryController.getStatusStatistics);

module.exports = router;
