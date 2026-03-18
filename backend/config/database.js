require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grievance_redressal_system',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

// Verify connection on startup
pool.getConnection()
  .then(conn => {
    console.log(`✓ MySQL Database connected (${dbConfig.host}:${dbConfig.port})`);
    conn.release();
  })
  .catch(err => {
    console.error(`✗ Database connection failed: ${err.message}`);
    process.exit(1);
  });

// Export a plain wrapper so controllers can do:
//   const pool = require('./database')          -> pool.getConnection()
//   const { pool } = require('./database')      -> pool.getConnection()
const db = {
  getConnection: () => pool.getConnection(),
  query: (...args) => pool.query(...args),
  pool,
};

module.exports = db;
module.exports.pool = db;
