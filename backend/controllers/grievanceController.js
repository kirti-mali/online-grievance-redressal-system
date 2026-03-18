const pool = require('../config/database');
const { createNotification } = require('./notificationController');

/**
 * Create new grievance
 */
exports.createGrievance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, category_id, priority } = req.body;
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        'INSERT INTO grievances (user_id, title, description, category_id, priority) VALUES (?, ?, ?, ?, ?)',
        [userId, title, description, category_id, priority]
      );
      await conn.query(
        'INSERT INTO grievance_status_history (grievance_id, old_status, new_status, changed_by, reason) VALUES (?, ?, ?, ?, ?)',
        [result.insertId, null, 'open', userId, 'Grievance created']
      );
      res.status(201).json({
        success: true,
        message: 'Grievance created successfully',
        grievance: { id: result.insertId, user_id: userId, title, description, category_id, priority, status: 'open' }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Create grievance error:', error);
    res.status(500).json({ success: false, message: 'Failed to create grievance' });
  }
};

/**
 * Get all grievances with filters and pagination
 */
exports.getAllGrievances = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, category_id, priority } = req.query;

    const conn = await pool.getConnection();
    try {
      let where = [];
      const params = [];

      if (status) { where.push('g.status = ?'); params.push(status); }
      if (category_id) { where.push('g.category_id = ?'); params.push(category_id); }
      if (priority) { where.push('g.priority = ?'); params.push(priority); }

      const whereClause = where.length ? ' WHERE ' + where.join(' AND ') : '';

      const [countResult] = await conn.query('SELECT COUNT(*) as total FROM grievances g' + whereClause, params);
      const total = countResult[0].total;

      const [grievances] = await conn.query(
        `SELECT g.*, u.name as user_name, u.email as user_email, c.name as category_name,
                s.name as assigned_staff_name
         FROM grievances g
         LEFT JOIN users u ON g.user_id = u.id
         LEFT JOIN categories c ON g.category_id = c.id
         LEFT JOIN users s ON g.assigned_to = s.id
         ${whereClause} ORDER BY g.created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      res.json({ success: true, data: grievances, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get grievances error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch grievances' });
  }
};

/**
 * Get user's own grievances
 */
exports.getUserGrievances = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const conn = await pool.getConnection();
    try {
      const [countResult] = await conn.query('SELECT COUNT(*) as total FROM grievances WHERE user_id = ?', [userId]);
      const total = countResult[0].total;

      const [grievances] = await conn.query(
        `SELECT g.*, c.name as category_name, s.name as assigned_staff_name
         FROM grievances g
         LEFT JOIN categories c ON g.category_id = c.id
         LEFT JOIN users s ON g.assigned_to = s.id
         WHERE g.user_id = ? ORDER BY g.created_at DESC LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      res.json({ success: true, data: grievances, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get user grievances error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch grievances' });
  }
};

/**
 * Get grievance by ID
 */
exports.getGrievanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    try {
      const [grievances] = await conn.query(
        `SELECT g.*, u.name as user_name, u.email as user_email, c.name as category_name,
                s.name as assigned_staff_name
         FROM grievances g
         LEFT JOIN users u ON g.user_id = u.id
         LEFT JOIN categories c ON g.category_id = c.id
         LEFT JOIN users s ON g.assigned_to = s.id
         WHERE g.id = ?`,
        [id]
      );

      if (grievances.length === 0) {
        return res.status(404).json({ success: false, message: 'Grievance not found' });
      }

      const [resolutions] = await conn.query(
        `SELECT r.*, u.name as staff_name FROM resolutions r
         LEFT JOIN users u ON r.staff_id = u.id
         WHERE r.grievance_id = ? ORDER BY r.created_at DESC`,
        [id]
      );

      res.json({ success: true, grievance: { ...grievances[0], resolutions } });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get grievance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch grievance' });
  }
};

/**
 * Update grievance status
 */
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query('SELECT status FROM grievances WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Grievance not found' });

      const oldStatus = rows[0].status;
      await conn.query('UPDATE grievances SET status = ? WHERE id = ?', [status, id]);
      await conn.query(
        'INSERT INTO grievance_status_history (grievance_id, old_status, new_status, changed_by, reason) VALUES (?, ?, ?, ?, ?)',
        [id, oldStatus, status, req.user.id, reason || null]
      );

      // Notify grievance owner
      const [owner] = await conn.query('SELECT user_id FROM grievances WHERE id = ?', [id]);
      if (owner.length) {
        await createNotification(
          owner[0].user_id, parseInt(id), 'status_change',
          `Grievance #${id} Status Updated`,
          `Your grievance status changed from "${oldStatus?.replace('_',' ')}" to "${status.replace('_',' ')}"`
        );
      }

      res.json({ success: true, message: 'Grievance status updated successfully' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update grievance status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update grievance status' });
  }
};

/**
 * Assign grievance to staff
 */
exports.assignGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;
    const conn = await pool.getConnection();
    try {
      const [grievances] = await conn.query('SELECT id FROM grievances WHERE id = ?', [id]);
      if (grievances.length === 0) return res.status(404).json({ success: false, message: 'Grievance not found' });

      if (assigned_to) {
        const [staff] = await conn.query('SELECT id FROM users WHERE id = ? AND role = "staff"', [assigned_to]);
        if (staff.length === 0) return res.status(404).json({ success: false, message: 'Staff member not found' });
      }

      await conn.query('UPDATE grievances SET assigned_to = ? WHERE id = ?', [assigned_to, id]);
      await conn.query(
        'INSERT INTO grievance_status_history (grievance_id, old_status, new_status, changed_by, reason) VALUES (?, ?, ?, ?, ?)',
        [id, null, null, req.user.id, `Assigned to user ${assigned_to}`]
      );

      // Notify assigned staff
      if (assigned_to) {
        await createNotification(
          parseInt(assigned_to), parseInt(id), 'assignment',
          `Grievance #${id} Assigned to You`,
          `You have been assigned grievance #${id}. Please review and take action.`
        );
      }

      res.json({ success: true, message: 'Grievance assigned successfully' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Assign grievance error:', error);
    res.status(500).json({ success: false, message: 'Failed to assign grievance' });
  }
};

/**
 * Get staff assigned grievances
 */
exports.getStaffGrievances = async (req, res) => {
  try {
    const staffId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const conn = await pool.getConnection();
    try {
      const [countResult] = await conn.query('SELECT COUNT(*) as total FROM grievances WHERE assigned_to = ?', [staffId]);
      const total = countResult[0].total;

      const [grievances] = await conn.query(
        `SELECT g.*, u.name as user_name, c.name as category_name
         FROM grievances g
         LEFT JOIN users u ON g.user_id = u.id
         LEFT JOIN categories c ON g.category_id = c.id
         WHERE g.assigned_to = ? ORDER BY g.created_at DESC LIMIT ? OFFSET ?`,
        [staffId, limit, offset]
      );

      res.json({ success: true, data: grievances, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get staff grievances error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch grievances' });
  }
};

/**
 * Get grievance statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [stats] = await conn.query(`
        SELECT
          COUNT(*) as total_grievances,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_grievances,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_grievances,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_grievances,
          SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_grievances,
          SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority_grievances,
          (SELECT COUNT(*) FROM users WHERE role = 'citizen') as total_citizens,
          (SELECT COUNT(*) FROM users WHERE role = 'staff') as total_staff
        FROM grievances
      `);
      res.json({ success: true, statistics: stats[0] });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
};
