-- =====================================================
-- Dune Analytics Cache — Chart definitions & cached results
-- =====================================================
-- Two tables:
--   dune_charts : chart config (query_id, mode, display settings)
--   dune_cache  : one row per chart holding the cached result JSON
--
-- Three modes:
--   snapshot   — cron upserts daily (latest state)
--   timeseries — cron appends into JSONB array, deduped by x_key
--   static     — frozen permanently; cron skips (is_static = true)
--
-- Linking:
--   project_id set → embedded in /work/[id]
--   blog_id set    → embedded in /blog/[slug]
--   both null      → global chart on /dashboards
--
-- Author: Matthew Raphael
-- Migration: 006
-- =====================================================

-- =====================================================
-- DUNE_CHARTS TABLE (config)
-- =====================================================
CREATE TABLE IF NOT EXISTS dune_charts (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_id         BIGINT NOT NULL,
    title            TEXT NOT NULL,
    description      TEXT,
    chart_type       TEXT NOT NULL DEFAULT 'line'
                       CHECK (chart_type IN ('line','area','bar','pie')),
    mode             TEXT NOT NULL DEFAULT 'snapshot'
                       CHECK (mode IN ('snapshot','timeseries','static')),
    -- content association (both nullable; null = global /dashboards chart)
    project_id       UUID REFERENCES projects(id) ON DELETE SET NULL,
    blog_id          UUID REFERENCES blogs(id) ON DELETE SET NULL,
    -- axis config
    x_key            TEXT,
    y_keys           TEXT[] NOT NULL DEFAULT '{}',
    -- static / pin fields
    is_static        BOOLEAN NOT NULL DEFAULT false,
    pinned_at        TIMESTAMP WITH TIME ZONE,
    pinned_note      TEXT,
    -- management
    display_order    INTEGER NOT NULL DEFAULT 0,
    is_active        BOOLEAN NOT NULL DEFAULT true,
    last_refreshed_at TIMESTAMP WITH TIME ZONE,
    last_error       TEXT,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dune_charts_active_order
    ON dune_charts (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_dune_charts_project
    ON dune_charts (project_id);
CREATE INDEX IF NOT EXISTS idx_dune_charts_blog
    ON dune_charts (blog_id);

-- =====================================================
-- DUNE_CACHE TABLE (one row per chart, always)
-- =====================================================
CREATE TABLE IF NOT EXISTS dune_cache (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chart_id      UUID NOT NULL UNIQUE REFERENCES dune_charts(id) ON DELETE CASCADE,
    execution_id  TEXT,
    result_data   JSONB NOT NULL DEFAULT '[]',
    row_count     INTEGER NOT NULL DEFAULT 0,
    fetched_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE dune_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dune_cache  ENABLE ROW LEVEL SECURITY;

-- Public can read active charts
DROP POLICY IF EXISTS "public read active dune_charts" ON dune_charts;
CREATE POLICY "public read active dune_charts"
    ON dune_charts FOR SELECT
    USING (is_active = true);

-- Public can read cache (data access controlled via chart RLS)
DROP POLICY IF EXISTS "public read dune_cache" ON dune_cache;
CREATE POLICY "public read dune_cache"
    ON dune_cache FOR SELECT
    USING (true);

-- Service role bypasses RLS for all writes (no explicit write policies needed)
