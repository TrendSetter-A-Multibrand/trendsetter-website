CREATE TABLE IF NOT EXISTS event_registrations (
  id         bigserial PRIMARY KEY,
  event_uuid text NOT NULL,
  email      text NOT NULL CHECK (email = lower(btrim(email))),
  consent_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_uuid, email)
);
