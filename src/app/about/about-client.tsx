'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/lib/logger'
import Link from 'next/link'
import { ProfileCard } from '@/components/ui/profile-card'
import { SkillCard } from '@/components/ui/skill-card'
import { StructuredData } from '@/components/seo/StructuredData'
import { profileService } from '@/lib/service-switcher'
import { BarChart3, Link2, TrendingUp } from 'lucide-react'

interface AboutClientProps {
  initialProfile?: any
}

export default function AboutClient({ initialProfile }: AboutClientProps) {
  const [profile, setProfile] = useState<any>(initialProfile || null)
  const [loading, setLoading] = useState(!initialProfile)

  useEffect(() => {
    // Only load profile if we don't have initial data
    if (!initialProfile) {
      const loadProfile = async () => {
        try {
          const profileData = await profileService.getProfile()
          setProfile(profileData)
        } catch (error) {
          logger.error('Error loading profile', error)
        } finally {
          setLoading(false)
        }
      }
      loadProfile()
    }
  }, [initialProfile])
  const skills = [
    {
      title: 'Core Data Analytics',
      description: 'Advanced • 3+ Years Experience',
      icon: <BarChart3 className="w-full h-full" />,
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
      icon: <Link2 className="w-full h-full" />,
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
      icon: <TrendingUp className="w-full h-full" />,
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

  const faqData = [
    {
      question: "What is your background in data analytics?",
      answer: "I have 3+ years of experience in traditional data analytics with expertise in Python, SQL, Excel, and data visualization tools like Power BI and Tableau. I've worked on various projects involving database design, ETL processes, and statistical modeling."
    },
    {
      question: "How did you transition into Web3 analytics?",
      answer: "After mastering traditional analytics, I began studying blockchain fundamentals, DeFi mechanics, and tokenomics in 2024. I've since built multiple Dune Analytics dashboards and am actively analyzing on-chain data for DeFi protocols and wallet behaviors."
    },
    {
      question: "What Web3 analytics tools do you use?",
      answer: "I primarily use Dune Analytics for on-chain data analysis, along with Flipside Crypto for additional blockchain insights. I combine these with my Python and SQL skills to create comprehensive analytics solutions for Web3 projects."
    },
    {
      question: "Do you offer consultation services?",
      answer: "Yes, I provide Web3 data analytics consultation, custom dashboard development using Dune Analytics, DeFi protocol analysis, and blockchain data insights. I work with both individual projects and organizations looking to understand their on-chain metrics."
    },
    {
      question: "What types of projects do you work on?",
      answer: "I specialize in DeFi protocol analysis, wallet behavior tracking, token economics research, NFT market analytics, and creating data-driven insights for Web3 projects. Each project includes custom dashboards and detailed analytical reports."
    }
  ]

  return (
    <>
      <StructuredData type="faq" data={faqData} />
      <StructuredData type="localbusiness" />
    <div className="min-h-screen pt-28 pb-20 sm:pt-32">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
            <span className="text-sm font-medium text-blue-500">About Me</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-gradient">Transitioning from</span>
            <br />
            <span className="text-foreground">Web2 to Web3 Analytics</span>
          </h1>

          <p className="text-xl sm:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Leveraging my <span className="text-foreground font-medium">traditional data analytics</span> background to explore
            <span className="text-foreground font-medium"> blockchain insights</span> and
            <span className="text-foreground font-medium"> decentralized finance</span>.
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
                              .replace(/Ethereum gas price dashboard/g, '<span class="text-foreground font-semibold">Ethereum gas price dashboard</span>')
                              .replace(/8 Dune Analytics dashboards/g, '<span class="text-foreground font-semibold">8 Dune Analytics dashboards</span>')
                              .replace(/Web3 Data & AI Specialist/g, '<span class="text-foreground font-semibold">Web3 Data & AI Specialist</span>')
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card-light/30 dark:bg-card-dark/30">
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
            {/* Timeline line - Hidden on mobile, visible on sm+ */}
            <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-0.5 bg-foreground/20 rounded-full"></div>

            <div className="space-y-6 sm:space-y-12">
              {journey.map((item, index) => (
                <div key={index} className="relative">
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-white bg-primary-600 px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-foreground/70 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-start space-x-8">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-600 border-4 border-background shadow-lg flex items-center justify-center relative z-10">
                      <span className="text-white font-bold text-sm">{item.year}</span>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 pb-8">
                      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                        <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-foreground/70">
              Common questions about my Web3 data analytics expertise
            </p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="p-6 rounded-2xl bg-card-light dark:bg-card-dark border border-gray-200/30 dark:border-card-border shadow-card-light dark:shadow-card-dark">
                <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-foreground/70 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card-light/30 dark:bg-card-dark/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-xl text-foreground/70">
              I&apos;m always interested in discussing Web3 data analytics opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Professional Services</h3>
              <ul className="space-y-2 text-foreground/70">
                <li>• Custom Dune Analytics dashboards</li>
                <li>• DeFi protocol analysis</li>
                <li>• Wallet behavior tracking</li>
                <li>• On-chain data consulting</li>
                <li>• Web3 analytics training</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Collaboration Areas</h3>
              <ul className="space-y-2 text-foreground/70">
                <li>• Blockchain data research</li>
                <li>• Token economics analysis</li>
                <li>• NFT market insights</li>
                <li>• DeFi yield optimization</li>
                <li>• Web3 growth analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-card-light dark:bg-card-dark border border-gray-200/30 dark:border-card-border shadow-card-light dark:shadow-card-dark">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Let&apos;s collaborate on your next Web3 project and unlock the potential of blockchain data and AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-4 bg-storj-navy text-white rounded-storj font-semibold text-lg hover:bg-storj-blue hover:transform hover:translate-y-[-1px] transition-all duration-200 shadow-storj-lg">
                  Start a Project
                </button>
              </Link>
              {profile?.resume ? (
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 text-foreground font-semibold text-lg hover:border-foreground hover:bg-foreground/5 transition-all duration-200">
                    Download Resume
                  </button>
                </a>
              ) : (
                <button
                  disabled
                  className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold text-lg opacity-50 cursor-not-allowed"
                >
                  Resume Not Available
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}