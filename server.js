// ============================================
// Priyal Industry - server (Express + SQLite + EJS)
// Routes:
//   /               → website
//   /api/book       → visit booking (POST)
//   /api/bookings   → recent bookings (GET)
//   /api/callback   → callback request (POST)
//   /api/contact    → contact message (POST)
//   /admin          → admin panel (password protected)
// ============================================
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const site = require('./config');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function phoneDisplay() {
  return site.OWNER_PHONE ? '+' + site.OWNER_PHONE : 'Updating soon';
}
function waLink(msg) {
  if (!site.OWNER_PHONE) return '#';
  const text = msg || ('Hello, ' + site.company + ' — I need information about your machines');
  return 'https://wa.me/' + site.OWNER_PHONE + '?text=' + encodeURIComponent(text);
}
const validMobile = (m) => /^[6-9]\d{9}$/.test((m || '').trim());

// ---------- Admin auth (cookie based) ----------
const ADMIN_TOKEN = crypto.createHash('sha256')
  .update(String(site.ADMIN_PASSWORD) + '::gi-admin-salt').digest('hex');

function getCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(c => {
    const i = c.indexOf('=');
    if (i > 0) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim());
  });
  return out;
}
function adminAuth(req, res, next) {
  if (getCookies(req).gi_admin === ADMIN_TOKEN) return next();
  return res.redirect('/admin/login');
}

// ---------- Public page ----------
app.get('/', (req, res) => {
  res.render('index', { site, phoneDisplay: phoneDisplay(), waLink, waDefault: waLink() });
});

// ---------- Machine detail page ----------
app.get('/machine/:slug', (req, res) => {
  const p = site.products.find(x => x.slug === req.params.slug);
  if (!p) return res.status(404).send('Machine not found');
  const others = site.products.filter(x => x.slug !== p.slug);
  res.render('machine', { site, product: p, others, phoneDisplay: phoneDisplay(), waLink, waDefault: waLink() });
});

// ---------- Booking page (separate page, not on home) ----------
app.get('/book-visit', (req, res) => {
  res.render('book-visit', { site, phoneDisplay: phoneDisplay(), waLink, waDefault: waLink() });
});

// ---------- Machines listing page ----------
app.get('/machines', (req, res) => {
  res.render('machines', { site, phoneDisplay: phoneDisplay(), waLink, waDefault: waLink() });
});

// ---------- Public API ----------
app.post('/api/book', (req, res) => {
  const { name, mobile, date, time, machine, phase, cond, biz, note } = req.body || {};
  if (!name || name.trim().length < 3) return res.status(400).json({ ok: false, error: 'Please enter your name' });
  if (!validMobile(mobile)) return res.status(400).json({ ok: false, error: 'Enter a valid 10-digit mobile number' });
  if (!date || !time) return res.status(400).json({ ok: false, error: 'Please select a date and time' });
  const booking = db.addBooking({
    name: name.trim(), mobile: mobile.trim(), date, time,
    machine: machine || '', phase: phase || '', cond: cond || '',
    biz: biz || '', note: (note || '').trim(),
  });
  const extra = [booking.phase, booking.cond].filter(Boolean).join(', ');
  const waText = `Hello, I am ${booking.name} (${booking.mobile}). I want to book a visit for ${booking.machine}${extra ? ' (' + extra + ')' : ''}. Date: ${booking.date}, Time: ${booking.time}, Type: ${booking.biz}. Note: ${booking.note}`;
  res.json({ ok: true, booking, waLink: waLink(waText) });
});

app.get('/api/bookings', (req, res) => {
  res.json({ ok: true, bookings: db.recentBookings(10) });
});

app.post('/api/callback', (req, res) => {
  const { mobile } = req.body || {};
  if (!validMobile(mobile)) return res.status(400).json({ ok: false, error: 'Enter a valid mobile number' });
  db.addCallback(mobile.trim());
  return res.json({ ok: true, message: 'Thank you! We will call you back shortly.' });
});

app.post('/api/contact', (req, res) => {
  const { name, message } = req.body || {};
  if (!name || name.trim().length < 2) return res.status(400).json({ ok: false, error: 'Please enter your name' });
  if (!message || message.trim().length < 2) return res.status(400).json({ ok: false, error: 'Please write your message' });
  db.addMessage(name.trim(), message.trim());
  return res.json({ ok: true, message: 'Message received! We will reply soon.' });
});

// ---------- Admin ----------
app.get('/admin/login', (req, res) => {
  if (getCookies(req).gi_admin === ADMIN_TOKEN) return res.redirect('/admin');
  res.render('admin-login', { error: '' });
});

app.post('/admin/login', (req, res) => {
  if (String(req.body.password || '') === String(site.ADMIN_PASSWORD)) {
    res.setHeader('Set-Cookie', `gi_admin=${ADMIN_TOKEN}; HttpOnly; Path=/; Max-Age=86400`);
    return res.redirect('/admin');
  }
  res.status(401).render('admin-login', { error: 'Wrong password' });
});

app.get('/admin/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'gi_admin=; HttpOnly; Path=/; Max-Age=0');
  res.redirect('/admin/login');
});

app.get('/admin', adminAuth, (req, res) => {
  res.render('admin', {
    site,
    stats: db.stats(),
    bookings: db.allBookings(),
    callbacks: db.allCallbacks(),
    messages: db.allMessages(),
  });
});

app.delete('/admin/api/:type/:id', adminAuth, (req, res) => {
  const id = Number(req.params.id);
  let ok = false;
  if (req.params.type === 'bookings') ok = db.deleteBooking(id);
  else if (req.params.type === 'callbacks') ok = db.deleteCallback(id);
  else if (req.params.type === 'messages') ok = db.deleteMessage(id);
  else return res.status(400).json({ ok: false });
  res.json({ ok });
});

app.listen(PORT, () => {
  console.log(`${site.company} website running: http://localhost:${PORT}`);
});
