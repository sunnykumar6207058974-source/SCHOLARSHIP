const mysql = require('mysql2/promise');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let pool = null;
let sqliteDb = null;
let dbEngine = 'sqlite'; // default or fallback

const MYSQL_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'eduscholar_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function initDatabase() {
  // 1. Try connecting to MySQL if requested or possible
  if (process.env.USE_MYSQL === 'true' || process.env.DB_PASSWORD !== undefined) {
    try {
      console.log('Attempting MySQL connection to', MYSQL_CONFIG.host, 'user:', MYSQL_CONFIG.user);
      // First check connection to server (without DB name in case DB not created yet)
      const testConn = await mysql.createConnection({
        host: MYSQL_CONFIG.host,
        user: MYSQL_CONFIG.user,
        password: MYSQL_CONFIG.password,
        port: MYSQL_CONFIG.port
      });
      await testConn.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await testConn.end();

      pool = mysql.createPool(MYSQL_CONFIG);
      const [res] = await pool.query('SELECT 1 as connected');
      if (res && res[0].connected === 1) {
        dbEngine = 'mysql';
        console.log('✅ Connected to MySQL database:', MYSQL_CONFIG.database);
        return;
      }
    } catch (err) {
      console.warn('⚠️  MySQL connection failed (' + err.message + '). Switching seamlessly to SQLite mode for local zero-config execution.');
    }
  }

  // 2. SQLite mode (persisted to backend/database/eduscholar.sqlite)
  try {
    const dbPath = path.join(__dirname, '../database/eduscholar.sqlite');
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('foreign_keys = ON');
    dbEngine = 'sqlite';
    console.log('✅ SQLite database initialized at:', dbPath);
  } catch (sqliteErr) {
    console.error('Fatal error initializing SQLite database:', sqliteErr);
    throw sqliteErr;
  }
}

/**
 * Universal query runner:
 * Handles SQL translation for parameters (? or $1) and return format
 * Standard return: { rows: Array, insertId: Number, affectedRows: Number }
 */
async function query(sql, params = []) {
  if (!pool && !sqliteDb) {
    await initDatabase();
  }

  if (dbEngine === 'mysql' && pool) {
    try {
      const [results] = await pool.query(sql, params);
      if (Array.isArray(results)) {
        return { rows: results, insertId: null, affectedRows: 0 };
      } else {
        return {
          rows: [],
          insertId: results.insertId,
          affectedRows: results.affectedRows
        };
      }
    } catch (err) {
      console.error('MySQL Query Error:', err.message, 'SQL:', sql);
      throw err;
    }
  } else if (sqliteDb) {
    try {
      const trimmed = sql.trim();
      const isSelect = trimmed.toUpperCase().startsWith('SELECT') || trimmed.toUpperCase().startsWith('PRAGMA');
      
      // Clean up MySQL specific syntax if any
      let cleanSql = sql
        .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
        .replace(/INT AUTOINCREMENT/gi, 'INTEGER AUTOINCREMENT')
        .replace(/ENGINE=InnoDB/gi, '')
        .replace(/DEFAULT CHARSET=utf8mb4/gi, '')
        .replace(/COLLATE utf8mb4_unicode_ci/gi, '')
        .replace(/CHARACTER SET utf8mb4/gi, '')
        .replace(/TINYINT\(1\)/gi, 'INTEGER')
        .replace(/ENUM\([^)]+\)/gi, 'TEXT')
        .replace(/NOW\(\)/gi, "datetime('now')")
        .replace(/CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, "CURRENT_TIMESTAMP");

      if (isSelect) {
        const stmt = sqliteDb.prepare(cleanSql);
        const rows = stmt.all(...params);
        return { rows, insertId: null, affectedRows: 0 };
      } else {
        const stmt = sqliteDb.prepare(cleanSql);
        const info = stmt.run(...params);
        return {
          rows: [],
          insertId: info.lastInsertRowid,
          affectedRows: info.changes
        };
      }
    } catch (err) {
      console.error('SQLite Query Error:', err.message, 'SQL:', sql);
      throw err;
    }
  }
}

function getEngine() {
  return dbEngine;
}

module.exports = {
  initDatabase,
  query,
  getEngine
};
