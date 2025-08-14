import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function getDb() {
  const dbPath = path.join(process.cwd(), 'event.db');
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  return db;
}

export async function GET() {
  try {
    const db = await getDb();
    
    const attendees = await db.all(`
      SELECT 
        id,
        name,
        email,
        checkedIn,
        registeredAt,
        CASE WHEN checkedIn = 1 THEN 'Checked In' ELSE 'Registered' END as status
      FROM attendees 
      ORDER BY registeredAt DESC
    `);
    
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(checkedIn) as checkedIn,
        COUNT(*) - SUM(checkedIn) as pending
      FROM attendees
    `);
    
    return NextResponse.json({
      attendees,
      stats: {
        total: stats.total || 0,
        checkedIn: stats.checkedIn || 0,
        pending: stats.pending || 0
      }
    });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    );
  }
}