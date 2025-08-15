import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if Express server is running by making a request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    let response;
    try {
      response = await fetch('http://localhost:4000/attendees', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Failed to connect to Express server:', fetchError);
      return NextResponse.json(
        { 
          error: 'Express server not available. Please ensure the Express server is running on port 4000.',
          details: 'Run "npm run server" in a separate terminal or use "node start-all.js" to start both servers.'
        },
        { status: 503 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Express server error:', response.status, errorText);
      return NextResponse.json(
        { error: `Express server error: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('Express server returned non-JSON response:', responseText.substring(0, 200));
      return NextResponse.json(
        { error: 'Express server returned invalid response format' },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Attendees fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}