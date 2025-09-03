import type { Metadata } from 'next'
import Link from 'next/link'
import { ProfileCard } from '@/components/ui/profile-card'
import { SkillCard } from '@/components/ui/skill-card'

export const metadata: Metadata = {
  title: "About | Web3 Data Analyst Journey from Traditional to Blockchain Analytics",
  description: "Learn about my transition from traditional data analytics (Python, SQL, Excel) to Web3 blockchain analytics (Dune Analytics, DeFi protocols). 3+ years experience in statistical modeling, now building expertise in on-chain data analysis and smart contract analysis.",
  keywords: ["About Web3 Data Analyst", "Career Transition", "Traditional Analytics to Web3", "Python SQL Experience", "Dune Analytics Learning", "DeFi Protocol Analysis", "Statistical Modeling", "Blockchain Data Analysis"],
}

export default function About() {
  const skills = [
    {
      title: 'Core Data Analytics',
      description: 'Advanced • 3+ Years Experience',
      icon: '📊',
      color: 'primary-500',
      gradient: 'from-primary-500/20 to-primary-500/5',
      level: 'Advanced' as const,
      progress: 85,
      skills: [
        'Python for Data Analysis (Advanced)',
        'SQL Database Querying (Advanced)',
        'Data Visualization (Proficient)',
        'Pandas & NumPy Libraries (Advanced)',
        'Excel & Statistical Analysis (Advanced)'
      ]
    },
    {
      title: 'Web3 Analytics',
      description: 'Learning • Active Projects',
      icon: '📊',
      color: 'cyber-500',
      gradient: 'from-cyber-500/20 to-cyber-500/5',
      level: 'Learning' as const,
      progress: 40,
      skills: [
        'Dune Analytics Dashboards (Proficient)',
        'On-chain Data Queries (Learning)',
        'Solidity Basics (Learning)',
        'Blockchain Data Structures (Learning)',
        'DeFi Protocol Analysis (Learning)'
      ]
    },
    {
      title: 'Statistical Analysis & ML',
      description: 'Proficient • Applied Experience',
      icon: '🔬',
      color: 'purple-500',
      gradient: 'from-purple-500/20 to-purple-500/5',
      level: 'Proficient' as const,
      progress: 70,
      skills: [
        'Statistical Modeling (Proficient)',
        'Predictive Analytics (Proficient)',
        'Regression Analysis (Advanced)',
        'A/B Testing & Hypothesis Testing (Proficient)',
        'Machine Learning (Learning)'
      ]
    }
  ]

  const journey = [
    {
      year: '2022',
      title: 'Entered Data Analytics',
      description: 'Began learning Python, SQL, and Excel; built first projects in traditional analytics',
      icon: '📊'
    },
    {
      year: '2023',
      title: 'Advanced Analytics Skills',
      description: 'Expanded into predictive modeling, regression, A/B testing, and visualization (Matplotlib, Seaborn, PowerBI)',
      icon: '📈'
    },
    {
      year: '2024',
      title: 'Exploring Blockchain Concepts',
      description: 'Studied DeFi mechanics, tokenomics, and blockchain fundamentals; prepared for transition into on-chain data analytics',
      icon: '🔍'
    },
    {
      year: '2025',
      title: 'Active Web3 Analytics Projects',
      description: 'Building Dune dashboards and Flipside queries to analyze wallet behaviors, DeFi protocols, and NFT markets. Created portfolio of case studies and dashboards',
      icon: '📈'
    },
    {
      year: 'Future',
      title: 'Web3 Data & AI Specialist Goal',
      description: 'Secure Web3 Data Analytics role or freelance projects. Build advanced dashboards and publish insights in DeFi analytics',
      icon: '🎯'
    }
  ]

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-cyber-500/30 bg-cyber-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-cyber-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-cyber-500">About Me</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-gradient">Transitioning from</span>
            <br />
            <span className="text-foreground">Web2 to Web3 Analytics</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Leveraging my <span className="text-primary-500 font-medium">traditional data analytics</span> background to explore 
            <span className="text-cyber-500 font-medium"> blockchain insights</span> and 
            <span className="text-purple-500 font-medium"> decentralized finance</span>.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <ProfileCard />
            </div>

            {/* Biography and Journey */}
            <div className="lg:col-span-2 space-y-12">
              {/* Biography */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">My Story</h2>
                  <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                    <p>
                      I'm a data analyst transitioning from Web2 to Web3, with strong foundations in Python, SQL, and statistical modeling. 
                      I began my analytics journey in 2022, building skills in data querying, visualization, and predictive analytics. 
                      By 2023, I had advanced into statistical modeling, regression analysis, and machine learning applications, 
                      applying analytics to solve real-world problems in traditional finance.
                    </p>
                    <p>
                      In 2024, I became fascinated by blockchain's open datasets and began studying DeFi protocols, smart contracts, and tokenomics. 
                      This curiosity led me to start hands-on Web3 analytics projects in 2025. For example, I built an 
                      <span className="text-primary-500 font-medium"> Ethereum gas price dashboard</span> that identified 20% cost savings opportunities, 
                      and created <span className="text-cyber-500 font-medium">8 Dune Analytics dashboards</span> tracking over $100M in DeFi volumes.
                    </p>
                    <p>
                      Today, I work with Dune Analytics and Flipside Crypto to analyze wallet behavior, DeFi activity, and NFT markets, 
                      while also learning Solidity basics to deepen my understanding of blockchain data structures. 
                      My goal is to establish myself as a <span className="text-purple-500 font-medium">Web3 Data & AI Specialist</span>, 
                      bridging the rigor of traditional analytics with the transparency and innovation of blockchain data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Technical <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              A comprehensive skill set spanning blockchain development, data analytics, and artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <SkillCard key={index} {...skill} />
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              My <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Key milestones in my Web3 and AI development career
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-cyber-500 to-purple-500 rounded-full"></div>
            
            <div className="space-y-12">
              {journey.map((item, index) => (
                <div key={index} className="relative flex items-start space-x-8">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-2xl border-4 border-background shadow-lg">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm card-hover">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                        <span className="text-sm font-medium text-cyber-500 bg-cyber-500/10 px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                      </div>
                      <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary-500/10 via-cyber-500/10 to-purple-500/10 border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Let's collaborate on your next Web3 project and unlock the potential of blockchain data and AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-500/30">
                  Start a Project
                </button>
              </Link>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 text-foreground font-semibold text-lg hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200">
                  Download Resume
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}