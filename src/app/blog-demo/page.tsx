'use client'

import { MediumBlogFeed } from '@/components/ui/medium-blog-feed'

// Sample data for demonstration
const samplePosts = [
  {
    title: "Mastering DeFi Analytics: A Complete Guide to On-Chain Data Analysis",
    subtitle: "Deep dive into decentralized finance analytics using Python, Web3.py, and popular data visualization tools. Learn how to analyze liquidity pools, yield farming strategies, and protocol performance metrics.",
    date: "2024-01-18T10:00:00Z",
    readTime: "12 min read",
    views: 3240,
    comments: 18,
    authorName: "Matthew Raphael",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=80",
    category: "DeFi Analytics",
    thumbnailUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&h=250&auto=format&q=80",
    slug: "mastering-defi-analytics-complete-guide",
    featured: true
  },
  {
    title: "Building Your First Dune Analytics Dashboard from Scratch",
    subtitle: "Step-by-step tutorial on creating powerful blockchain visualizations. From basic SQL queries to advanced analytics dashboards that track real-time protocol metrics and user behavior.",
    date: "2024-01-15T14:30:00Z",
    readTime: "8 min read",
    views: 2150,
    comments: 12,
    authorName: "Matthew Raphael",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=80",
    category: "Web3 Analytics",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&auto=format&q=80",
    slug: "building-dune-analytics-dashboard"
  },
  {
    title: "AI-Powered Cryptocurrency Trading Signals: Machine Learning Meets DeFi",
    subtitle: "Exploring the intersection of artificial intelligence and decentralized finance. Learn how to build ML models for predicting token prices, identifying arbitrage opportunities, and optimizing trading strategies.",
    date: "2024-01-12T09:15:00Z",
    readTime: "15 min read",
    views: 4680,
    comments: 31,
    authorName: "Matthew Raphael",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=80",
    category: "AI x Web3",
    thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&auto=format&q=80",
    slug: "ai-cryptocurrency-trading-signals"
  },
  {
    title: "From Traditional Analytics to Web3: A Career Transition Guide",
    subtitle: "Making the leap from traditional data analysis to blockchain analytics. Discover the skills you need, tools to learn, and career opportunities in the rapidly growing Web3 space.",
    date: "2024-01-10T16:45:00Z",
    readTime: "6 min read",
    views: 1890,
    comments: 8,
    authorName: "Matthew Raphael",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=80",
    category: "Career",
    slug: "traditional-analytics-to-web3-transition"
  },
  {
    title: "Understanding Ethereum Gas Fees Through Data Visualization",
    subtitle: "A comprehensive analysis of Ethereum network congestion, gas price patterns, and optimization strategies. Learn how to predict and minimize transaction costs using historical data.",
    date: "2024-01-08T11:20:00Z",
    readTime: "10 min read",
    views: 2740,
    comments: 15,
    authorName: "Matthew Raphael",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=80",
    category: "Ethereum",
    thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&auto=format&q=80",
    slug: "ethereum-gas-fees-data-visualization"
  }
]

export default function BlogDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Blog Component Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Two different blog listing components inspired by Medium's design, optimized for Web3 content and your portfolio branding.
          </p>
        </div>

        {/* Medium Blog Feed */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Medium-Style Blog Feed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Clean, minimal design closely mimicking Medium's blog feed with author info, categories, and bookmark functionality.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Medium-Style Blog Feed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                The Medium-style blog feed has been successfully integrated into the main blog page for non-featured posts.
                It provides a clean, minimal design that closely mimics Medium's interface with author info, categories, and bookmark functionality.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ✅ Featured posts use enhanced blog cards with rich metadata
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ✅ Regular posts use Medium-style clean feed layout
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ✅ Fully integrated with existing blog service and admin system
                </p>
              </div>
              <div className="mt-6">
                <a
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors duration-200"
                >
                  Visit Live Blog Page
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Note about Enhanced Blog Listing */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Enhanced Blog Listing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The enhanced blog listing component has been successfully integrated into the main blog page at <code>/blog</code>.
              It features rich blog cards with view counts, hover effects, and grid layouts that work with your existing blog service and admin system.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Visit <a href="/blog" className="text-primary-600 hover:underline font-medium">/blog</a> to see the enhanced blog listing in action with real data from your blog service.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The component automatically adapts to your BlogPostData structure and maintains all existing functionality like search, filtering, and admin integration.
              </p>
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="mt-20 bg-gradient-to-br from-primary-500/5 to-primary-400/5 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Implementation Notes
          </h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              <strong>BlogListing:</strong> More feature-rich component with view counts, comments, featured badges, and flexible layouts.
              Best for portfolio sites that need detailed post metadata.
            </p>
            <p>
              <strong>MediumBlogFeed:</strong> Clean, minimal component that closely mimics Medium's design. Perfect for content-focused blogs
              with emphasis on readability and author information.
            </p>
            <p>
              <strong>Responsive Design:</strong> Both components are fully responsive with mobile-first layouts. Images stack on top for mobile,
              float to the right on desktop.
            </p>
            <p>
              <strong>Dark Mode:</strong> Full dark mode support using Tailwind's dark: modifiers and CSS custom properties.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}