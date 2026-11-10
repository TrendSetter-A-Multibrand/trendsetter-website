-- Store staff who check guests in at an event. An owner sees every event; a store
-- admin sees the events of the stores listed in store_uuids (Storyblok story uuids).
CREATE TABLE IF NOT EXISTS staff (
  id            bigserial PRIMARY KEY,
  login         text NOT NULL UNIQUE CHECK (login = lower(btrim(login))),
  name          text NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN ('owner', 'store')),
  store_uuids   text[] NOT NULL DEFAULT '{}',
  disabled      boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Only the hash of the session token is kept: a copy of this table is no way in.
CREATE TABLE IF NOT EXISTS staff_sessions (
  token_hash text PRIMARY KEY,
  staff_id   bigint NOT NULL REFERENCES staff (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Set when the guest is let in at the door.
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS attended_at timestamptz;
