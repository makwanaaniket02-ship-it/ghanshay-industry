// ============================================
// Database layer - SQLite (Node.js built-in, node:sqlite)
// File: data.db (inside project folder)
// Tables: bookings, callbacks, messages
// ============================================
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_FILE = path.join(__dirname, 'data.db');
const db = new DatabaseSync(DB_FILE);

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    machine TEXT DEFAULT '',
    phase TEXT DEFAULT '',
    cond TEXT DEFAULT '',
    biz TEXT DEFAULT '',
    note TEXT DEFAULT '',
    created TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS callbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mobile TEXT NOT NULL,
    created TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created TEXT NOT NULL
  );
`);

// import old bookings.json into the database once, if present
(function migrate() {
  const oldFile = path.join(__dirname, 'bookings.json');
  if (!fs.existsSync(oldFile)) return;
  try {
    const arr = JSON.parse(fs.readFileSync(oldFile, 'utf8'));
    if (Array.isArray(arr) && arr.length) {
      const ins = db.prepare(
        'INSERT INTO bookings (name,mobile,date,time,machine,phase,cond,biz,note,created) VALUES (?,?,?,?,?,?,?,?,?,?)'
      );
      for (const b of arr) {
        ins.run(b.name || '', b.mobile || '', b.date || '', b.time || '',
          b.machine || '', b.phase || '', b.cond || '', b.biz || '',
          b.note || '', b.created || new Date().toLocaleString('en-IN'));
      }
      console.log(`[db] imported ${arr.length} bookings from bookings.json`);
    }
    fs.renameSync(oldFile, oldFile + '.backup');
  } catch (e) {
    console.log('[db] migrate skip: ' + e.message);
  }
})();

const now = () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

module.exports = {
  // --- Bookings ---
  addBooking(b) {
    const r = db.prepare(
      'INSERT INTO bookings (name,mobile,date,time,machine,phase,cond,biz,note,created) VALUES (?,?,?,?,?,?,?,?,?,?)'
    ).run(b.name, b.mobile, b.date, b.time, b.machine || '', b.phase || '',
      b.cond || '', b.biz || '', b.note || '', now());
    return { id: Number(r.lastInsertRowid), ...b, created: now() };
  },
  recentBookings(limit = 10) {
    return db.prepare('SELECT * FROM bookings ORDER BY id DESC LIMIT ?').all(limit);
  },
  allBookings() {
    return db.prepare('SELECT * FROM bookings ORDER BY id DESC').all();
  },
  deleteBooking(id) {
    return db.prepare('DELETE FROM bookings WHERE id = ?').run(id).changes > 0;
  },
  // --- Callbacks ---
  addCallback(mobile) {
    const r = db.prepare('INSERT INTO callbacks (mobile,created) VALUES (?,?)').run(mobile, now());
    return { id: Number(r.lastInsertRowid), mobile };
  },
  allCallbacks() {
    return db.prepare('SELECT * FROM callbacks ORDER BY id DESC').all();
  },
  deleteCallback(id) {
    return db.prepare('DELETE FROM callbacks WHERE id = ?').run(id).changes > 0;
  },
  // --- Messages ---
  addMessage(name, message) {
    const r = db.prepare('INSERT INTO messages (name,message,created) VALUES (?,?,?)').run(name, message, now());
    return { id: Number(r.lastInsertRowid), name, message };
  },
  allMessages() {
    return db.prepare('SELECT * FROM messages ORDER BY id DESC').all();
  },
  deleteMessage(id) {
    return db.prepare('DELETE FROM messages WHERE id = ?').run(id).changes > 0;
  },
  // --- Stats ---
  stats() {
    const one = (sql, p = []) => db.prepare(sql).get(...p);
    return {
      bookings: one('SELECT COUNT(*) c FROM bookings').c,
      today: one("SELECT COUNT(*) c FROM bookings WHERE created LIKE ?", [`${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}%`]).c,
      callbacks: one('SELECT COUNT(*) c FROM callbacks').c,
      messages: one('SELECT COUNT(*) c FROM messages').c,
    };
  },
};
