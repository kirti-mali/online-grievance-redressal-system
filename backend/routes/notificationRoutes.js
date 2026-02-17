const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get notifications
router.get('/', notificationController.getUserNotifications);

// Get unread count
router.get('/count/unread', notificationController.getUnreadCount);

// Mark as read
router.patch('/:notification_id/read', notificationController.markAsRead);

// Mark all as read
router.patch('/all/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:notification_id', notificationController.deleteNotification);

module.exports = router;
