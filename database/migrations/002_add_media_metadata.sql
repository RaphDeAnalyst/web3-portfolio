-- Add metadata columns to media table for enhanced YouTube and Google Drive support
-- Run this in your Supabase SQL editor

-- Add new columns for enhanced metadata
ALTER TABLE media
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Update existing records to use filename as title where title is null
UPDATE media
SET title = filename
WHERE title IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_title ON media(title);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);

-- Add comment explaining the schema
COMMENT ON COLUMN media.title IS 'Display title for the media (e.g., YouTube video title, custom document name)';
COMMENT ON COLUMN media.description IS 'Description or caption for the media';
COMMENT ON COLUMN media.thumbnail_url IS 'Thumbnail image URL (e.g., YouTube video thumbnail)';
COMMENT ON COLUMN media.duration IS 'Duration for video content (YouTube format: PT1M30S)';
COMMENT ON COLUMN media.metadata IS 'Additional metadata as JSON (e.g., video duration, file info)';