-- Fix existing invalid categories before applying constraint
-- Run this in your Supabase SQL Editor

-- First, let's see what categories currently exist
SELECT DISTINCT category, COUNT(*) as count
FROM dashboards
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;

-- Update any invalid categories to 'other'
-- Valid categories: 'defi', 'nft', 'gaming', 'infrastructure', 'analytics', 'governance', 'trading', 'yield', 'security', 'metrics', 'other'
UPDATE dashboards
SET category = 'other'
WHERE category IS NOT NULL
  AND category NOT IN ('defi', 'nft', 'gaming', 'infrastructure', 'analytics', 'governance', 'trading', 'yield', 'security', 'metrics', 'other');

-- Show what we changed
SELECT 'Updated invalid categories to other' as message;

-- Now check categories again
SELECT DISTINCT category, COUNT(*) as count
FROM dashboards
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;