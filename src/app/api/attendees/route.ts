import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: attendees, error } = await supabase
      .from('attendees')
      .select('id, name, email, gender, year, batch, checked_in, registered_at')
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch attendees' },
        { status: 500 }
      );
    }

    return NextResponse.json(attendees || []);
  } catch (error) {
    console.error('Attendees fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}