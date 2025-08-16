const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create attendees table
db.serialize(() => {
  db.run(`
    CREATE TABLE attendees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
      year INTEGER NOT NULL CHECK (year IN (1, 2)),
      batch TEXT NOT NULL CHECK (batch IN ('ramanujan', 'hopper', 'turing', 'newmann')),
      token TEXT UNIQUE NOT NULL,
      checked_in BOOLEAN DEFAULT 0,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { name, email, gender, year, batch } = req.body;
    
    // Validate required fields
    if (!name || !email || !gender || !year || !batch) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate field values
    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender value' });
    }

    if (![1, 2].includes(parseInt(year))) {
      return res.status(400).json({ error: 'Year must be 1 or 2' });
    }

    if (!['ramanujan', 'hopper', 'turing', 'newmann'].includes(batch)) {
      return res.status(400).json({ error: 'Invalid batch value' });
    }

    // Generate unique token
    const token = nanoid(24);
    
    // Insert into database
    db.run(
      `INSERT INTO attendees (name, email, gender, year, batch, token) VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), email.toLowerCase(), gender, parseInt(year), batch, token],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ error: 'This email is already registered for the event' });
          }
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        // Generate QR code
        const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkin?t=${token}`;
        QRCode.toBuffer(qrUrl, { 
          type: 'png', 
          width: 600,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }, (qrErr, buffer) => {
          if (qrErr) {
            console.error('QR code generation error:', qrErr);
            return res.status(500).json({ error: 'Failed to generate QR code' });
          }
          
          const fileName = `event-ticket-${name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
          res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${fileName}"`,
          });
          res.send(buffer);
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check-in endpoint
app.post('/checkin', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  db.get(
    'SELECT * FROM attendees WHERE token = ?',
    [token],
    (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.json({ status: 'not_registered' });
      }
      
      if (row.checked_in) {
        return res.json({ status: 'already_scanned', name: row.name });
      }
      
      // Update check-in status
      db.run(
        'UPDATE attendees SET checked_in = 1 WHERE token = ?',
        [token],
        function(updateErr) {
          if (updateErr) {
            console.error('Update error:', updateErr);
            return res.status(500).json({ error: 'Failed to update check-in status' });
          }
          
          res.json({ status: 'success', name: row.name });
        }
      );
    }
  );
});

// Get all attendees endpoint
app.get('/attendees', (req, res) => {
  db.all(
    'SELECT id, name, email, gender, year, batch, checked_in, registered_at FROM attendees ORDER BY registered_at DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch attendees' });
      }
      
      res.json(rows || []);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});