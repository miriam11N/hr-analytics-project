const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite DB path (from your data folder)
const DB_PATH = path.resolve(__dirname, '..', 'data', 'hr_analytics.db');

console.log('Using SQLite DB at:', DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Promisified helper functions
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function queryOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

module.exports = { db, query, queryOne };
