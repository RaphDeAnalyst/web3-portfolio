-- Web3 Portfolio Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  author_name TEXT NOT NULL DEFAULT 'Matthew Raphael',
  author_avatar TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  views INTEGER DEFAULT 0,
  origin TEXT NOT NULL DEFAULT 'user' CHECK (origin IN ('default', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'Development',
  featured BOOLEAN DEFAULT FALSE,
  github_url TEXT,
  demo_url TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Matthew Raphael',
  bio TEXT NOT NULL DEFAULT '',
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  tools TEXT[] DEFAULT ARRAY[]::TEXT[],
  values TEXT[] DEFAULT ARRAY[]::TEXT[],
  contact_email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  avatar_url TEXT,
  resume_url TEXT,
  story TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  storage_provider TEXT NOT NULL DEFAULT 'supabase' CHECK (storage_provider IN ('supabase', 'imgbb', 'youtube', 'googledrive')),
  bucket_name TEXT,
  file_path TEXT,
  thumbnail_url TEXT,
  video_id TEXT, -- For YouTube videos
  drive_file_id TEXT, -- For Google Drive files
  is_public BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  intensity INTEGER NOT NULL DEFAULT 1 CHECK (intensity >= 1 AND intensity <= 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_media_provider ON media(storage_provider);
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_usage ON media(usage_count DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - Enable but allow all for now
-- In production, you'd want proper authentication
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (update these with proper auth later)
CREATE POLICY "Allow all operations on blogs" ON blogs FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on profile" ON profile FOR ALL USING (true);
CREATE POLICY "Allow all operations on media" ON media FOR ALL USING (true);
CREATE POLICY "Allow all operations on activities" ON activities FOR ALL USING (true);

-- Insert default profile if not exists
INSERT INTO profile (name, bio, skills, tools, values, contact_email, github_url, linkedin_url, twitter_url)
SELECT 
  'Matthew Raphael',
  'Web3 Data & AI Specialist transitioning from traditional analytics to blockchain insights.',
  ARRAY['Web3 Analytics', 'Data Analysis', 'Python', 'SQL', 'Statistical Modeling'],
  ARRAY['Dune Analytics', 'Python', 'SQL', 'Jupyter', 'Git'],
  ARRAY['Transparency', 'Decentralization', 'Innovation'],
  'matthew@example.com',
  'https://github.com/matthew',
  'https://linkedin.com/in/matthew',
  'https://twitter.com/matthew_nnamani'
WHERE NOT EXISTS (SELECT 1 FROM profile LIMIT 1);

-- Create function to increment blog views
CREATE OR REPLACE FUNCTION increment_blog_views(blog_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE blogs SET views = views + 1 WHERE slug = blog_slug;
END;
$$ LANGUAGE plpgsql;

-- Storage bucket setup and policies
-- Note: You may need to create buckets manually in Supabase Dashboard if this fails
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('portfolio-images', 'portfolio-images', true),
  ('portfolio-documents', 'portfolio-documents', true),
  ('portfolio-private-videos', 'portfolio-private-videos', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Simple storage policies (allowing all operations for now)
-- You can make these more restrictive later based on your needs
CREATE POLICY "Allow all operations on portfolio images" ON storage.objects
  FOR ALL USING (bucket_id = 'portfolio-images');

CREATE POLICY "Allow all operations on portfolio documents" ON storage.objects
  FOR ALL USING (bucket_id = 'portfolio-documents');

CREATE POLICY "Allow all operations on portfolio videos" ON storage.objects
  FOR ALL USING (bucket_id = 'portfolio-private-videos');

-- Add some sample data
INSERT INTO blogs (title, slug, summary, content, category, tags, status, featured, origin) VALUES
('Blockchain: The Backbone of the Digital Revolution', 'blockchain-the-strength-of-the-digital-revolution', 
 'Blockchain is a decentralized, secure digital ledger technology that enables transparent, secure, and immutable record-keeping across distributed networks.',
 '# Blockchain: The Backbone of the Digital Revolution

Blockchain technology has emerged as one of the most revolutionary innovations of our time. At its core, blockchain is a decentralized, secure digital ledger that enables transparent, secure, and immutable record-keeping across distributed networks.

## What is Blockchain?

A blockchain is essentially a chain of blocks, where each block contains a collection of transactions or data. What makes it unique is that it''s distributed across multiple computers (nodes) in a network, making it virtually impossible to hack or manipulate.

## Key Features

### Decentralization
Unlike traditional systems that rely on a central authority, blockchain distributes control across the entire network.

### Security
Advanced cryptographic techniques ensure that data cannot be altered once it''s been recorded.

### Transparency
All transactions are visible to network participants, creating unprecedented transparency.

## Applications Beyond Cryptocurrency

While most people know blockchain through Bitcoin and other cryptocurrencies, the technology has applications in:

- Supply chain management
- Healthcare records
- Voting systems
- Digital identity verification
- Smart contracts

## The Future of Web3

As we move towards a more decentralized internet (Web3), blockchain technology will continue to play a crucial role in reshaping how we interact, transact, and share information online.

The potential is limitless, and we''re just scratching the surface of what''s possible with this revolutionary technology.',
 'Web3', 
 ARRAY['Blockchain', 'Web3', 'Decentralization', 'Technology'], 
 'published', 
 false, 
 'default')
ON CONFLICT (slug) DO NOTHING;