const pool = require('../config/database');

/**
 * Submit feedback on resolved grievance
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { grievance_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const conn = await pool.getConnection();
    try {
      // Check if grievance exists and belongs to user
      const [grievance] = await conn.query(
        'SELECT user_id, status FROM grievances WHERE id = ?',
        [grievance_id]
      );

      if (!grievance.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
      }

      if (grievance[0].user_id !== user_id) {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to submit feedback for this grievance'
        });
      }

      if (grievance[0].status !== 'resolved' && grievance[0].status !== 'closed') {
        conn.release();
        return res.status(400).json({
          success: false,
          message: 'Feedback can only be submitted for resolved or closed grievances'
        });
      }

      // Check if feedback already exists
      const [existing] = await conn.query(
        'SELECT id FROM grievance_feedback WHERE grievance_id = ? AND user_id = ?',
        [grievance_id, user_id]
      );

      if (existing.length) {
        conn.release();
        return res.status(400).json({
          success: false,
          message: 'Feedback already submitted for this grievance'
        });
      }

      const [result] = await conn.query(
        'INSERT INTO grievance_feedback (grievance_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [grievance_id, user_id, rating, comment || null]
      );

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        feedback: {
          id: result.insertId,
          grievance_id,
          user_id,
          rating,
          comment: comment || null
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
};

/**
 * Get feedback for a grievance
 */
exports.getFeedback = async (req, res) => {
  try {
    const { grievance_id } = req.params;

    const conn = await pool.getConnection();
    try {
      const [feedback] = await conn.query(
        `SELECT gf.*, u.name as user_name
         FROM grievance_feedback gf
         LEFT JOIN users u ON gf.user_id = u.id
         WHERE gf.grievance_id = ?`,
        [grievance_id]
      );

      res.json({
        success: true,
        feedback: feedback.length > 0 ? feedback[0] : null
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback'
    });
  }
};

/**
 * Get feedback statistics (admin only)
 */
exports.getFeedbackStats = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [stats] = await conn.query(
        `SELECT 
           COUNT(*) as total_feedback,
           AVG(rating) as average_rating,
           MIN(rating) as min_rating,
           MAX(rating) as max_rating,
           SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
           SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
           SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
           SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
           SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
         FROM grievance_feedback`
      );

      res.json({
        success: true,
        stats: stats[0]
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics'
    });
  }
};

/**
 * Get feedback by rating (admin)
 */
exports.getFeedbackByRating = async (req, res) => {
  try {
    const { rating } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const conn = await pool.getConnection();
    try {
      const [feedback] = await conn.query(
        `SELECT gf.*, u.name as user_name, g.title as grievance_title, c.name as category
         FROM grievance_feedback gf
         LEFT JOIN users u ON gf.user_id = u.id
         LEFT JOIN grievances g ON gf.grievance_id = g.id
         LEFT JOIN categories c ON g.category_id = c.id
         WHERE gf.rating = ?
         ORDER BY gf.created_at DESC`,
        [rating]
      );

      res.json({
        success: true,
        feedback
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get feedback by rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback'
    });
  }
};
