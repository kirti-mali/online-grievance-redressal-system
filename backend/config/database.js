const mysql = require('mysql2/promise');
require('dotenv').config();
const mockDB = require('./mockDatabase');

let pool = null;
let useMockDatabase = false;
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grievance_redressal_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Attempt to create connection pool
try {
  pool = mysql.createPool(dbConfig);

  // Test the connection at startup
  pool.getConnection()
    .then((conn) => {
      console.log(`✓ MySQL Database connected successfully (host: ${dbConfig.host}:${dbConfig.port})`);
      conn.release();
    })
    .catch((err) => {
      console.error(`✗ Database connection failed: ${err.message}`);
      console.warn('⚠ Falling back to in-memory mock database for development...');
      useMockDatabase = true;
      if (err.code === 'ECONNREFUSED') {
        console.error(`  - Connection refused on ${dbConfig.host}:${dbConfig.port}`);
        console.error('  - Ensure MySQL is running or use Docker');
      }
    });
} catch (error) {
  console.warn(`⚠ Failed to create MySQL pool: ${error.message}`);
  console.warn('⚠ Using in-memory mock database for development...');
  useMockDatabase = true;
}

// Export the appropriate database adapter
const dbAdapter = pool || mockDB;
dbAdapter.useMockDatabase = () => useMockDatabase;
dbAdapter.mockDB = mockDB;
dbAdapter.getDbConfig = () => dbConfig;

module.exports = dbAdapter;
