/*
  # Add interest column to attendees table

  1. Changes
    - Add `interest` column to `attendees` table
    - Column allows selection from predefined interest areas
    - Column is required for new registrations

  2. Interest Options
    - electronics
    - iot
    - physics
    - math
    - mechanics
    - dev
    - robotic operating system
    - astronomy
    - content creation
    - editor ppt
    - ai/ml developer
    - cool guys
    - others
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'attendees' AND column_name = 'interest'
  ) THEN
    ALTER TABLE attendees ADD COLUMN interest text NOT NULL DEFAULT 'others' 
    CHECK (interest IN (
      'electronics',
      'iot', 
      'physics',
      'math',
      'mechanics',
      'dev',
      'robotic operating system',
      'astronomy',
      'content creation',
      'editor ppt',
      'ai/ml developer',
      'cool guys',
      'others'
    ));
  END IF;
END $$;