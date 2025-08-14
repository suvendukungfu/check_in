import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db: any = null;

// Reuse the database connection function
async function getDb() {
  if (db) return db;
  
  const dbPath = path.join(process.cwd(), 'event.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // Create table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS attendees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      token TEXT UNIQUE NOT NULL,
      checkedIn INTEGER DEFAULT 0,
      registeredAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  return db;
}

interface CheckinRequest {
  token: string;
}

interface Attendee {
  id: number;
  name: string;
  email: string;
  token: string;
  checkedIn: number;
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json() as CheckinRequest;
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Get database connection
    const db = await getDb();
    
    // Check if attendee exists
    const attendee = await db.get('SELECT * FROM attendees WHERE token = ?', [token]);
    
    if (!attendee) {
      return NextResponse.json({ status: 'not_registered' });
    }
    
    if (attendee.checkedIn) {
      return NextResponse.json({ 
        status: 'already_scanned', 
        name: attendee.name 
      });
    }
    
    // Update check-in status
    await db.run('UPDATE attendees SET checkedIn = 1 WHERE token = ?', [token]);
    
    return NextResponse.json({ 
      status: 'success', 
      name: attendee.name 
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 }
    );
  }
}