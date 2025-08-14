import QRCode from 'qrcode';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Initialize database connection
let db: any = null;

async function getDb() {
  if (db) return db;
  
  // Use a persistent database file instead of in-memory
  const dbPath = path.join(process.cwd(), 'event.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // Create table if it doesn't exist
  await db.exec(`CREATE TABLE IF NOT EXISTS attendees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    checkedIn INTEGER DEFAULT 0,
    registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(16).toString('hex');
    
    // Get database connection
    const database = await getDb();
    
    try {
      // Check if email already exists
      const existingUser = await database.get(
        'SELECT email FROM attendees WHERE email = ?',
        [email.toLowerCase()]
      );
      
      if (existingUser) {
        return NextResponse.json({ 
          error: 'This email is already registered for the event' 
        }, { status: 409 });
      }
      
      // Save to DB with lowercase email for consistency
      await database.run(
        'INSERT INTO attendees (name, email, token, checkedIn) VALUES (?, ?, ?, 0)',
        [name.trim(), email.toLowerCase(), token]
      );
    } catch (dbError: any) {
      if (dbError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return NextResponse.json({ 
          error: 'This email is already registered for the event' 
        }, { status: 409 });
      }
      throw dbError;
    }

    // Create QR code with check-in URL
    const checkInUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkin?t=${token}`;
    
    // Generate QR code as PNG buffer for download
    const qrBuffer = await QRCode.toBuffer(checkInUrl, { 
      type: 'png', 
      width: 600,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Return the QR code as a downloadable file
    const fileName = `event-ticket-${name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    
    return new NextResponse(qrBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': qrBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register attendee' },
      { status: 500 }
    );
  }
}