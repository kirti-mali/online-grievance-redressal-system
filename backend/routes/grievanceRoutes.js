const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateGrievance } = require('../middleware/validation');

// All grievance routes require authentication
router.use(authenticateToken);

// Static routes MUST come before /:id
router.get('/statistics', grievanceController.getStatistics);
router.get('/my-grievances', grievanceController.getUserGrievances);
router.get('/staff/assigned', authorizeRole('staff', 'admin'), grievanceController.getStaffGrievances);

// Citizen routes
router.post('/', validateGrievance, grievanceController.createGrievance);

// Admin routes
router.get('/', authorizeRole('admin', 'staff'), grievanceController.getAllGrievances);
router.patch('/:id/status', authorizeRole('admin', 'staff'), grievanceController.updateGrievanceStatus);
router.patch('/:id/assign', authorizeRole('admin'), grievanceController.assignGrievance);

// Common routes (accessible by citizen, staff, admin)
router.get('/:id', grievanceController.getGrievanceById);

module.exports = router;
