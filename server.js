// server.js
const express = require('express');
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// SQLite DB setup
const db = new sqlite3.Database(':memory:');
db.run(`CREATE TABLE attendees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  token TEXT UNIQUE,
  checkedIn INTEGER DEFAULT 0
)`);

// Registration endpoint
app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Missing fields' });

  const token = nanoid(24);
  db.run(`INSERT INTO attendees (name, email, token) VALUES (?, ?, ?)`,
    [name, email, token], async function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const qrUrl = `https://localhost:3000/checkin?t=${token}`;
      const qrImage = await QRCode.toBuffer(qrUrl, { type: 'png', width: 300 });
      res.setHeader('Content-Disposition', `attachment; filename="ticket.png"`);
      res.setHeader('Content-Type', 'image/png');
      res.send(qrImage);
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