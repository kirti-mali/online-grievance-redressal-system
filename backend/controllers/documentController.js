const pool = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

/**
 * Upload document to grievance
 */
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const { grievance_id } = req.params;
    const user_id = req.user.id;

    const conn = await pool.getConnection();
    try {
      // Check if grievance exists and user has access
      const [grievance] = await conn.query(
        'SELECT user_id, assigned_to FROM grievances WHERE id = ?',
        [grievance_id]
      );

      if (!grievance.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Grievance not found'
        });
      }

      // Only grievance owner, assigned staff, or admin can upload documents
      const hasAccess = grievance[0].user_id === user_id || 
                       grievance[0].assigned_to === user_id || 
                       req.user.role === 'admin';

      if (!hasAccess) {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to upload documents for this grievance'
        });
      }

      const [result] = await conn.query(
        'INSERT INTO grievance_documents (grievance_id, uploaded_by, original_filename, stored_filename, file_size, file_type) VALUES (?, ?, ?, ?, ?, ?)',
        [grievance_id, user_id, req.file.originalname, req.file.filename, req.file.size, req.file.mimetype]
      );

      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        document: {
          id: result.insertId,
          grievance_id,
          original_filename: req.file.originalname,
          stored_filename: req.file.filename,
          file_size: req.file.size
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document'
    });
  }
};

/**
 * Get documents for grievance
 */
exports.getDocuments = async (req, res) => {
  try {
    const { grievance_id } = req.params;

    const conn = await pool.getConnection();
    try {
      const [documents] = await conn.query(
        `SELECT gd.*, u.name as uploaded_by_name
         FROM grievance_documents gd
         LEFT JOIN users u ON gd.uploaded_by = u.id
         WHERE gd.grievance_id = ?
         ORDER BY gd.created_at DESC`,
        [grievance_id]
      );

      res.json({
        success: true,
        documents
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents'
    });
  }
};

/**
 * Download document
 */
exports.downloadDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const user_id = req.user.id;

    const conn = await pool.getConnection();
    try {
      const [document] = await conn.query(
        `SELECT gd.*, g.user_id as grievance_owner, g.assigned_to
         FROM grievance_documents gd
         JOIN grievances g ON gd.grievance_id = g.id
         WHERE gd.id = ?`,
        [document_id]
      );

      if (!document.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      // Check access
      const doc = document[0];
      const hasAccess = doc.grievance_owner === user_id || 
                       doc.assigned_to === user_id || 
                       req.user.role === 'admin';

      if (!hasAccess) {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to download this document'
        });
      }

      const filePath = path.join(UPLOADS_DIR, doc.stored_filename);
      res.download(filePath, doc.original_filename);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document'
    });
  }
};

/**
 * Delete document
 */
exports.deleteDocument = async (req, res) => {
  try {
    const { document_id } = req.params;
    const user_id = req.user.id;

    const conn = await pool.getConnection();
    try {
      const [document] = await conn.query(
        'SELECT uploaded_by, stored_filename FROM grievance_documents WHERE id = ?',
        [document_id]
      );

      if (!document.length) {
        conn.release();
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }

      // Only uploader or admin can delete
      if (document[0].uploaded_by !== user_id && req.user.role !== 'admin') {
        conn.release();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this document'
        });
      }

      // Delete file from storage
      try {
        const filePath = path.join(UPLOADS_DIR, document[0].stored_filename);
        await fs.unlink(filePath);
      } catch (err) {
        console.warn('Warning: Could not delete file from disk', err);
      }

      // Delete database record
      await conn.query('DELETE FROM grievance_documents WHERE id = ?', [document_id]);

      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
};

/**
 * Get storage stats (admin)
 */
exports.getStorageStats = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [stats] = await conn.query(
        `SELECT 
           COUNT(*) as total_documents,
           SUM(file_size) as total_size,
           AVG(file_size) as avg_size,
           MAX(file_size) as max_size
         FROM grievance_documents`
      );

      res.json({
        success: true,
        stats: stats[0]
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get storage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storage statistics'
    });
  }
};
