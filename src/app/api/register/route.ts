import QRCode from 'qrcode';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize database connection
let db: any = null;

async function getDb() {
  if (db) return db;
  
  db = await open({
    filename: './event.db',
    driver: sqlite3.Database
  });
  
  // Create table if it doesn't exist
  await db.exec(`CREATE TABLE IF NOT EXISTS attendees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    checkedIn INTEGER DEFAULT 0
  )`);
  
  return db;
}

interface RegistrationRequest {
  name: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json() as RegistrationRequest;
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(16).toString('hex');
    
    // Get database connection
    const database = await getDb();
    
    // Save to DB
    await database.run(
      'INSERT INTO attendees (name, email, token, checkedIn) VALUES (?, ?, ?, 0)',
      [name, email, token]
    );

    // Create QR code with check-in URL
    const checkInUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkin?t=${token}`;
    const qrDataUrl = await QRCode.toDataURL(checkInUrl, { width: 600 });

    return NextResponse.json({ qrDataUrl });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register attendee' },
      { status: 500 }
    );
  }
}