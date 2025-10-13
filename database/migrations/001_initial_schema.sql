-- =====================================================
-- Web3 Portfolio - Initial Database Schema
-- =====================================================
-- This migration creates the complete database schema for the Web3 Portfolio application.
-- Run this in your Supabase SQL editor to set up a new database instance.
--
-- Tables:
--   - blogs: Blog posts and articles
--   - projects: Portfolio projects
--   - dashboards: Dune Analytics dashboards
--   - profile: User profile information
--   - media: Media files and assets
--   - activities: Activity tracking
--
-- Author: Matthew Raphael (RaphDeAnalyst)
-- Date: 2024
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- BLOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author_name TEXT NOT NULL DEFAULT 'Matthew Raphael',
    author_avatar TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    read_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured BOOLEAN NOT NULL DEFAULT false,
    featured_image TEXT,
    views INTEGER NOT NULL DEFAULT 0,
    origin TEXT NOT NULL DEFAULT 'user' CHECK (origin IN ('default', 'user')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Blogs indexes for performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN(tags);

-- Add comments for documentation
COMMENT ON TABLE blogs IS 'Blog posts and articles for the portfolio';
COMMENT ON COLUMN blogs.slug IS 'URL-friendly unique identifier for the blog post';
COMMENT ON COLUMN blogs.status IS 'Publication status: draft or published';
COMMENT ON COLUMN blogs.origin IS 'Source of the blog post: default (seeded) or user (created by admin)';
COMMENT ON COLUMN blogs.views IS 'Number of times the blog post has been viewed';

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    github_url TEXT,
    demo_url TEXT,
    dune_url TEXT,
    blog_post_slug TEXT,
    image TEXT,
    metrics JSONB,
    features TEXT[],
    challenges TEXT,
    learnings TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Projects indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_tech_stack ON projects USING GIN(tech_stack);

-- Add comments for documentation
COMMENT ON TABLE projects IS 'Portfolio projects showcasing Web3 and data analytics work';
COMMENT ON COLUMN projects.tech_stack IS 'Array of technologies used in the project';
COMMENT ON COLUMN projects.featured IS 'Whether the project is featured on the homepage (max 3)';
COMMENT ON COLUMN projects.metrics IS 'JSON object containing project metrics and KPIs';
COMMENT ON COLUMN projects.blog_post_slug IS 'Reference to related blog post if available';

-- =====================================================
-- DASHBOARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id TEXT NOT NULL,
    query_id TEXT,
    visualization_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT false,
    complexity TEXT,
    parameters JSONB,
    thumbnail_url TEXT,
    dune_url TEXT,
    embed_url TEXT,
    embed_urls JSONB,
    sort_order INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    -- Report fields for detailed analytics
    report_key_finding TEXT,
    report_business_impact TEXT,
    report_methodology TEXT,
    report_timeframe TEXT,
    report_confidence_level TEXT,
    report_business_context TEXT,
    report_key_insights TEXT[],
    report_data_sources TEXT[],
    report_analytical_approach TEXT,
    report_assumptions TEXT[],
    report_limitations TEXT[],
    report_recommendations_protocols TEXT[],
    report_recommendations_investors TEXT[],
    report_recommendations_strategic TEXT[],
    report_technical_implementation_link TEXT,
    report_code_repository_link TEXT,
    report_related_projects TEXT[],
    report_reading_time INTEGER,
    report_update_frequency TEXT,
    has_custom_report BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Dashboards indexes for performance
CREATE INDEX IF NOT EXISTS idx_dashboards_dashboard_id ON dashboards(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_featured ON dashboards(featured);
CREATE INDEX IF NOT EXISTS idx_dashboards_is_active ON dashboards(is_active);
CREATE INDEX IF NOT EXISTS idx_dashboards_category ON dashboards(category);
CREATE INDEX IF NOT EXISTS idx_dashboards_tags ON dashboards USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_dashboards_sort_order ON dashboards(sort_order);

-- Add comments for documentation
COMMENT ON TABLE dashboards IS 'Dune Analytics dashboards and visualizations';
COMMENT ON COLUMN dashboards.dashboard_id IS 'Dune dashboard ID for embedding';
COMMENT ON COLUMN dashboards.embed_url IS 'Legacy single embed URL (deprecated)';
COMMENT ON COLUMN dashboards.embed_urls IS 'Array of embed URLs or chart objects for multiple charts';
COMMENT ON COLUMN dashboards.has_custom_report IS 'Whether the dashboard has a custom report/analysis';

-- =====================================================
-- PROFILE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    bio TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    tools TEXT[] NOT NULL DEFAULT '{}',
    values TEXT[] NOT NULL DEFAULT '{}',
    contact_email TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    story TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE profile IS 'User profile information (singleton table - should only have 1 row)';
COMMENT ON COLUMN profile.skills IS 'Array of technical skills';
COMMENT ON COLUMN profile.tools IS 'Array of tools and technologies used';
COMMENT ON COLUMN profile.values IS 'Array of personal/professional values';

-- =====================================================
-- MEDIA TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Media indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE media IS 'Media files and assets (images, videos, documents)';
COMMENT ON COLUMN media.type IS 'MIME type of the media file';
COMMENT ON COLUMN media.size IS 'File size in bytes';

-- =====================================================
-- ACTIVITIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    intensity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Activities indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

-- Add comments for documentation
COMMENT ON TABLE activities IS 'Activity tracking for the portfolio (GitHub-style contribution graph)';
COMMENT ON COLUMN activities.intensity IS 'Activity intensity level (1-5)';

-- =====================================================
-- TRIGGERS FOR AUTO-UPDATING TIMESTAMPS
-- =====================================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to blogs table
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to projects table
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to dashboards table
CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to profile table
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read access for published blogs"
    ON blogs FOR SELECT
    USING (status = 'published');

CREATE POLICY "Public read access for projects"
    ON projects FOR SELECT
    USING (true);

CREATE POLICY "Public read access for active dashboards"
    ON dashboards FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public read access for profile"
    ON profile FOR SELECT
    USING (true);

CREATE POLICY "Public read access for media"
    ON media FOR SELECT
    USING (true);

CREATE POLICY "Public read access for activities"
    ON activities FOR SELECT
    USING (true);

-- Authenticated users have full access (for admin operations)
CREATE POLICY "Authenticated users full access to blogs"
    ON blogs FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access to projects"
    ON projects FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access to dashboards"
    ON dashboards FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access to profile"
    ON profile FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access to media"
    ON media FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users full access to activities"
    ON activities FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default profile (if not exists)
INSERT INTO profile (name, bio, skills, tools, values, story)
VALUES (
    'Matthew Raphael',
    'Web3 Data Analyst & Blockchain Developer',
    ARRAY['Blockchain Analytics', 'Smart Contracts', 'Data Visualization', 'DeFi', 'SQL', 'Python', 'TypeScript'],
    ARRAY['Dune Analytics', 'Etherscan', 'The Graph', 'Next.js', 'Supabase', 'Tailwind CSS'],
    ARRAY['Transparency', 'Innovation', 'Community', 'Education'],
    'Passionate about making blockchain data accessible and actionable.'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Run this migration first, then run subsequent migrations in order:
-- - 002_add_media_metadata.sql (adds additional media table columns)
-- =====================================================
