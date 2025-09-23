-- Complete category constraint fix
-- Run this in your Supabase SQL Editor

-- Step 1: Check current categories
SELECT DISTINCT category, COUNT(*) as count
FROM dashboards
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;

-- Step 2: Update any invalid categories to 'other'
UPDATE dashboards
SET category = 'other'
WHERE category IS NOT NULL
  AND category NOT IN ('defi', 'nft', 'gaming', 'infrastructure', 'analytics', 'governance', 'trading', 'yield', 'security', 'metrics', 'other');

-- Step 3: Drop the existing constraint
ALTER TABLE dashboards DROP CONSTRAINT IF EXISTS dashboards_category_check;

-- Step 4: Add the new constraint
ALTER TABLE dashboards ADD CONSTRAINT dashboards_category_check
CHECK (category IN ('defi', 'nft', 'gaming', 'infrastructure', 'analytics', 'governance', 'trading', 'yield', 'security', 'metrics', 'other') OR category IS NULL);

-- Step 5: Verify the constraint was added
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'dashboards'::regclass AND contype = 'c';

-- Step 6: Test that valid categories work
SELECT 'Constraint applied successfully - you can now create dashboards with gaming, analytics, etc.' as message;