-- Dashboard table schema for Dune embed system
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dashboards table
CREATE TABLE IF NOT EXISTS dashboards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  dashboard_id TEXT NOT NULL UNIQUE,
  query_id TEXT,
  visualization_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  complexity TEXT DEFAULT 'intermediate' CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
  parameters JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  dune_url TEXT,
  embed_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
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
  has_custom_report BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dashboards_dashboard_id ON dashboards(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_category ON dashboards(category);
CREATE INDEX IF NOT EXISTS idx_dashboards_featured ON dashboards(featured);
CREATE INDEX IF NOT EXISTS idx_dashboards_is_active ON dashboards(is_active);
CREATE INDEX IF NOT EXISTS idx_dashboards_sort_order ON dashboards(sort_order);
CREATE INDEX IF NOT EXISTS idx_dashboards_created_at ON dashboards(created_at DESC);

-- Create updated_at trigger for dashboards
CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (update with proper auth later)
CREATE POLICY "Allow all operations on dashboards" ON dashboards FOR ALL USING (true);

-- Insert some sample dashboards
INSERT INTO dashboards (dashboard_id, title, description, category, tags, featured, complexity, embed_url, sort_order, is_active) VALUES
('active_wallets', 'Active Wallet Tracker', 'Track daily active wallet addresses across major blockchains', 'analytics', ARRAY['ethereum', 'wallets', 'activity'], true, 'intermediate', null, 1, true),
('gas_tracker', 'Gas Price Monitor', 'Real-time Ethereum gas price monitoring and predictions', 'infrastructure', ARRAY['ethereum', 'gas', 'fees'], true, 'beginner', null, 2, true),
('defi_tvl', 'DeFi TVL Dashboard', 'Total Value Locked across major DeFi protocols', 'defi', ARRAY['defi', 'tvl', 'protocols'], false, 'intermediate', null, 3, true),
('nft_volume', 'NFT Market Volume', 'Daily trading volume analysis for major NFT collections', 'nft', ARRAY['nft', 'trading', 'volume'], false, 'advanced', null, 4, true),
('gaming_metrics', 'Gaming Token Analytics', 'Performance metrics for gaming and metaverse tokens', 'gaming', ARRAY['gaming', 'tokens', 'metaverse'], false, 'intermediate', null, 5, true)
ON CONFLICT (dashboard_id) DO NOTHING;