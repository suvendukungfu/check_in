import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward request to Express server
    const response = await fetch('http://localhost:4000/attendees');
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Attendees fetch proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to attendees service' },
      { status: 500 }
    );
  }
}