const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');
const { validateComment } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Get comments for grievance
router.get('/grievance/:grievance_id', commentController.getComments);

// Add comment to grievance
router.post('/grievance/:grievance_id', validateComment, commentController.addComment);

// Update specific comment
router.put('/:comment_id', validateComment, commentController.updateComment);

// Delete specific comment
router.delete('/:comment_id', commentController.deleteComment);

module.exports = router;
