'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProfileCard } from '@/components/ui/profile-card'
import { SkillCard } from '@/components/ui/skill-card'
import { profileService } from '@/lib/service-switcher'

export default function About() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await profileService.getProfile()
        setProfile(profileData)
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])
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
        'Python for Data Analysis',
        'SQL Database Querying',
        'Pandas & NumPy Libraries',
        'Excel & Data Processing',
        'Database Design & ETL'
      ]
    },
    {
      title: 'Web3 Analytics',
      description: 'Proficient • Active Projects',
      icon: '🔗',
      color: 'primary-600',
      gradient: 'from-primary-600/20 to-primary-600/5',
      level: 'Proficient' as const,
      progress: 70,
      skills: [
        'Dune Analytics Dashboards',
        'On-chain Data Queries',
        'Solidity Basics',
        'Blockchain Data Structures',
        'DeFi Protocol Analysis'
      ]
    },
    {
      title: 'Visualization & Insight',
      description: 'Proficient • Applied Experience',
      icon: '📈',
      color: 'primary-400',
      gradient: 'from-primary-400/20 to-primary-400/5',
      level: 'Proficient' as const,
      progress: 70,
      skills: [
        'Dashboard Development',
        'Tableau & PowerBI',
        'Statistical Modeling',
        'Business Intelligence',
        'Data Storytelling'
      ]
    }
  ]

  const journey = [
    {
      year: '2022',
      title: 'Entered Data Analytics',
      description: 'Began learning Python, SQL, and Excel; built first projects in traditional analytics'
    },
    {
      year: '2023',
      title: 'Advanced Analytics Skills',
      description: 'Expanded into predictive modeling, regression, A/B testing, and visualization (Matplotlib, Seaborn, PowerBI)'
    },
    {
      year: '2024',
      title: 'Exploring Blockchain Concepts',
      description: 'Studied DeFi mechanics, tokenomics, and blockchain fundamentals; prepared for transition into on-chain data analytics'
    },
    {
      year: '2025',
      title: 'Active Web3 Analytics Projects',
      description: 'Building Dune dashboards and Flipside queries to analyze wallet behaviors, DeFi protocols, and NFT markets. Created portfolio of case studies and dashboards'
    },
    {
      year: 'Future',
      title: 'Web3 Data & AI Specialist Goal',
      description: 'Secure Web3 Data Analytics role or freelance projects. Build advanced dashboards and publish insights in DeFi analytics'
    }
  ]

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-primary-500">About Me</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-gradient">Transitioning from</span>
            <br />
            <span className="text-foreground">Web2 to Web3 Analytics</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Leveraging my <span className="text-primary-500 font-medium">traditional data analytics</span> background to explore 
            <span className="text-primary-600 font-medium"> blockchain insights</span> and
            <span className="text-primary-500 font-medium"> decentralized finance</span>.
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">My Story</h2>
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                      {profile?.story ? (
                        profile.story.split('\n\n').map((paragraph: string, index: number) => (
                          <p key={index} dangerouslySetInnerHTML={{ 
                            __html: paragraph
                              .replace(/Ethereum gas price dashboard/g, '<span class="text-primary-500 font-medium">Ethereum gas price dashboard</span>')
                              .replace(/8 Dune Analytics dashboards/g, '<span class="text-primary-600 font-medium">8 Dune Analytics dashboards</span>')
                              .replace(/Web3 Data & AI Specialist/g, '<span class="text-primary-500 font-medium">Web3 Data & AI Specialist</span>')
                          }} />
                        ))
                      ) : (
                        <p>Loading story...</p>
                      )}
                    </div>
                  )}
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
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-cyber-500 to-purple-500 rounded-full"></div>
            
            <div className="space-y-8 sm:space-y-12">
              {journey.map((item, index) => (
                <div key={index} className="relative flex flex-col space-y-4 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-8">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 mx-auto sm:mx-0 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 border-4 border-background shadow-lg">
                  </div>
                  
                  <div className="flex-1 pb-6 sm:pb-8">
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
              {profile?.resume ? (
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 text-foreground font-semibold text-lg hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200">
                    Download Resume
                  </button>
                </a>
              ) : (
                <button 
                  disabled 
                  className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 text-foreground/50 font-semibold text-lg opacity-50 cursor-not-allowed"
                >
                  Resume Not Available
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}