-- Fix category constraint to allow all categories used in the frontend
-- Run this in your Supabase SQL Editor

-- Drop the existing category constraint
ALTER TABLE dashboards DROP CONSTRAINT IF EXISTS dashboards_category_check;

-- Add new constraint that allows all categories from the frontend
ALTER TABLE dashboards ADD CONSTRAINT dashboards_category_check
CHECK (category IN ('defi', 'nft', 'gaming', 'infrastructure', 'analytics', 'governance', 'trading', 'yield', 'security', 'metrics', 'other') OR category IS NULL);

-- Show current constraint info
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'dashboards'::regclass AND contype = 'c';