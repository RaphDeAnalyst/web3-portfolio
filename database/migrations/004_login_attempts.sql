-- Rate-limit table for admin login attempts.
-- Persists across serverless cold starts (replaces in-memory Map).
-- Run this in Supabase Studio → SQL Editor before deploying.

CREATE TABLE IF NOT EXISTS login_attempts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash      text        NOT NULL,
  attempts     integer     NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_attempts_ip_hash_idx ON login_attempts (ip_hash);
CREATE INDEX IF NOT EXISTS login_attempts_window_start_idx ON login_attempts (window_start);

-- No RLS needed — this table is only accessed via the service role key
-- in the server-side auth route. Block all direct anon/auth access.
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON login_attempts USING (false);

-- Auto-clean rows older than 1 hour so the table never grows unbounded.
-- Requires pg_cron extension (available on Supabase free tier).
-- If pg_cron is not enabled, run the DELETE manually or skip this block.
-- SELECT cron.schedule('clean-login-attempts', '0 * * * *', $$
--   DELETE FROM login_attempts WHERE window_start < now() - interval '1 hour';
-- $$);
