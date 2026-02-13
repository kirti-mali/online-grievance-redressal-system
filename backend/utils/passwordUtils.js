const bcrypt = require('bcryptjs');

/**
 * Hash password
 * @param {string} password - Password to hash
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 * @param {string} password - Password to compare
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};
