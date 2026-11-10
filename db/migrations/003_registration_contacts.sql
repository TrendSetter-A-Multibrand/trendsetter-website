-- Who signed up, and how to reach them. Rows made before this have neither.
ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text;
