const pool = require('../config/database');
const { hashPassword } = require('../utils/passwordUtils');

/**
 * Get staff users list (for assignment dropdown)
 */
exports.getStaffUsers = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [staff] = await conn.query(
        'SELECT id, name, email FROM users WHERE role = "staff" AND is_active = 1 ORDER BY name ASC'
      );
      res.json({ success: true, data: staff });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
};

/**
 * Create user (admin)
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password and role are required' });
    }
    const conn = await pool.getConnection();
    try {
      const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email already registered' });
      const hashed = await hashPassword(password);
      const [result] = await conn.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashed, role, phone || null]
      );
      res.status(201).json({ success: true, message: 'User created successfully', user: { id: result.insertId, name, email, role } });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

/**
 * Get all users with pagination
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const role = req.query.role || '';

    const conn = await pool.getConnection();

    try {
      let query = 'SELECT id, name, email, role, phone, is_active, created_at FROM users';
      let countQuery = 'SELECT COUNT(*) as total FROM users';
      const params = [];

      // Filter by role if provided
      if (role) {
        query += ' WHERE role = ?';
        countQuery += ' WHERE role = ?';
        params.push(role);
      }

      // Get total count
      const [countResult] = await conn.query(countQuery, params);
      const total = countResult[0].total;

      // Get paginated results
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [users] = await conn.query(query, params);

      res.json({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

/**
 * Get single user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    try {
      const [users] = await conn.query(
        'SELECT id, name, email, role, phone, address, is_active, created_at FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: users[0]
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

/**
 * Update user
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, role } = req.body;

    const conn = await pool.getConnection();

    try {
      // Check if user exists
      const [users] = await conn.query(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if email is already taken by another user
      if (email) {
        const [existingUsers] = await conn.query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, id]
        );

        if (existingUsers.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use'
          });
        }
      }

      // Build update query dynamically
      const updateFields = [];
      const updateValues = [];

      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      if (phone) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }
      if (address) {
        updateFields.push('address = ?');
        updateValues.push(address);
      }
      if (role) {
        updateFields.push('role = ?');
        updateValues.push(role);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updateValues.push(id);

      await conn.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself or the admin account
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const conn = await pool.getConnection();

    try {
      const [users] = await conn.query(
        'SELECT id, email FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Delete user
      await conn.query('DELETE FROM users WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

/**
 * Deactivate/Activate user
 */
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const conn = await pool.getConnection();

    try {
      const [users] = await conn.query(
        'SELECT id FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await conn.query(
        'UPDATE users SET is_active = ? WHERE id = ?',
        [is_active, id]
      );

      res.json({
        success: true,
        message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

/**
 * Update user profile (for logged-in users)
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, currentPassword, newPassword } = req.body;

    const conn = await pool.getConnection();

    try {
      // Get current user
      const [users] = await conn.query(
        'SELECT id, password FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // If changing password, verify current password
      if (newPassword) {
        const { comparePassword } = require('../utils/passwordUtils');
        const isPasswordValid = await comparePassword(currentPassword, users[0].password);

        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }
      }

      // Build update query
      const updateFields = [];
      const updateValues = [];

      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (phone) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }
      if (address) {
        updateFields.push('address = ?');
        updateValues.push(address);
      }
      if (newPassword) {
        const hashedPassword = await hashPassword(newPassword);
        updateFields.push('password = ?');
        updateValues.push(hashedPassword);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      updateValues.push(userId);

      await conn.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};
