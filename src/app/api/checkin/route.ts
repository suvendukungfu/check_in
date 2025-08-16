import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find attendee by token
    const { data: attendee, error: fetchError } = await supabase
      .from('attendees')
      .select('*')
      .eq('token', token)
      .single();

    if (fetchError || !attendee) {
      return NextResponse.json({ status: 'not_registered' });
    }

    if (attendee.checked_in) {
      return NextResponse.json({ 
        status: 'already_scanned', 
        name: attendee.name 
      });
    }

    // Update check-in status
    const { error: updateError } = await supabase
      .from('attendees')
      .update({ checked_in: true })
      .eq('token', token);

    if (updateError) {
      console.error('Check-in update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update check-in status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      status: 'success', 
      name: attendee.name 
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}