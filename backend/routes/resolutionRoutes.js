const express = require('express');
const router = express.Router();
const resolutionController = require('../controllers/resolutionController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateResolution } = require('../middleware/validation');

// All routes require authentication and staff role
router.use(authenticateToken);
router.use(authorizeRole('staff', 'admin'));

// Routes
router.post('/', validateResolution, authorizeRole('staff'), resolutionController.addResolution);
router.get('/grievance/:grievance_id', resolutionController.getGrievanceResolutions);
router.put('/:id', authorizeRole('staff'), resolutionController.updateResolution);
router.delete('/:id', authorizeRole('staff'), resolutionController.deleteResolution);
router.get('/staff/history', authorizeRole('staff'), resolutionController.getStaffResolutionHistory);

module.exports = router;
