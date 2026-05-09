-- Migration: Add PDF report support to projects table
-- Description: Adds file_url column to store Supabase Storage URLs for PDF investigation reports
-- Created: 2026-05-09

-- UP: Add file_url column
ALTER TABLE projects
ADD COLUMN file_url TEXT DEFAULT NULL;

-- Add comment documenting the column
COMMENT ON COLUMN projects.file_url IS 'Public Supabase Storage URL for hosted PDF investigation reports. Nullable - only projects with file hosting will have this populated.';

-- Create reports bucket (if using SQL-based bucket management)
-- Note: This may need to be done via Supabase dashboard instead
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('reports', 'reports', true)
-- ON CONFLICT (id) DO NOTHING;

-- Set bucket policy for public read access (if bucket already exists)
-- CREATE POLICY "Public read access for reports"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'reports');

-- DOWN: Remove file_url column
-- ALTER TABLE projects DROP COLUMN IF EXISTS file_url;
