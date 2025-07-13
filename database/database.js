const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

// Inisialisasi database
function initDB() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      chat_id INTEGER PRIMARY KEY,
      username TEXT,
      subscribed INTEGER DEFAULT 0
    )
  `);
}

// Simpan user saat /start
function saveUser(user) {
  const chat_id = user.id;
  const username = user.username || '';
  db.run(`
    INSERT OR IGNORE INTO users (chat_id, username) VALUES (?, ?)
  `, [chat_id, username]);
}

// Ambil semua user
function getAllUsers(callback) {
  db.all(`SELECT chat_id, username FROM users`, (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      callback(rows);
    }
  });
}

// Update status langganan
function updateSubscription(chat_id, status) {
  db.run(`UPDATE users SET subscribed = ? WHERE chat_id = ?`, [status ? 1 : 0, chat_id]);
}

// Ambil chat_id yang berlangganan
function getSubscribedChatIds(callback) {
  db.all(`SELECT chat_id FROM users WHERE subscribed = 1`, (err, rows) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      callback(rows.map(row => row.chat_id));
    }
  });
}

module.exports = {
  initDB,
  saveUser,
  getAllUsers,
  updateSubscription,
  getSubscribedChatIds,
};
