const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mypwa'
});

const initDb = async () => {
  let retries = 5;
  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connected successfully');
      
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('Schema initialized successfully');
      break;
    } catch (err) {
      console.error('Database connection failed, retrying in 5 seconds...', err.message);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }
  if (retries === 0) {
    throw new Error('Could not connect to database after multiple attempts');
  }
};

module.exports = {
  pool,
  initDb
};
