-- Remove category constraint entirely to allow any category value
-- Run this in your Supabase SQL Editor

-- Drop the problematic category constraint
ALTER TABLE dashboards DROP CONSTRAINT IF EXISTS dashboards_category_check;

-- Verify the constraint is gone
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'dashboards'::regclass AND contype = 'c' AND conname LIKE '%category%';

-- Show success message
SELECT 'Category constraint removed - you can now use any category including gaming, analytics, etc.' as message;