const { validationResult, body, param } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['citizen', 'staff', 'admin']).withMessage('Invalid role'),
  handleValidationErrors
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Validation rules for grievance creation
 */
const validateGrievance = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category_id').isInt().withMessage('Category is required'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  handleValidationErrors
];

/**
 * Validation rules for category creation
 */
const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  handleValidationErrors
];

/**
 * Validation rules for resolution notes
 */
const validateResolution = [
  body('grievance_id').isInt().withMessage('Grievance ID is required'),
  body('notes').trim().notEmpty().withMessage('Resolution notes are required'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateGrievance,
  validateCategory,
  validateResolution
};
