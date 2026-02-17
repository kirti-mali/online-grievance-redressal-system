const pool = require('../config/database');

/**
 * Add comment to grievance
 */
exports.addComment = async (req, res) => {
  try {
    const { grievance_id } = req.params;
    const { comment, is_internal } = req.body;
    const user_id = req.user.id;

    // Validate
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    const conn = await pool.getConnection();
    try {
      // Check if grievance exists
      const [grievance] = await conn.query('SELECT id FROM grievances WHERE id = ?', [grievance_id]);
      if (!grievance.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
      }

      // Only internal comments restricted to staff/admin
      const isInternal = is_internal && (req.user.role === 'staff' || req.user.role === 'admin');

      const [result] = await conn.query(
        'INSERT INTO grievance_comments (grievance_id, user_id, comment, is_internal) VALUES (?, ?, ?, ?)',
        [grievance_id, user_id, comment, isInternal ? 1 : 0]
      );

      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        comment: {
          id: result.insertId,
          grievance_id,
          user_id,
          comment,
          is_internal: isInternal
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

/**
 * Get comments on grievance
 */
exports.getComments = async (req, res) => {
  try {
    const { grievance_id } = req.params;
    const user_id = req.user.id;
    const user_role = req.user.role;

    const conn = await pool.getConnection();
    try {
      // Get grievance ownership for authorization
      const [grievance] = await conn.query(
        'SELECT user_id FROM grievances WHERE id = ?',
        [grievance_id]
      );

      if (!grievance.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
      }

      const is_owner = grievance[0].user_id === user_id;

      // Build query - hide internal comments from citizens who are not owners
      let query = `
        SELECT gc.*, u.name as user_name, u.role as user_role
        FROM grievance_comments gc
        JOIN users u ON gc.user_id = u.id
        WHERE gc.grievance_id = ?
      `;
      const params = [grievance_id];

      // If citizen and not owner, hide internal comments
      if (user_role === 'citizen' && !is_owner) {
        query += ' AND gc.is_internal = 0';
      }
      // If citizen owner, can see all except internal (staff/admin only)
      else if (user_role === 'citizen' && is_owner) {
        query += ' AND gc.is_internal = 0';
      }
      // Staff and admin can see all

      query += ' ORDER BY gc.created_at ASC';

      const [comments] = await conn.query(query, params);

      res.json({
        success: true,
        comments
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
};

/**
 * Update comment
 */
exports.updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { comment } = req.body;
    const user_id = req.user.id;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    const conn = await pool.getConnection();
    try {
      // Check ownership
      const [existing] = await conn.query(
        'SELECT user_id FROM grievance_comments WHERE id = ?',
        [comment_id]
      );

      if (!existing.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      if (existing[0].user_id !== user_id) {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this comment'
        });
      }

      await conn.query(
        'UPDATE grievance_comments SET comment = ? WHERE id = ?',
        [comment, comment_id]
      );

      res.json({
        success: true,
        message: 'Comment updated successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment'
    });
  }
};

/**
 * Delete comment
 */
exports.deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const user_id = req.user.id;
    const user_role = req.user.role;

    const conn = await pool.getConnection();
    try {
      // Check ownership or admin
      const [existing] = await conn.query(
        'SELECT user_id FROM grievance_comments WHERE id = ?',
        [comment_id]
      );

      if (!existing.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      if (existing[0].user_id !== user_id && user_role !== 'admin') {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this comment'
        });
      }

      await conn.query('DELETE FROM grievance_comments WHERE id = ?', [comment_id]);

      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    });
  }
};
