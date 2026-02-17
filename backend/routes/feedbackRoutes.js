const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Submit feedback on grievance
router.post('/:grievance_id/feedback', validateFeedback, feedbackController.submitFeedback);

// Get feedback for grievance
router.get('/:grievance_id/feedback', feedbackController.getFeedback);

// Admin routes
router.get('/stats/all', authorizeRole('admin'), feedbackController.getFeedbackStats);
router.get('/rating/:rating', authorizeRole('admin'), feedbackController.getFeedbackByRating);

module.exports = router;
