require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection check
const pool = require('./config/database');

// Log request middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/grievances', require('./routes/grievanceRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/resolutions', require('./routes/resolutionRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/escalations', require('./routes/escalationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/status-history', require('./routes/statusHistoryRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/complaints', complaintRoutes);

// Static files for uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server with automatic retry on EADDRINUSE
const PORT = Number(process.env.PORT) || 5000;

function startServer(port, retries = 5) {
  const server = app.listen(port, () => {
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║     Online Grievance Redressal System - Backend Server     ║`);
    console.log(`║                   Server Running on Port ${port}                   ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝\n`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`);
      if (retries > 0) {
        const nextPort = port + 1;
        console.log(`Trying to start on port ${nextPort} (retries left: ${retries - 1})...`);
        setTimeout(() => startServer(nextPort, retries - 1), 1000);
        return;
      }
      console.error('Unable to bind to any port. Exiting.');
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
}

startServer(PORT, 5);

module.exports = app;
