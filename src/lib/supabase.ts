import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Attendee {
  id: string
  name: string
  email: string
  gender: 'male' | 'female' | 'other'
  year: 1 | 2
  batch: 'ramanujan' | 'hopper' | 'turing' | 'newmann'
  token: string
  checked_in: boolean
  registered_at: string
}