-- Migration script to add missing profile columns
-- Run this in your Supabase SQL editor if you already have a profile table

-- Add avatar_url column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'avatar_url') THEN
        ALTER TABLE profile ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Add resume_url column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'resume_url') THEN
        ALTER TABLE profile ADD COLUMN resume_url TEXT;
    END IF;
END $$;

-- Add story column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profile' AND column_name = 'story') THEN
        ALTER TABLE profile ADD COLUMN story TEXT;
    END IF;
END $$;

-- Update existing profile with default story if story is null
UPDATE profile 
SET story = 'I''m a data analyst transitioning from Web2 to Web3, with strong foundations in Python, SQL, and statistical modeling. I began my analytics journey in 2022, building skills in data querying, visualization, and predictive analytics. By 2023, I had advanced into statistical modeling, regression analysis, and machine learning applications, applying analytics to solve real-world problems in traditional finance.

In 2024, I became fascinated by blockchain''s open datasets and began studying DeFi protocols, smart contracts, and tokenomics. This curiosity led me to start hands-on Web3 analytics projects in 2025. For example, I built an Ethereum gas price dashboard that identified 20% cost savings opportunities, and created 8 Dune Analytics dashboards tracking over $100M in DeFi volumes.

Today, I work with Dune Analytics and Flipside Crypto to analyze wallet behavior, DeFi activity, and NFT markets, while also learning Solidity basics to deepen my understanding of blockchain data structures. My goal is to establish myself as a Web3 Data & AI Specialist, bridging the rigor of traditional analytics with the transparency and innovation of blockchain data.'
WHERE story IS NULL OR story = '';

-- Show current profile data
SELECT * FROM profile;