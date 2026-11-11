-- A guest who signs up through the loyalty programme is not described here at all:
-- name, phone and e-mail live in the loyalty service. Only the number of the
-- guest's card says whose sign-up it is, so a row of this kind has no e-mail.
-- Rows made before this keep what they had.
ALTER TABLE event_registrations ALTER COLUMN email DROP NOT NULL;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS card_barcode text;
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_event_card
  ON event_registrations (event_uuid, card_barcode) WHERE card_barcode IS NOT NULL;
