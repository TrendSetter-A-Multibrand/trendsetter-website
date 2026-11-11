-- A guest cancels with the link in the confirmation e-mail. Only the hash of the
-- link's token is kept, like the sessions': a copy of this table cancels nobody.
-- Rows made before this have none and cannot be cancelled that way.
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS cancel_hash text;
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_cancel_hash
  ON event_registrations (cancel_hash) WHERE cancel_hash IS NOT NULL;
