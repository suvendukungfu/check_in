import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { name, email, gender, year, batch } = await request.json();
    
    // Validate required fields
    if (!name || !email || !gender || !year || !batch) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate field values
    if (!['male', 'female', 'other'].includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
        { status: 400 }
      );
    }

    if (![1, 2].includes(parseInt(year))) {
      return NextResponse.json(
        { error: 'Year must be 1 or 2' },
        { status: 400 }
      );
    }

    if (!['ramanujan', 'hopper', 'turing', 'newmann'].includes(batch)) {
      return NextResponse.json(
        { error: 'Invalid batch value' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('attendees')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered for the event' },
        { status: 409 }
      );
    }

    // Generate unique token for QR code
    const token = nanoid(24);

    // Insert new attendee
    const { error: insertError } = await supabase
      .from('attendees')
      .insert({
        name: name.trim(),
        email: email.toLowerCase(),
        gender,
        year: parseInt(year),
        batch,
        token,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      if (insertError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'This email is already registered for the event' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 500 }
      );
    }

    // Generate QR code
    const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkin?t=${token}`;
    const qrBuffer = await QRCode.toBuffer(qrUrl, { 
      type: 'png', 
      width: 600,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Return QR code as downloadable file
    const fileName = `event-ticket-${name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    
    return new NextResponse(qrBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}