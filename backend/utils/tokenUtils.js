const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {number} userId - User ID
 * @param {string} role - User role
 * @returns {string} - JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} - Decoded token data
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production');
  } catch (error) {
    throw new Error('Invalid token: ' + error.message);
  }
};

module.exports = {
  generateToken,
  verifyToken
};
