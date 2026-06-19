-- =====================================================
-- Migration 008: Investigation fields on projects
-- =====================================================
-- Adds four structured narrative columns for Investigation-type projects
-- and locks the category column to its three intended values.
--
-- category is the project type discriminator (set on the /admin Add form
-- as Investigation / Research / Analytics). This constraint formalises
-- what was already the enforced practice.
--
-- The four investigation columns are NULL for Research and Analytics rows;
-- only populated when category = 'Investigation'.
-- =====================================================

-- Lock category to the three intended values.
-- Existing data confirmed clean (only 'Investigation' present, 3 rows).
ALTER TABLE projects
  ADD CONSTRAINT projects_category_check
  CHECK (category IN ('Investigation', 'Research', 'Analytics'));

-- Structured narrative fields for Investigation-type projects.
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS investigation_mandate     TEXT,
  ADD COLUMN IF NOT EXISTS investigation_methodology TEXT,
  ADD COLUMN IF NOT EXISTS investigation_findings    TEXT,
  ADD COLUMN IF NOT EXISTS investigation_outcome     TEXT;

COMMENT ON CONSTRAINT projects_category_check ON projects
  IS 'category is the project type discriminator; only these three values are valid';
COMMENT ON COLUMN projects.investigation_mandate
  IS 'Investigation: the question or mandate given';
COMMENT ON COLUMN projects.investigation_methodology
  IS 'Investigation: how the analysis was conducted';
COMMENT ON COLUMN projects.investigation_findings
  IS 'Investigation: key findings (may include addresses/tx hashes)';
COMMENT ON COLUMN projects.investigation_outcome
  IS 'Investigation: what was established and at what confidence';
