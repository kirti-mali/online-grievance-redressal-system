const express = require('express');
const router = express.Router();
const escalationController = require('../controllers/escalationController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateEscalation } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Get pending escalations (admin/staff only) - MUST come first!
router.get('/pending/list', authorizeRole('admin', 'staff'), escalationController.getPendingEscalations);

// Update escalation status
router.patch('/:escalation_id/status', escalationController.updateEscalationStatus);

// Escalate grievance
router.post('/:grievance_id/escalate', validateEscalation, escalationController.escalateGrievance);

// Get escalation history for grievance
router.get('/:grievance_id', escalationController.getEscalationHistory);

module.exports = router;
