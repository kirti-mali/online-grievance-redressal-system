const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentController');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX, TXT'));
    }
  }
});

// All routes require authentication
router.use(authenticateToken);

// Storage stats (admin) - MUST come before other routes
router.get('/stats/storage', documentController.getStorageStats);

// Download document - MUST come before generic :id routes
router.get('/:document_id/download', documentController.downloadDocument);

// Get documents for grievance
router.get('/:grievance_id/list', documentController.getDocuments);

// Upload document
router.post('/:grievance_id/upload', upload.single('file'), documentController.uploadDocument);

// Delete document
router.delete('/:document_id', documentController.deleteDocument);

module.exports = router;
