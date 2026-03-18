const pool = require('../config/database');

/**
 * Record status change (called internally)
 */
exports.recordStatusChange = async (conn, grievance_id, old_status, new_status, changed_by, reason) => {
  try {
    await conn.query(
      'INSERT INTO grievance_status_history (grievance_id, old_status, new_status, changed_by, reason) VALUES (?, ?, ?, ?, ?)',
      [grievance_id, old_status, new_status, changed_by, reason || null]
    );
  } catch (error) {
    console.error('Record status change error:', error);
    throw error;
  }
};

/**
 * Get status history for grievance
 */
exports.getStatusHistory = async (req, res) => {
  try {
    const { grievance_id } = req.params;

    const conn = await pool.getConnection();
    try {
      const [history] = await conn.query(
        `SELECT gsh.*, u.name as changed_by_name
         FROM grievance_status_history gsh
         LEFT JOIN users u ON gsh.changed_by = u.id
         WHERE gsh.grievance_id = ?
         ORDER BY gsh.created_at ASC`,
        [grievance_id]
      );

      res.json({
        success: true,
        data: history
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get status history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch status history'
    });
  }
};

/**
 * Get status change statistics
 */
exports.getStatusStatistics = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [stats] = await conn.query(
        `SELECT 
           new_status, 
           COUNT(*) as count,
           AVG(TIMESTAMPDIFF(HOUR, gsh.created_at, 
             (SELECT MIN(created_at) FROM grievance_status_history gsh2 
              WHERE gsh2.grievance_id = gsh.grievance_id AND gsh2.created_at > gsh.created_at))) as avg_hours_to_next
         FROM grievance_status_history gsh
         GROUP BY new_status`
      );

      res.json({
        success: true,
        statistics: stats
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get status statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch status statistics'
    });
  }
};
