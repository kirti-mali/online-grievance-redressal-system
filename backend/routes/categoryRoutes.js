const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');

// Public route - get all categories
router.get('/', categoryController.getAllCategories);
router.get('/with-count', categoryController.getCategoriesWithCount);
router.get('/:id', categoryController.getCategoryById);

// Admin routes - manage categories
router.post('/', authenticateToken, authorizeRole('admin'), validateCategory, categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRole('admin'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRole('admin'), categoryController.deleteCategory);

module.exports = router;
