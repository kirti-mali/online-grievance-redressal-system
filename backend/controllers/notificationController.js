const pool = require('../config/database');

/**
 * Get notifications for user
 */
exports.getUserNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const unread_only = req.query.unread_only === 'true';

    const conn = await pool.getConnection();
    try {
      let query = 'SELECT * FROM notifications WHERE user_id = ?';
      const params = [user_id];

      if (unread_only) {
        query += ' AND is_read = 0';
      }

      // Get total count
      const [countResult] = await conn.query(
        `SELECT COUNT(*) as total FROM notifications WHERE user_id = ?${unread_only ? ' AND is_read = 0' : ''}`,
        params
      );

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [notifications] = await conn.query(query, params);

      res.json({
        success: true,
        notifications,
        pagination: {
          page,
          limit,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit)
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const user_id = req.user.id;

    const conn = await pool.getConnection();
    try {
      // Check ownership
      const [notification] = await conn.query(
        'SELECT user_id FROM notifications WHERE id = ?',
        [notification_id]
      );

      if (!notification.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      if (notification[0].user_id !== user_id) {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      await conn.query(
        'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?',
        [notification_id]
      );

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
};

/**
 * Mark all notifications as read
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;

    const conn = await pool.getConnection();
    try {
      await conn.query(
        'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0',
        [user_id]
      );

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications'
    });
  }
};

/**
 * Delete notification
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const user_id = req.user.id;

    const conn = await pool.getConnection();
    try {
      // Check ownership
      const [notification] = await conn.query(
        'SELECT user_id FROM notifications WHERE id = ?',
        [notification_id]
      );

      if (!notification.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Notification not found'
        });
      }

      if (notification[0].user_id !== user_id && req.user.role !== 'admin') {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized'
        });
      }

      await conn.query('DELETE FROM notifications WHERE id = ?', [notification_id]);

      res.json({
        success: true,
        message: 'Notification deleted'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

/**
 * Get unread count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const user_id = req.user.id;

    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0',
        [user_id]
      );

      res.json({
        success: true,
        unread_count: result[0].unread_count
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
};

/**
 * Create notification (internal use)
 */
exports.createNotification = async (user_id, grievance_id, type, title, message) => {
  try {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        'INSERT INTO notifications (user_id, grievance_id, type, title, message) VALUES (?, ?, ?, ?, ?)',
        [user_id, grievance_id, type, title, message]
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Create notification error:', error);
  }
};
