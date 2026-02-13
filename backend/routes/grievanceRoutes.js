const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateGrievance } = require('../middleware/validation');

// All grievance routes require authentication
router.use(authenticateToken);

// Citizen routes
router.post('/', validateGrievance, grievanceController.createGrievance);
router.get('/my-grievances', grievanceController.getUserGrievances);

// Admin routes
router.get('/', authorizeRole('admin'), grievanceController.getAllGrievances);
router.patch('/:id/status', authorizeRole('admin'), grievanceController.updateGrievanceStatus);
router.patch('/:id/assign', authorizeRole('admin'), grievanceController.assignGrievance);
router.get('/statistics', authorizeRole('admin'), grievanceController.getStatistics);

// Staff routes
router.get('/staff/assigned', authorizeRole('staff'), grievanceController.getStaffGrievances);

// Common routes (accessible by citizen, staff, admin)
router.get('/:id', grievanceController.getGrievanceById);

module.exports = router;
