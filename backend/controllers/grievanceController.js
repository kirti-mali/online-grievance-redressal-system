const pool = require('../config/database');

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

      res.status(201).json({
        success: true,
        message: 'Grievance created successfully',
        grievance: {
          id: result.insertId,
          user_id: userId,
          title,
          description,
          category_id,
          priority,
          status: 'open'
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Create grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create grievance'
    });
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
    const status = req.query.status || '';
    const category_id = req.query.category_id || '';
    const priority = req.query.priority || '';

    const conn = await pool.getConnection();

    try {
      let query = `SELECT g.*, u.name as user_name, u.email as user_email, c.name as category_name, 
                   s.name as assigned_staff_name FROM grievances g
                   LEFT JOIN users u ON g.user_id = u.id
                   LEFT JOIN categories c ON g.category_id = c.id
                   LEFT JOIN users s ON g.assigned_to = s.id`;
      
      let countQuery = 'SELECT COUNT(*) as total FROM grievances g';
      const params = [];
      const whereConditions = [];

      if (status) {
        whereConditions.push('g.status = ?');
        params.push(status);
      }

      if (category_id) {
        whereConditions.push('g.category_id = ?');
        params.push(category_id);
      }

      if (priority) {
        whereConditions.push('g.priority = ?');
        params.push(priority);
      }

      // Add WHERE conditions if any
      if (whereConditions.length > 0) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause;
      }

      // Get total count
      const params2 = params.slice();
      const [countResult] = await conn.query(countQuery, params2);
      const total = countResult[0].total;

      // Add pagination
      query += ' ORDER BY g.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [grievances] = await conn.query(query, params);

      res.json({
        success: true,
        data: grievances,
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
    console.error('Get grievances error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grievances'
    });
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
      const [countResult] = await conn.query(
        'SELECT COUNT(*) as total FROM grievances WHERE user_id = ?',
        [userId]
      );
      const total = countResult[0].total;

      const [grievances] = await conn.query(
        `SELECT g.*, c.name as category_name, s.name as assigned_staff_name 
         FROM grievances g
         LEFT JOIN categories c ON g.category_id = c.id
         LEFT JOIN users s ON g.assigned_to = s.id
         WHERE g.user_id = ?
         ORDER BY g.created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );

      res.json({
        success: true,
        data: grievances,
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
    console.error('Get user grievances error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grievances'
    });
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
                s.name as assigned_staff_name FROM grievances g
         LEFT JOIN users u ON g.user_id = u.id
         LEFT JOIN categories c ON g.category_id = c.id
         LEFT JOIN users s ON g.assigned_to = s.id
         WHERE g.id = ?`,
        [id]
      );

      if (grievances.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
      }

      // Get resolutions
      const [resolutions] = await conn.query(
        `SELECT r.*, u.name as staff_name FROM resolutions r
         LEFT JOIN users u ON r.staff_id = u.id
         WHERE r.grievance_id = ?
         ORDER BY r.created_at DESC`,
        [id]
      );

      res.json({
        success: true,
        grievance: {
          ...grievances[0],
          resolutions: resolutions
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grievance'
    });
  }
};

/**
 * Update grievance status
 */
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const conn = await pool.getConnection();

    try {
      const [grievances] = await conn.query(
        'SELECT id FROM grievances WHERE id = ?',
        [id]
      );

      if (grievances.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
      }

      await conn.query(
        'UPDATE grievances SET status = ? WHERE id = ?',
        [status, id]
      );

      res.json({
        success: true,
        message: 'Grievance status updated successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update grievance status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update grievance status'
    });
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
      // Check if grievance exists
      const [grievances] = await conn.query(
        'SELECT id FROM grievances WHERE id = ?',
        [id]
      );

      if (grievances.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
      }

      // Check if staff exists
      if (assigned_to) {
        const [staff] = await conn.query(
          'SELECT id FROM users WHERE id = ? AND role = "staff"',
          [assigned_to]
        );

        if (staff.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Staff member not found'
          });
        }
      }

      await conn.query(
        'UPDATE grievances SET assigned_to = ? WHERE id = ?',
        [assigned_to, id]
      );

      res.json({
        success: true,
        message: 'Grievance assigned successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Assign grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign grievance'
    });
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
      const [countResult] = await conn.query(
        'SELECT COUNT(*) as total FROM grievances WHERE assigned_to = ?',
        [staffId]
      );
      const total = countResult[0].total;

      const [grievances] = await conn.query(
        `SELECT g.*, u.name as user_name, c.name as category_name 
         FROM grievances g
         LEFT JOIN users u ON g.user_id = u.id
         LEFT JOIN categories c ON g.category_id = c.id
         WHERE g.assigned_to = ?
         ORDER BY g.created_at DESC
         LIMIT ? OFFSET ?`,
        [staffId, limit, offset]
      );

      res.json({
        success: true,
        data: grievances,
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
    console.error('Get staff grievances error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grievances'
    });
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

      res.json({
        success: true,
        statistics: stats[0]
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};
