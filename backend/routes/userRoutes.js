const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Protected routes - all require authentication
router.use(authenticateToken);

// Update own profile
router.put('/profile', userController.updateProfile);

// Admin routes - manage users
router.get('/', authorizeRole('admin'), userController.getAllUsers);
router.get('/:id', authorizeRole('admin'), userController.getUserById);
router.put('/:id', authorizeRole('admin'), userController.updateUser);
router.delete('/:id', authorizeRole('admin'), userController.deleteUser);
router.patch('/:id/status', authorizeRole('admin'), userController.toggleUserStatus);

module.exports = router;
