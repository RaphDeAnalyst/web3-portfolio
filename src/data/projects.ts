// Portfolio Projects Data
// To add a new project, simply add a new object to this array following the same structure

export interface Project {
  title: string
  description: string
  tech: string[]
  category: string
  status: 'Live' | 'Learning' | 'Complete' | 'Development' | 'Beta'
  demoUrl: string
  githubUrl: string
  metrics: Record<string, string>
  featured?: boolean
}

export const projects: Project[] = [
  {
    title: "Ethereum Gas Price Analysis Dashboard",
    description: "Interactive dashboard analyzing Ethereum gas prices over time using Python and Matplotlib. Explored correlations between network congestion, transaction volume, and gas costs to identify optimal transaction timing patterns.",
    tech: ["Python", "Pandas", "Matplotlib", "Web3.py", "Jupyter"],
    category: "Analytics",
    status: "Live",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      timeframe: "6 months",
      datapoints: "50K+",
      insights: "5 key findings"
    },
    featured: true
  },
  {
    title: "DeFi TVL Trend Analysis",
    description: "Statistical analysis of Total Value Locked trends across major DeFi protocols using Dune Analytics queries. Identified seasonal patterns and protocol performance metrics through SQL-based data extraction and Python visualization.",
    tech: ["Dune Analytics", "SQL", "Python", "Seaborn", "Pandas"],
    category: "Analytics",
    status: "Live",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      protocols: "10+",
      queries: "15+",
      timeframe: "1 year"
    }
  },
  {
    title: "Simple Token Price Predictor",
    description: "Learning project implementing basic linear regression to predict short-term cryptocurrency price movements. Used historical price data and simple technical indicators to explore predictive modeling concepts.",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "CoinGecko API"],
    category: "AI x Web3",
    status: "Learning",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      accuracy: "62%",
      features: "5 indicators",
      tokens: "3 studied"
    }
  },
  {
    title: "Personal DeFi Portfolio Tracker",
    description: "Excel-based portfolio tracking system enhanced with Python automation for fetching live prices. Calculates portfolio performance, asset allocation, and ROI across different DeFi positions and staking rewards.",
    tech: ["Python", "Excel", "Pandas", "CoinGecko API", "Openpyxl"],
    category: "Dashboards",
    status: "Live",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      positions: "10+",
      automation: "daily updates",
      roi_tracking: "6 months"
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
    title: "Dune Analytics Dashboard Collection",
    description: "Series of Dune Analytics dashboards exploring different aspects of DeFi: DEX volumes, lending protocol usage, and stablecoin adoption. Focused on developing SQL skills for blockchain data querying.",
    tech: ["Dune Analytics", "SQL", "PostgreSQL", "Data Visualization"],
    category: "Dashboards",
    status: "Live",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      dashboards: "8 created",
      views: "500+",
      queries: "25+"
    },
    featured: true
  },
  {
    title: "Yield Farm Risk Assessment Study",
    description: "Research project comparing risk-reward profiles of different yield farming strategies. Used historical APY data and statistical analysis to evaluate the stability and sustainability of various protocols.",
    tech: ["Python", "Pandas", "Statistical Analysis", "Jupyter", "Matplotlib"],
    category: "DeFi",
    status: "Complete",
    demoUrl: "#",
    githubUrl: "#",
    metrics: {
      protocols: "12 studied",
      timeframe: "3 months",
      metrics: "6 risk factors"
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
    }
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
export const newProjectTemplate: Omit<Project, 'title' | 'description'> = {
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