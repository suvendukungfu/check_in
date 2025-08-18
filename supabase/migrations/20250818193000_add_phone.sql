/*
  # Add phone column to attendees table

  - Adds a nullable phone column so existing rows remain valid
  - Adds an index for faster lookup if needed later
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attendees' AND column_name = 'phone'
  ) THEN
    ALTER TABLE attendees ADD COLUMN phone text;
    CREATE INDEX IF NOT EXISTS idx_attendees_phone ON attendees(phone);
  END IF;
END $$;


