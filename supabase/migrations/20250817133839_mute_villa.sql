/*
  # Create attendees table for event check-in system

  1. New Tables
    - `attendees`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, unique, required)
      - `gender` (text, required - male/female/other)
      - `year` (integer, required - 1 or 2)
      - `batch` (text, required - ramanujan/hopper/turing/newmann)
      - `token` (text, unique, required for QR codes)
      - `checked_in` (boolean, default false)
      - `registered_at` (timestamp, default now)

  2. Security
    - Enable RLS on `attendees` table
    - Add policies for public registration and check-in
    - Add policy for reading attendee data

  3. Indexes
    - Index on email for fast lookups
    - Index on token for QR code scanning
*/

CREATE TABLE IF NOT EXISTS attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  year integer NOT NULL CHECK (year IN (1, 2)),
  batch text NOT NULL CHECK (batch IN ('ramanujan', 'hopper', 'turing', 'newmann')),
  token text UNIQUE NOT NULL,
  checked_in boolean DEFAULT false,
  registered_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Allow public registration (insert)
CREATE POLICY "Allow public registration"
  ON attendees
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public check-in updates
CREATE POLICY "Allow public check-in"
  ON attendees
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow public read access for admin panel and check-in
CREATE POLICY "Allow public read access"
  ON attendees
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendees_email ON attendees(email);
CREATE INDEX IF NOT EXISTS idx_attendees_token ON attendees(token);
CREATE INDEX IF NOT EXISTS idx_attendees_checked_in ON attendees(checked_in);