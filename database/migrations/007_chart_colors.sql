-- Migration 007: add chart_colors to dune_charts
ALTER TABLE dune_charts
  ADD COLUMN IF NOT EXISTS chart_colors TEXT[] NOT NULL DEFAULT '{}';

-- Migrate the Ethereum Transaction Success pie chart
UPDATE dune_charts
  SET chart_colors = ARRAY['blue', 'gold']
  WHERE title ILIKE '%ethereum transaction success%'
    AND chart_type = 'pie';
