// server.js
const express = require('express');
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// SQLite DB setup - use persistent database
const dbPath = path.join(__dirname, 'event-server.db');
const db = new sqlite3.Database(dbPath);

db.run(`CREATE TABLE attendees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  gender TEXT,
  year INTEGER,
  batch TEXT,
  token TEXT UNIQUE,
  checkedIn INTEGER DEFAULT 0,
  registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Get all attendees endpoint
app.get('/attendees', (req, res) => {
  db.all(`SELECT id, name, email, gender, year, batch, checkedIn, registeredAt FROM attendees ORDER BY registeredAt DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { name, email, gender, year, batch } = req.body;
  if (!name || !email || !gender || !year || !batch) return res.status(400).json({ error: 'Missing fields' });

  // Check if email already exists
  db.get(`SELECT email FROM attendees WHERE email = ?`, [email.toLowerCase()], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row) {
      return res.status(409).json({ error: 'This email is already registered for the event' });
    }

    const token = nanoid(24);
    db.run(`INSERT INTO attendees (name, email, gender, year, batch, token) VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), email.toLowerCase(), gender, year, batch, token], async function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'This email is already registered for the event' });
          }
          return res.status(500).json({ error: err.message });
        }

        const qrUrl = `http://localhost:3000/checkin?t=${token}`;
        const qrImage = await QRCode.toBuffer(qrUrl, { type: 'png', width: 600 });
        const fileName = `event-ticket-${name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'image/png');
        res.send(qrImage);
      });
  });
});

// Check-in endpoint
app.post('/checkin', (req, res) => {
  const { token } = req.body;
  db.get(`SELECT * FROM attendees WHERE token = ?`, [token], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      return res.json({ status: 'not_registered' });
    }

    if (row.checkedIn) {
      return res.json({ status: 'already_scanned', name: row.name });
    }

    db.run(`UPDATE attendees SET checkedIn = 1 WHERE token = ?`, [token], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ status: 'success', name: row.name });
    });
  });
});

app.listen(4000, () => console.log('API running on http://localhost:4000'));