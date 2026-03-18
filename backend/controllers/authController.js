const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/tokenUtils');

/**
 * Register new user
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const conn = await pool.getConnection();

    try {
      const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const [result] = await conn.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'user']
      );

      const token = generateToken(result.insertId, role || 'user');
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: { id: result.insertId, name, email, role: role || 'user' }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const conn = await pool.getConnection();

    try {
      const [users] = await conn.query(
        'SELECT id, name, email, password, role FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = users[0];
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.role);
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Forgot Password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const conn = await pool.getConnection();

    try {
      const [users] = await conn.query('SELECT id, email FROM users WHERE email = ?', [email]);

      if (users.length === 0) {
        return res.json({ success: true, message: 'If an account exists with that email, you will receive a password reset link' });
      }

      const resetToken = generateToken(users[0].id, 'reset');
      res.json({
        success: true,
        message: 'Password reset link sent to email',
        resetToken
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request' });
  }
};

/**
 * Reset Password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const { verifyToken } = require('../utils/tokenUtils');

    const decoded = verifyToken(token);
    if (decoded.role !== 'reset') {
      return res.status(400).json({ success: false, message: 'Invalid reset token' });
    }

    const conn = await pool.getConnection();
    try {
      const hashedPassword = await hashPassword(newPassword);
      await conn.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id]);
      res.json({ success: true, message: 'Password reset successful' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ success: false, message: 'Failed to reset password' });
  }
};

/**
 * Get current user profile
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [users] = await conn.query(
        'SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, user: users[0] });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
};
