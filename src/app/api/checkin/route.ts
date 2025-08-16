import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward request to Express server
    const response = await fetch('http://localhost:4000/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Check-in proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to check-in service' },
      { status: 500 }
    );
  }
}