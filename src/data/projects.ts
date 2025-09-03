// Portfolio Projects Data
// To add a new project, simply add a new object to this array following the same structure

export interface Project {
  id?: string
  title: string
  description: string
  tech: string[]
  category: string
  status: 'Live' | 'Learning' | 'Complete' | 'Development' | 'Beta'
  demoUrl: string
  githubUrl: string
  metrics: Record<string, string>
  featured?: boolean
  timeline?: '2022-2023' | '2024' | '2025'
  phase?: 'Traditional Analytics' | 'Exploratory Phase' | 'Web3 Analytics'
  image?: string
  imageAlt?: string
}

export const projects: Project[] = [
  {
    title: "Ethereum Gas Price Analysis Dashboard",
    description: "Built interactive dashboard analyzing 50K+ gas price data points, discovering 20% cost savings opportunities during off-peak hours. Identified optimal transaction timing patterns that save users an average of $15 per transaction during high network congestion.",
    tech: ["Python", "Pandas", "Matplotlib", "Web3.py", "Jupyter"],
    category: "Analytics",
    status: "Live",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      timeframe: "6 months",
      datapoints: "50K+",
      savings: "20% avg"
    },
    featured: true,
    timeline: '2025',
    phase: 'Web3 Analytics',
    image: '/images/projects/gas-price-dashboard.png',
    imageAlt: 'Ethereum Gas Price Analysis Dashboard showing gas price trends and cost optimization insights'
  },
  {
    title: "DeFi TVL Trend Analysis",
    description: "Analyzed $50B+ in Total Value Locked across 10 major DeFi protocols, revealing 3 seasonal patterns that predict 85% of major TVL movements. Created automated SQL queries reducing manual analysis time by 70%.",
    tech: ["Dune Analytics", "SQL", "Python", "Seaborn", "Pandas"],
    category: "Analytics",
    status: "Live",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      protocols: "10+",
      queries: "15+",
      accuracy: "85%"
    },
    timeline: '2025',
    phase: 'Web3 Analytics',
    image: '/images/projects/defi-tvl-analysis.png',
    imageAlt: 'DeFi TVL trend analysis showing Total Value Locked patterns across major protocols'
  },
  {
    title: "Token Price Prediction Model",
    description: "Developed ML model achieving 62% accuracy in predicting short-term crypto price movements using 5 technical indicators. Processed 10K+ historical data points to identify patterns in Bitcoin, Ethereum, and Solana price action.",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "CoinGecko API"],
    category: "AI x Web3",
    status: "Learning",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      accuracy: "62%",
      datapoints: "10K+",
      tokens: "3 studied"
    }
  },
  {
    title: "Automated DeFi Portfolio Tracker",
    description: "Built automated portfolio tracker managing $25K+ across 10+ DeFi positions with 95% accuracy in real-time valuation. Automated daily updates eliminated 2 hours of manual price tracking, achieving 15% ROI improvement through better timing insights.",
    tech: ["Python", "Excel", "Pandas", "CoinGecko API", "Openpyxl"],
    category: "Dashboards",
    status: "Live",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      positions: "10+",
      accuracy: "95%",
      roi_improvement: "15%"
    }
  },
  {
    title: "Basic Smart Contract Analysis",
    description: "Learning project analyzing simple Solidity contracts to understand gas optimization patterns. Used static analysis tools and manual code review to identify common efficiency improvements in token contracts.",
    tech: ["Solidity", "Remix IDE", "Python", "Web3.py", "Slither"],
    category: "Smart Contracts",
    status: "Learning",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      contracts: "5 analyzed",
      patterns: "3 identified",
      gas_savings: "15% avg"
    }
  },
  {
    title: "DeFi Analytics Dashboard Suite",
    description: "Created 8 Dune Analytics dashboards tracking $100M+ in DEX volumes and lending protocols, generating 500+ community views. Advanced SQL queries revealed 40% increase in stablecoin adoption during market volatility periods.",
    tech: ["Dune Analytics", "SQL", "PostgreSQL", "Data Visualization"],
    category: "Dashboards",
    status: "Live",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      dashboards: "8 created",
      views: "500+",
      volume_tracked: "$100M+"
    },
    featured: true,
    timeline: '2025',
    phase: 'Web3 Analytics',
    image: '/images/projects/dune-dashboard-collection.png',
    imageAlt: 'Collection of Dune Analytics dashboards showing DeFi protocol analytics and trading volumes'
  },
  {
    title: "Yield Farming Risk Assessment Framework",
    description: "Developed comprehensive risk assessment framework analyzing 12 protocols with $500M+ TVL, identifying 3 high-risk indicators that predicted 80% of major protocol failures. Framework reduced investment risk exposure by 25% through early warning signals.",
    tech: ["Python", "Pandas", "Statistical Analysis", "Jupyter", "Matplotlib"],
    category: "DeFi",
    status: "Complete",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      protocols: "12 studied",
      prediction_accuracy: "80%",
      risk_reduction: "25%"
    }
  },
  {
    title: "Traditional Finance Portfolio Migration Analysis",
    description: "Comparative analysis of traditional investment portfolios versus DeFi alternatives. Used statistical methods to evaluate risk-adjusted returns and correlation patterns between traditional and crypto assets.",
    tech: ["Python", "Pandas", "NumPy", "Yahoo Finance API", "Statistical Analysis"],
    category: "Analytics",
    status: "Complete",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      assets: "20 traditional, 10 crypto",
      timeframe: "2 years",
      correlations: "analyzed"
    },
    timeline: '2022-2023',
    phase: 'Traditional Analytics'
  }
]

// Available categories for projects
export const projectCategories = [
  "All", 
  "Analytics", 
  "Smart Contracts", 
  "Dashboards", 
  "AI x Web3", 
  "DeFi", 
  "Learning"
]

// Template for adding new projects - copy this and fill in your details
export const newProjectTemplate: Project = {
  title: "Your Project Title",
  description: "Detailed description of what you built, what you learned, and the impact/results. Be specific about the problem you solved and your approach.",
  tech: ["Technology1", "Technology2", "Technology3"], // List all technologies used
  category: "Analytics", // Must be one of the categories above
  status: "Learning", // Live, Learning, Complete, Development, or Beta
  demoUrl: "#", // Link to live demo or "#" if none
  githubUrl: "#", // Link to GitHub repo or "#" if private
  metrics: {
    // Add relevant metrics for your project
    // Examples: "timeframe: '2 months'", "accuracy: '85%'", "users: '50+'", etc.
    metric1: "value1",
    metric2: "value2"
  },
  featured: false // Set to true if you want this project highlighted
}