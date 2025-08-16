import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      attendees: {
        Row: {
          id: string;
          name: string;
          email: string;
          gender: 'male' | 'female' | 'other';
          year: 1 | 2;
          batch: 'ramanujan' | 'hopper' | 'turing' | 'newmann';
          token: string;
          checked_in: boolean;
          registered_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          gender: 'male' | 'female' | 'other';
          year: 1 | 2;
          batch: 'ramanujan' | 'hopper' | 'turing' | 'newmann';
          token: string;
          checked_in?: boolean;
          registered_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          gender?: 'male' | 'female' | 'other';
          year?: 1 | 2;
          batch?: 'ramanujan' | 'hopper' | 'turing' | 'newmann';
          token?: string;
          checked_in?: boolean;
          registered_at?: string;
        };
      };
    };
  };
};