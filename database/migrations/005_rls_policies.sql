-- RLS policies for all public-facing tables.
-- Run this in Supabase Studio → SQL Editor.
-- These policies lock down the anon key to read-only access on published content.

-- ─── BLOGS ───────────────────────────────────────────────────────────────────
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "public read published blogs"
  ON blogs FOR SELECT
  USING (status = 'published');

-- Only service role can write (enforced by not granting INSERT/UPDATE/DELETE to anon)
-- Writes go through server actions which use SUPABASE_SERVICE_ROLE_KEY.

-- ─── PROJECTS ────────────────────────────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read projects"
  ON projects FOR SELECT
  USING (true);

-- ─── DASHBOARDS ──────────────────────────────────────────────────────────────
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active dashboards"
  ON dashboards FOR SELECT
  USING (is_active = true);

-- ─── PROFILES ────────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public can read non-sensitive profile fields; the view is built server-side
CREATE POLICY "public read profiles"
  ON profiles FOR SELECT
  USING (true);

-- ─── MEDIA ───────────────────────────────────────────────────────────────────
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read media"
  ON media FOR SELECT
  USING (true);

-- ─── ACTIVITY ────────────────────────────────────────────────────────────────
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read activity"
  ON activity FOR SELECT
  USING (true);
