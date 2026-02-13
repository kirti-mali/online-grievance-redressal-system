const pool = require('../config/database');

/**
 * Add resolution notes to a grievance
 */
exports.addResolution = async (req, res) => {
  try {
    const staffId = req.user.id;
    const { grievance_id, notes } = req.body;

    const conn = await pool.getConnection();

    try {
      // Check if grievance exists and is assigned to the staff member
      const [grievances] = await conn.query(
        'SELECT id FROM grievances WHERE id = ? AND assigned_to = ?',
        [grievance_id, staffId]
      );

      if (grievances.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Grievance not found or not assigned to you'
        });
      }

      const [result] = await conn.query(
        'INSERT INTO resolutions (grievance_id, staff_id, notes) VALUES (?, ?, ?)',
        [grievance_id, staffId, notes]
      );

      res.status(201).json({
        success: true,
        message: 'Resolution notes added successfully',
        resolution: {
          id: result.insertId,
          grievance_id,
          staff_id: staffId,
          notes
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Add resolution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add resolution'
    });
  }
};

/**
 * Get resolutions for a grievance
 */
exports.getGrievanceResolutions = async (req, res) => {
  try {
    const { grievance_id } = req.params;
    const conn = await pool.getConnection();

    try {
      const [resolutions] = await conn.query(
        `SELECT r.*, u.name as staff_name, u.email as staff_email 
         FROM resolutions r
         LEFT JOIN users u ON r.staff_id = u.id
         WHERE r.grievance_id = ?
         ORDER BY r.created_at DESC`,
        [grievance_id]
      );

      res.json({
        success: true,
        data: resolutions
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get resolutions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resolutions'
    });
  }
};

/**
 * Update resolution notes
 */
exports.updateResolution = async (req, res) => {
  try {
    const { id } = req.params;
    const staffId = req.user.id;
    const { notes } = req.body;

    const conn = await pool.getConnection();

    try {
      // Check if resolution exists and belongs to the staff member
      const [resolutions] = await conn.query(
        'SELECT id FROM resolutions WHERE id = ? AND staff_id = ?',
        [id, staffId]
      );

      if (resolutions.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Resolution not found or unauthorized'
        });
      }

      await conn.query(
        'UPDATE resolutions SET notes = ? WHERE id = ?',
        [notes, id]
      );

      res.json({
        success: true,
        message: 'Resolution updated successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update resolution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resolution'
    });
  }
};

/**
 * Delete resolution
 */
exports.deleteResolution = async (req, res) => {
  try {
    const { id } = req.params;
    const staffId = req.user.id;

    const conn = await pool.getConnection();

    try {
      // Check if resolution exists and belongs to the staff member
      const [resolutions] = await conn.query(
        'SELECT id FROM resolutions WHERE id = ? AND staff_id = ?',
        [id, staffId]
      );

      if (resolutions.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Resolution not found or unauthorized'
        });
      }

      await conn.query('DELETE FROM resolutions WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Resolution deleted successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Delete resolution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resolution'
    });
  }
};

/**
 * Get staff resolution history
 */
exports.getStaffResolutionHistory = async (req, res) => {
  try {
    const staffId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const conn = await pool.getConnection();

    try {
      const [countResult] = await conn.query(
        'SELECT COUNT(*) as total FROM resolutions WHERE staff_id = ?',
        [staffId]
      );
      const total = countResult[0].total;

      const [resolutions] = await conn.query(
        `SELECT r.*, g.title as grievance_title, g.priority, u.name as citizen_name 
         FROM resolutions r
         LEFT JOIN grievances g ON r.grievance_id = g.id
         LEFT JOIN users u ON g.user_id = u.id
         WHERE r.staff_id = ?
         ORDER BY r.created_at DESC
         LIMIT ? OFFSET ?`,
        [staffId, limit, offset]
      );

      res.json({
        success: true,
        data: resolutions,
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
    console.error('Get staff resolution history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resolution history'
    });
  }
};
