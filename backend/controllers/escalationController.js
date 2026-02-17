const pool = require('../config/database');

/**
 * Escalate a grievance
 */
exports.escalateGrievance = async (req, res) => {
  try {
    const { grievance_id } = req.params;
    const { reason, escalated_to } = req.body;
    const escalated_by = req.user.id;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Escalation reason is required'
      });
    }

    const conn = await pool.getConnection();
    try {
      // Check if grievance exists
      const [grievance] = await conn.query(
        'SELECT * FROM grievances WHERE id = ?',
        [grievance_id]
      );

      if (!grievance.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
      }

      // Check if already escalated and pending
      const [existing] = await conn.query(
        'SELECT id FROM grievance_escalations WHERE grievance_id = ? AND status = "pending"',
        [grievance_id]
      );

      if (existing.length) {
        conn.release();
        return res.status(400).json({
          success: false,
          message: 'Grievance already has a pending escalation'
        });
      }

      // Get escalation level
      const [escalations] = await conn.query(
        'SELECT MAX(escalation_level) as max_level FROM grievance_escalations WHERE grievance_id = ?',
        [grievance_id]
      );
      const escalation_level = (escalations[0].max_level || 0) + 1;

      const [result] = await conn.query(
        'INSERT INTO grievance_escalations (grievance_id, reason, escalation_level, escalated_by, escalated_to) VALUES (?, ?, ?, ?, ?)',
        [grievance_id, reason, escalation_level, escalated_by, escalated_to || null]
      );

      // Create notification for escalated_to user if provided
      if (escalated_to) {
        await conn.query(
          'INSERT INTO notifications (user_id, grievance_id, type, title, message) VALUES (?, ?, ?, ?, ?)',
          [
            escalated_to,
            grievance_id,
            'escalation',
            `Grievance #${grievance_id} Escalated`,
            `A grievance has been escalated to you. Reason: ${reason}`
          ]
        );
      }

      res.status(201).json({
        success: true,
        message: 'Grievance escalated successfully',
        escalation: {
          id: result.insertId,
          grievance_id,
          reason,
          escalation_level,
          escalated_by,
          escalated_to
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Escalate grievance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to escalate grievance'
    });
  }
};

/**
 * Get escalation history for a grievance
 */
exports.getEscalationHistory = async (req, res) => {
  try {
    const { grievance_id } = req.params;

    const conn = await pool.getConnection();
    try {
      const [escalations] = await conn.query(
        `SELECT ge.*, 
                u1.name as escalated_by_name,
                u2.name as escalated_to_name
         FROM grievance_escalations ge
         LEFT JOIN users u1 ON ge.escalated_by = u1.id
         LEFT JOIN users u2 ON ge.escalated_to = u2.id
         WHERE ge.grievance_id = ?
         ORDER BY ge.created_at DESC`,
        [grievance_id]
      );

      res.json({
        success: true,
        escalations
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get escalation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch escalation history'
    });
  }
};

/**
 * Update escalation status
 */
exports.updateEscalationStatus = async (req, res) => {
  try {
    const { escalation_id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;

    const validStatuses = ['pending', 'acknowledged', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const conn = await pool.getConnection();
    try {
      const [escalation] = await conn.query(
        'SELECT * FROM grievance_escalations WHERE id = ?',
        [escalation_id]
      );

      if (!escalation.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Escalation not found'
        });
      }

      // Check authorization (only escalated_to user or admin can update)
      if (escalation[0].escalated_to !== user_id && req.user.role !== 'admin') {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this escalation'
        });
      }

      const resolved_at = status === 'resolved' ? new Date() : null;

      await conn.query(
        'UPDATE grievance_escalations SET status = ?, resolved_at = ? WHERE id = ?',
        [status, resolved_at, escalation_id]
      );

      res.json({
        success: true,
        message: 'Escalation status updated successfully',
        status
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update escalation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update escalation status'
    });
  }
};

/**
 * Get pending escalations (admin/manager only)
 */
exports.getPendingEscalations = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [escalations] = await conn.query(
        `SELECT ge.*, 
                g.title as grievance_title,
                u1.name as escalated_by_name,
                u2.name as escalated_to_name
         FROM grievance_escalations ge
         JOIN grievances g ON ge.grievance_id = g.id
         LEFT JOIN users u1 ON ge.escalated_by = u1.id
         LEFT JOIN users u2 ON ge.escalated_to = u2.id
         WHERE ge.status = 'pending'
         ORDER BY ge.created_at DESC`
      );

      res.json({
        success: true,
        escalations
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get pending escalations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending escalations'
    });
  }
};
